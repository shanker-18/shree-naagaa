import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/orderService';

interface OrderDetailsProps {
  productName?: string;
  category?: string;
  price?: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  productName = 'Product Name', 
  category = 'Category', 
  price = 0 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = location.state?.isAuthenticated || false;
  
  // Get product info from navigation state if available
  const productInfo = location.state || {};
  const finalProductName = productInfo.productName || productName;
  const finalCategory = productInfo.category || category;
  const finalPrice = productInfo.price || price;
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { profile } = useAuth();

  useEffect(() => {
    // If user is authenticated, try to get their profile data
    if (isAuthenticated && profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [isAuthenticated, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calculate prices
      const totalAmount = finalPrice;
      const discountAmount = isAuthenticated ? totalAmount * 0.01 : 0; // 1% discount for authenticated users
      const finalAmount = totalAmount - discountAmount;

      // Create order using order service
      const orderData = {
        user_id: isAuthenticated && profile ? profile.id : null, // Use null instead of undefined for SQL compatibility
        guest_name: formData.name,
        guest_phone: formData.phone,
        guest_address: formData.address,
        items: [
          {
            product_name: finalProductName,
            quantity: 1,
            price: finalPrice,
            category: finalCategory
          }
        ],
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        is_guest: !isAuthenticated,
        status: 'pending'
      };
      
      console.log('Order data:', orderData);
      const result = await createOrder(orderData);

      if (!result.success) {
        setError(result.error || 'Failed to create order');
      } else {
        // Redirect to order summary
        // Ensure the orderId is clean before passing it
        navigate('/order-summary', { 
          state: { 
            orderId: result.orderId.trim(),
            orderData: {
              user_id: isAuthenticated && profile ? profile.id : null, // Use null instead of undefined for SQL compatibility
              guest_name: formData.name,
              guest_phone: formData.phone,
              guest_address: formData.address,
              items: [
                {
                  product_name: finalProductName,
                  quantity: 1,
                  price: finalPrice,
                  category: finalCategory
                }
              ],
              total_amount: totalAmount,
              discount_amount: discountAmount,
              final_amount: finalAmount,
              is_guest: !isAuthenticated,
              status: 'pending',
              customerInfo: formData
            }
          } 
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
          <p className="text-gray-600">Please provide your shipping information</p>
        </div>

        {/* Product Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{finalProductName}</h3>
              <p className="text-gray-600 text-sm">{finalCategory}</p>
              <p className="text-2xl font-bold text-blue-600">₹{finalPrice}</p>
            </div>
            {isAuthenticated && (
              <div className="text-right">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  1% OFF
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter your complete shipping address"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Processing...' : 'Continue to Order Summary'}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Your order will be processed within 24-48 hours</p>
              <p>• Delivery typically takes 3-5 business days</p>
              <p>• You will receive SMS updates on your order status</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;
