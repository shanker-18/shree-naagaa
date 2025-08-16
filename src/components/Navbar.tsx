import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, UserCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const HIDE_ON: string[] = ['/order-details', '/order-summary'];

const Navbar: React.FC = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { profile } = useAuth();
  const hide = HIDE_ON.some((p) => location.pathname.startsWith(p));
  if (hide) return null;

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/brand-logo.jpeg"
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

          {/* Account */}
          <Link 
            to={profile ? "/order-details" : "/login"} 
            title={profile ? "My Account" : "Sign In"}
            className="group"
          >
            <div className="p-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group-hover:scale-110">
              <UserCircle2 className="h-6 w-6 text-gray-700" />
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
  );
};

export default Navbar;


