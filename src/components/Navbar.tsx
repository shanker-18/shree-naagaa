import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, UserCircle2, CheckCircle, Gift, ChevronRight, User, ShoppingBag, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import GuestEmailModal from './GuestEmailModal';
import SpecialOfferModal from './SpecialOfferModal';

const HIDE_ON: string[] = ['/order-details', '/order-summary'];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { profile, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <SpecialOfferModal 
        isOpen={showOfferModal} 
        onClose={() => setShowOfferModal(false)} 
      />
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-600 to-amber-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-lg tracking-wide">SR</span>
          </div>
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
          {/* Special Offer Button - Only for eligible users */}
          {profile?.isOfferEligible && !profile.hasUsedOffer && (
            <button
              onClick={() => setShowOfferModal(true)}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse"
            >
              <Gift className="h-4 w-4" />
              <span className="hidden lg:inline">50g FREE!</span>
              <Sparkles className="h-3 w-3 animate-spin" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-gray-100 transition-colors duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

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
                  {!profile.hasUsedFreeSamples ? (
                    <Link to="/free-samples" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2">
                      <Gift className="h-4 w-4 text-gray-500" />
                      Free Samples
                    </Link>
                  ) : (
                    <div className="block px-4 py-2 text-sm text-gray-400 rounded-md flex items-center gap-2 cursor-not-allowed">
                      <Gift className="h-4 w-4 text-gray-400" />
                      <span>Free Samples (Used)</span>
                    </div>
                  )}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="px-4 py-4 space-y-3">
            <a 
              href="/#home" 
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="/#categories" 
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </a>
            <a 
              href="/#about" 
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="/#contact" 
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            
            {/* Mobile Special Offer Button */}
            {profile?.isOfferEligible && !profile.hasUsedOffer && (
              <button
                onClick={() => {
                  setShowOfferModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg transition-all duration-300"
              >
                <Gift className="h-4 w-4" />
                <span>50g FREE!</span>
                <Sparkles className="h-3 w-3" />
              </button>
            )}
            
            {/* Mobile User Options */}
            {profile ? (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-700">{profile.name}</p>
                  <p className="text-xs text-green-600">Signed in</p>
                </div>
                
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 text-green-600" />
                  User Details
                </Link>
                
                {!profile.hasUsedFreeSamples && (
                  <Link 
                    to="/free-samples" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Gift className="h-5 w-5 text-amber-600" />
                    Free Samples
                  </Link>
                )}
                
                <button 
                  onClick={async () => {
                    await logout();
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link 
                  to="/login" 
                  className="block px-4 py-2 text-center text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="block px-4 py-2 text-center text-white bg-gradient-to-r from-red-500 to-amber-500 rounded-lg hover:from-red-600 hover:to-amber-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;


