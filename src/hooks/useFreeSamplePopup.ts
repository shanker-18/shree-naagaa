import { useState, useEffect } from 'react';

// Key for storing popup state in localStorage
const POPUP_SHOWN_KEY = 'free_sample_popup_shown';
const POPUP_DISMISSED_KEY = 'free_sample_popup_dismissed';
const POPUP_CLAIMED_KEY = 'free_sample_popup_claimed';

interface UseFreeSamplePopupReturn {
  isVisible: boolean;
  showPopup: () => void;
  hidePopup: () => void;
  onClaim: () => void;
  hasBeenShown: boolean;
  hasBeenClaimed: boolean;
}

export const useFreeSamplePopup = (): UseFreeSamplePopupReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [hasBeenClaimed, setHasBeenClaimed] = useState(false);

  useEffect(() => {
    // Check if popup has been shown before
    const popupShown = localStorage.getItem(POPUP_SHOWN_KEY) === 'true';
    const popupDismissed = localStorage.getItem(POPUP_DISMISSED_KEY) === 'true';
    const popupClaimed = localStorage.getItem(POPUP_CLAIMED_KEY) === 'true';
    
    setHasBeenShown(popupShown);
    setHasBeenClaimed(popupClaimed);

    // Show popup on every page load/refresh unless permanently dismissed
    // Only show if:
    // 1. Not permanently dismissed (user clicked "Maybe Later" allows it to show again)
    // 2. Not currently on login/register/free-samples pages
    const currentPath = window.location.pathname;
    const isAuthPage = ['/login', '/register', '/forgot-password', '/free-samples'].includes(currentPath);
    
    // Show popup even if claimed before, but not if permanently dismissed or on auth pages
    if (!isAuthPage && !popupDismissed) {
      // Show popup after 3 seconds delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const showPopup = () => {
    setIsVisible(true);
  };

  const hidePopup = () => {
    setIsVisible(false);
    // Mark as shown and dismissed
    localStorage.setItem(POPUP_SHOWN_KEY, 'true');
    localStorage.setItem(POPUP_DISMISSED_KEY, 'true');
    setHasBeenShown(true);
  };

  const onClaim = () => {
    setIsVisible(false);
    // Mark as claimed
    localStorage.setItem(POPUP_SHOWN_KEY, 'true');
    localStorage.setItem(POPUP_CLAIMED_KEY, 'true');
    setHasBeenShown(true);
    setHasBeenClaimed(true);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.innerHTML = '🎉 Redirecting to free samples page!';
    document.body.appendChild(successMessage);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage);
      }
    }, 3000);
  };

  return {
    isVisible,
    showPopup,
    hidePopup,
    onClaim,
    hasBeenShown,
    hasBeenClaimed
  };
};

// Utility functions for checking popup state
export const hasUserSeenPopup = (): boolean => {
  return localStorage.getItem(POPUP_SHOWN_KEY) === 'true';
};

export const hasUserClaimedSample = (): boolean => {
  return localStorage.getItem(POPUP_CLAIMED_KEY) === 'true';
};

export const hasUserDismissedPopup = (): boolean => {
  return localStorage.getItem(POPUP_DISMISSED_KEY) === 'true';
};

// Reset popup state (useful for testing or admin purposes)
export const resetPopupState = (): void => {
  localStorage.removeItem(POPUP_SHOWN_KEY);
  localStorage.removeItem(POPUP_DISMISSED_KEY);
  localStorage.removeItem(POPUP_CLAIMED_KEY);
  console.log('🧹 Popup state reset - popup will show again on next page load');
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).resetPopupState = resetPopupState;
  console.log('🛠️ Debug: You can reset popup state by running: resetPopupState()');
}

// Show popup again (useful if user wants to see it again)
export const triggerPopupAgain = (): void => {
  localStorage.removeItem(POPUP_DISMISSED_KEY);
};
