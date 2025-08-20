import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, UserCircle2, CheckCircle, Gift, ChevronRight, User, ShoppingBag, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import GuestEmailModal from './GuestEmailModal';

const HIDE_ON: string[] = ['/order-details', '/order-summary'];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { profile, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const hide = HIDE_ON.some((p) => location.pathname.startsWith(p));
  if (hide) return null;
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGuestEmailSubmit = (email: string) => {
    // Store guest email in localStorage or state management
    localStorage.setItem('guestEmail', email);
    // Close the modal
    setShowGuestModal(false);
  };

  return (
    <>
      <GuestEmailModal 
        isOpen={showGuestModal} 
        onClose={() => setShowGuestModal(false)} 
        onSubmit={handleGuestEmailSubmit} 
      />
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Shree Raaga SWAAD GHAR"
            className="h-10 w-10 rounded-full object-cover shadow-md"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="hidden sm:block">
            <span className="font-extrabold text-xl text-gray-800 group-hover:text-red-600 transition-colors">
              Shree Raaga SWAAD GHAR
            </span>
            <p className="text-xs text-gray-500 -mt-1">Authentic Traditional Products</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
          <a href="/#home" className="hover:text-red-600 transition-colors duration-200">Home</a>
          <a href="/#categories" className="hover:text-red-600 transition-colors duration-200">Categories</a>
          <a href="/#about" className="hover:text-red-600 transition-colors duration-200">About</a>
          <a href="/#contact" className="hover:text-red-600 transition-colors duration-200">Contact</a>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* User Account - Shown when logged in */}
          {profile ? (
            <div className="relative group">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group-hover:scale-105 cursor-pointer">
                <UserCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700 hidden sm:inline">{profile.name}</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                  {profile.emailVerified ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Unverified
                    </span>
                  )}
                </div>
                
                {/* First-time user offer */}
                {profile.isFirstTimeOrder && (
                  <div className="p-2 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Gift className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-800">New User Offer!</p>
                        <p className="text-xs text-amber-700">Free 50g sample with your first order</p>
                      </div>
                    </div>
                    <a 
                      href="/#categories" 
                      className="mt-1 text-xs font-medium text-amber-600 hover:text-amber-800 flex items-center justify-end"
                    >
                      Shop now <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                )}
                
                <div className="p-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    User Details
                  </Link>
                  <a href="/#categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-gray-500" />
                    Order Products
                  </a>
                  <button 
                    onClick={async () => {
                      await logout();
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200">
                Sign In
              </Link>
              <Link to="/register" className="px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-amber-500 rounded-full hover:from-red-600 hover:to-amber-600 transition-colors duration-300">
                Register
              </Link>
            </div>
          )}
          
          {/* Cart */}
          <Link to="/cart" className="relative group">
            <div className="p-2 rounded-full bg-gradient-to-r from-red-50 to-amber-50 hover:from-red-100 hover:to-amber-100 transition-all duration-300 group-hover:scale-110">
              <ShoppingCart className="h-6 w-6 text-red-600" />
              {getCartCount() > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </div>
              )}
            </div>
          </Link>

          {/* Shop Button */}
          <a href="/#categories">
            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <span>Shop Now</span>
            </button>
          </a>
        </div>
      </div>
    </header>
    </>
  );
};

export default Navbar;


