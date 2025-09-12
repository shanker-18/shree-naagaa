import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, ShoppingBag, ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTempSamples } from '../contexts/TempSamplesContext';
import { useCart } from '../contexts/CartContext';
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
  const isFromBuyNow = productInfo.isFromBuyNow || false;
  const isFromSamples = productInfo.isFromSamples || false;
  const isFromCart = productInfo.isFromCart || false;
  const containsSamples = productInfo.containsSamples || false;
  const orderItems = productInfo.items || [];
  const totalAmount = productInfo.total_amount || finalPrice;
  const discountAmount = productInfo.discount_amount || 0;
  const finalAmount = productInfo.final_amount || finalPrice;
  
  // Separate items into samples and paid items
  const sampleItems = orderItems.filter(item => item.isSample || item.price === 0);
  const paidItems = orderItems.filter(item => !item.isSample && item.price > 0);
  
  console.log('🔍 OrderDetails received state:', productInfo);
  console.log('📦 Items received:', orderItems);
  console.log('🏷️ isFromBuyNow:', isFromBuyNow, 'isFromSamples:', isFromSamples, 'isFromCart:', isFromCart);
  console.log('🆓 Sample items:', sampleItems);
  console.log('💰 Paid items:', paidItems);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { profile, updateProfile } = useAuth();
  const { clearTempSamples, hasTempSamples } = useTempSamples();
  const { clearCart } = useCart();

  // Cities in India
  const indianCities = [
    'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
    'Srinagar', 'Dhanbad', 'Jodhpur', 'Amritsar', 'Raipur', 'Allahabad', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada',
    'Madurai', 'Guwahati', 'Chandigarh', 'Hubli-Dharwad', 'Amroha', 'Moradabad', 'Gurgaon', 'Aligarh', 'Solapur', 'Ranchi'
  ].sort();

  // Indian States
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  useEffect(() => {
    // If user is authenticated, try to get their profile data
    if (isAuthenticated && profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: profile.state || '',
        pincode: ''
      });
    }
  }, [isAuthenticated, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validation for phone number (only digits, max 10)
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData({ ...formData, [name]: digitsOnly });
      }
      return;
    }
    
    // Validation for pincode (only digits, max 6)
    if (name === 'pincode') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 6) {
        setFormData({ ...formData, [name]: digitsOnly });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    
    // Email validation (optional for guests, required for authenticated users)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // For authenticated users, email is required
    if (isAuthenticated && !formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return false;
    }
    
    // Address validation
    if (!formData.addressLine1.trim()) {
      setError('Address Line 1 is required');
      return false;
    }
    
    // City validation
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }
    
    // State validation
    if (!formData.state.trim()) {
      setError('State is required');
      return false;
    }
    
    // Pincode validation
    if (!formData.pincode.trim()) {
      setError('Pincode is required');
      return false;
    }
    if (formData.pincode.length !== 6) {
      setError('Pincode must be exactly 6 digits');
      return false;
    }
    
    return true;
  };

  const getDeliveryTime = (state: string) => {
    return state === 'Tamil Nadu' ? '3 days' : '10 days';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Calculate prices - use values from Buy Now flow if available, otherwise calculate
      let orderTotalAmount, orderDiscountAmount, orderFinalAmount;
      
      if (isFromBuyNow && orderItems.length > 0) {
        // Use the values passed from Buy Now flow
        orderTotalAmount = totalAmount;
        orderDiscountAmount = 0; // No automatic discount
        orderFinalAmount = orderTotalAmount - orderDiscountAmount;
      } else {
        // Fallback calculation for single product
        orderTotalAmount = finalPrice;
        orderDiscountAmount = 0; // No automatic discount
        orderFinalAmount = orderTotalAmount - orderDiscountAmount;
      }

      // Combine address fields
      const fullAddress = `${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

      // Create order using order service
      const orderData = {
        user_id: isAuthenticated && profile ? profile.id : null,
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone,
        guest_address: fullAddress,
        guest_state: formData.state,
        guest_city: formData.city,
        guest_pincode: formData.pincode,
        items: (isFromBuyNow || isFromSamples || isFromCart) && orderItems.length > 0 ? orderItems : [
          {
            product_name: finalProductName,
            quantity: 1,
            price: finalPrice,
            category: finalCategory
          }
        ],
        total_amount: orderTotalAmount,
        discount_amount: orderDiscountAmount,
        final_amount: orderFinalAmount,
        delivery_time: getDeliveryTime(formData.state),
        is_guest: !isAuthenticated,
        status: 'pending'
      };
      
      console.log('Order data:', orderData);
      const result = await createOrder(orderData);

      if (!result.success) {
        setError(result.error || 'Failed to create order');
      } else {
        // Clear cart if this order came from cart
        if (isFromCart) {
          console.log('🧹 Clearing cart after successful order');
          clearCart();
        }
        
        // Clear temporary samples after successful order creation
        if (hasTempSamples()) {
          console.log('🧹 Clearing temp samples after successful order');
          clearTempSamples();
        }
        
        // Mark that user has used free samples if they were included in this order
        const hasSampleItems = orderData.items.some(item => item.isSample || item.price === 0);
        if (hasSampleItems && isAuthenticated && profile) {
          console.log('🎉 User has used free samples - marking as used');
          await updateProfile({ hasUsedFreeSamples: true });
        }
        
        // Clear other temporary storage items
        localStorage.removeItem('hasDiscountEligibility');
        localStorage.removeItem('freeSamplesClaimed');
        localStorage.removeItem('pendingProduct');
        
        // Redirect to order summary
        navigate('/order-summary', { 
          state: { 
            orderId: result.orderId,
            orderData: {
              ...orderData,
              customerInfo: formData,
              deliveryTime: getDeliveryTime(formData.state)
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
          {(isFromBuyNow || isFromSamples || isFromCart) && orderItems.length > 0 ? (
            // Display items from Buy Now flow, Free Samples, or Cart
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {isFromSamples && !isFromCart ? 'Free Samples Order' : 
                     containsSamples && isFromCart ? 'Cart Order (with Free Samples)' : 
                     'Order Summary'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {orderItems.length} item(s)
                    {containsSamples && isFromCart && (
                      <span className="text-green-600"> - includes {sampleItems.length} free sample(s)</span>
                    )}
                  </p>
                  {isFromSamples && !isFromCart && (
                    <p className="text-sm text-green-600 font-medium">🎉 Free samples - no payment required!</p>
                  )}
                </div>
              </div>
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className={`text-lg font-bold ${
                    item.price === 0 ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {item.price === 0 ? 'FREE' : `₹${item.price * item.quantity}`}
                  </p>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className={`text-2xl font-bold ${
                    totalAmount === 0 ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {totalAmount === 0 ? 'FREE' : `₹${totalAmount}`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Display single product (fallback)
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{finalProductName}</h3>
                <p className="text-gray-600 text-sm">{finalCategory}</p>
                <p className="text-2xl font-bold text-blue-600">₹{finalPrice}</p>
              </div>
            </div>
          )}
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
                Full Name *
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

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address {isAuthenticated ? '*' : '(Optional)'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required={isAuthenticated}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
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
                  maxLength={10}
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="addressLine1"
                  name="addressLine1"
                  type="text"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="House No., Street, Area"
                />
              </div>
            </div>

            {/* Address Line 2 */}
            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2 (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="addressLine2"
                  name="addressLine2"
                  type="text"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Landmark, Near..."
                />
              </div>
            </div>

            {/* City and State Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                Pincode * (6 digits)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Delivery Time Info */}
            {formData.state && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Expected Delivery: {getDeliveryTime(formData.state)} {formData.state === 'Tamil Nadu' ? '(within Tamil Nadu)' : '(outside Tamil Nadu)'}
                  </span>
                </div>
              </div>
            )}

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
