import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDemoContext } from '../contexts/DemoContext';

interface FreeSamplePopupProps {
  isVisible: boolean;
  onClose: () => void;
  onClaim: () => void;
}

const FreeSamplePopup: React.FC<FreeSamplePopupProps> = ({ isVisible, onClose, onClaim }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useDemoContext();
  const [isClosing, setIsClosing] = useState(false);

  // Handle claim button click
  const handleClaimClick = () => {
    if (!user) {
      // User not logged in - redirect to login
      navigate('/login', { 
        state: { 
          returnTo: '/free-sample',
          message: 'Please login to claim your free sample' 
        }
      });
      onClose();
      return;
    }

    // User is logged in - check if they've already used the offer
    const savedProfile = localStorage.getItem(`profile_${user.id}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.hasUsedOffer) {
        alert('You have already claimed your free sample offer!');
        onClose();
        return;
      }
    }

    // Add free sample to cart
    const freeSample = {
      id: 'free-sample-mix',
      name: '50g Mixed Traditional Spices - Free Sample',
      price: 0,
      originalPrice: 150,
      image: '/images/free-sample.jpg',
      category: 'Free Sample',
      description: 'Premium quality traditional spices sample pack',
      weight: '50g',
      quantity: 1,
      isFree: true
    };

    addToCart(freeSample);
    onClaim();
    
    // Show success message and navigate to cart
    setTimeout(() => {
      navigate('/cart');
    }, 1000);
  };

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup Content */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden ${
        isClosing ? 'animate-slideOut' : 'animate-slideIn'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 px-8 py-12 text-center text-white">
          {/* Gift Icon */}
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Special Offer!</h2>
          <p className="text-white text-opacity-90">Limited Time Only</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Get 50g FREE Sample!
          </h3>
          
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            As a {user ? 'valued' : 'new'} user, you're eligible for our exclusive 50g free 
            sample pack. Try our authentic traditional products at no cost!
          </p>

          {/* What's Included Box */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gift className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">What's Included:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• 50g Mixed Traditional Spices</li>
                  <li>• Premium Quality Products</li>
                  <li>• Free Home Delivery</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="text-xs text-gray-500 mb-6">
            <p className="font-medium mb-2">Terms & Conditions:</p>
            <ul className="space-y-1">
              <li>• One-time offer per registered user</li>
              <li>• Valid for first-time orders only</li>
              <li>• Free delivery included</li>
              <li>• Cannot be combined with other offers</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleClaimClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Gift className="w-5 h-5" />
              <span>
                {user ? 'Claim Your Free Sample' : 'Login to Claim'}
              </span>
            </button>
            
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideIn {
          from { 
            transform: translateY(-50px) scale(0.95);
            opacity: 0;
          }
          to { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to { 
            transform: translateY(-50px) scale(0.95);
            opacity: 0;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-in;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideOut {
          animation: slideOut 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default FreeSamplePopup;
