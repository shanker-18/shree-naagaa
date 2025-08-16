import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

// Define a local User type based on Firebase
interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
    address?: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, userData: Omit<UserProfile, 'id' | 'email'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Omit<UserProfile, 'id'>>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to our User type
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          user_metadata: {
            full_name: firebaseUser.displayName || '',
          }
        };
        setUser(appUser);
        
        // Try to get profile from localStorage
        const savedProfile = localStorage.getItem(`profile_${firebaseUser.uid}`);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          // Create a basic profile
          const newProfile: UserProfile = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            phone: '',
            address: ''
          };
          setProfile(newProfile);
          localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(newProfile));
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const saveProfileToLocalStorage = (userId: string, profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
    } else {
      localStorage.removeItem(`profile_${userId}`);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Profile will be loaded by the auth state listener
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error.message);
      let errorMessage = 'Failed to sign in';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      // Use browserPopupRedirectResolver to help with Cross-Origin-Opener-Policy issues
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      const firebaseUser = result.user;
      
      // Check if we have a profile for this user
      const savedProfile = localStorage.getItem(`profile_${firebaseUser.uid}`);
      if (!savedProfile) {
        // Create a new profile
        const newProfile: UserProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          phone: '',
          address: ''
        };
        
        // Save to localStorage
        saveProfileToLocalStorage(firebaseUser.uid, newProfile);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Google login error:', error);
      // Handle specific Google auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in was cancelled' };
      } else if (error.code === 'auth/popup-blocked') {
        return { success: false, error: 'Pop-up was blocked by the browser. Please allow pop-ups for this site.' };
      } else if (error.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'The sign-in process was cancelled' };
      }
      
      return { success: false, error: 'Failed to sign in with Google. Please try again.' };
    }
  };

  const register = async (email: string, password: string, userData: Omit<UserProfile, 'id' | 'email'>) => {
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update the user's display name
      await updateFirebaseProfile(firebaseUser, {
        displayName: userData.name
      });
      
      // Create a profile object
      const userProfile: UserProfile = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name,
        phone: userData.phone,
        address: userData.address
      };
      
      // Save profile to localStorage
      saveProfileToLocalStorage(firebaseUser.uid, userProfile);
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error.message);
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // State will be cleared by the auth state listener
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: Partial<Omit<UserProfile, 'id'>>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Update profile in state
      const updatedProfile = profile ? { ...profile, ...data } : null;
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        
        // Save to localStorage
        saveProfileToLocalStorage(user.id, updatedProfile);
        
        // Update display name in Firebase if name is provided
        if (data.name && auth.currentUser) {
          await updateFirebaseProfile(auth.currentUser, {
            displayName: data.name
          });
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginWithGoogle, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};