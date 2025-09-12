import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, CheckCircle, ShoppingCart, Package, Crown, Sparkles, Heart, Coffee, X, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTempSamples } from '../contexts/TempSamplesContext';
import { createOrder } from '../services/orderService';

const FreeSamplesPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { profile, updateProfile } = useAuth();
  const { addTempSamples } = useTempSamples();
  const fromOffer = location.state?.fromOffer || false;

  // Check if user has already used free samples
  useEffect(() => {
    if (profile?.hasUsedFreeSamples) {
      // Redirect to home with a message
      navigate('/', { 
        state: { 
          message: 'You have already claimed your free samples offer. Thank you for being a valued customer!' 
        } 
      });
    }
  }, [profile, navigate]);

  // Comprehensive image mapping for all categories
  const productImageMap: { pattern: RegExp; src: string; category?: string }[] = [
    // Powder category - main powders
    { pattern: /^turmeric.*powder|manjal.*powder/i, src: '/Items/Turmeric Powder.jpeg', category: 'Powder' },
    { pattern: /^pure.*turmeric.*powder/i, src: '/Items/Pure Turmeric powder.jpeg', category: 'Powder' },
    { pattern: /^sambar.*powder/i, src: '/Items/Sambar powder.jpeg', category: 'Powder' },
    { pattern: /^rasam.*powder/i, src: '/Items/Rasam Powder.jpeg', category: 'Powder' },
    { pattern: /rasam(?!.*powder)/i, src: '/Items/Rasam.jpeg', category: 'Powder' },
    { pattern: /^ellu.*idli.*powder|^garlic.*idly.*powder/i, src: '/Items/Garlic idlie.jpeg', category: 'Powder' },
    { pattern: /^poondu.*idly.*powder/i, src: '/Items/Idly Powder.jpeg', category: 'Powder' },
    { pattern: /^andra.*spl.*paruppu.*powder/i, src: '/Items/Andra Spl.jpeg', category: 'Powder' },
    { pattern: /^moringa.*leaf.*powder/i, src: '/Items/moringa leaf.jpeg', category: 'Powder' },
    { pattern: /^curry.*leaves.*powder/i, src: '/Items/currly leaf.jpeg', category: 'Powder' },
    { pattern: /^vathal.*powder|kollu.*sadha.*powder/i, src: '/Items/Vathal Powder.jpeg', category: 'Powder' },
    { pattern: /kollu.*sadha.*powder/i, src: '/Items/kollu sadha powder.jpeg', category: 'Powder' },
    
    // Mix category
    { pattern: /^puliodharai.*mix|^puliyotharai.*mix|tamarind.*mix/i, src: '/Items/Puliyotharai (Tamarind) Mix.jpeg', category: 'Mix' },
    { pattern: /^vathakkuzhambu.*mix|vathal.*kuzhambu.*mix/i, src: '/Items/Vathakkuzhambu Mix.jpeg', category: 'Mix' },
    { pattern: /puliyo?kuzhambu.*powder/i, src: '/Items/Puliyokuzhambu Powder.jpeg', category: 'Mix' },
    
    // Pickle category
    { pattern: /^poondu.*pickle|^garlic.*pickle/i, src: '/Items/Garlic Pickle.jpeg', category: 'Pickle' },
    { pattern: /^jathikkai.*pickle|^jadhikkai.*pickle/i, src: '/Items/Jadhikkai Pickle.jpeg', category: 'Pickle' },
    { pattern: /^mudakatthan.*pickle|^mudakkathan.*pickle/i, src: '/Items/Mudakatthan Pickle.jpeg', category: 'Pickle' },
  ];

  // Function to get image for any product across all categories
  const getProductImage = (item: string, categoryTitle: string): string | null => {
    const lower = item.toLowerCase();
    const found = productImageMap.find((m) => {
      // If category is specified in mapping, check category match
      if (m.category && m.category !== categoryTitle) {
        return false;
      }
      return m.pattern.test(lower);
    });
    return found ? found.src : null;
  };

  // All categories with their items - Updated with new structure
  const categories = [
    {
      title: 'Mix',
      icon: Package,
      gradient: 'from-amber-600 to-orange-500',
      items: [
        { id: 'puliodharai-mix', name: 'Puliodharai mix' },
        { id: 'vathakkuzhambu-mix', name: 'Vathakkuzhambu mix' }
      ]
    },
    {
      title: 'Pickle',
      icon: Heart,
      gradient: 'from-purple-600 to-indigo-500',
      items: [
        { id: 'poondu-pickle', name: 'Poondu pickle' },
        { id: 'pirandai-pickle', name: 'Pirandai pickle' },
        { id: 'jathikkai-pickle', name: 'Jathikkai pickle' },
        { id: 'mudakkathan-pickle', name: 'Mudakkathan pickle' },
        { id: 'kara-narthangai-pickle', name: 'Kara narthangai pickle' }
      ]
    },
    {
      title: 'Powder',
      icon: Crown,
      gradient: 'from-red-600 to-rose-500',
      items: [
        { id: 'turmeric-powder', name: 'Turmeric powder' },
        { id: 'sambar-powder', name: 'Sambar powder' },
        { id: 'rasam-powder', name: 'Rasam powder' },
        { id: 'ellu-idli-powder', name: 'Ellu idli powder' },
        { id: 'poondu-idly-powder', name: 'Poondu idly powder' },
        { id: 'andra-spl-paruppu-powder', name: 'Andra spl paruppu powder' },
        { id: 'moringa-leaf-powder', name: 'Moringa leaf powder' },
        { id: 'curry-leaves-powder', name: 'Curry leaves powder' },
        { id: 'red-chilli-powder', name: 'Red Chilli powder' }
      ]
    },
    {
      title: 'Appalam',
      icon: Gift,
      gradient: 'from-emerald-600 to-green-500',
      items: [
        { id: 'ulundhu-appalam', name: 'Ulundhu appalam' },
        { id: 'rice-appalam', name: 'Rice appalam' },
        { id: 'kizhangu-appalam', name: 'Kizhangu appalam' }
      ]
    },
    {
      title: 'Coffee',
      icon: Coffee,
      gradient: 'from-yellow-600 to-amber-500',
      items: [
        { id: 'coffee-powder', name: 'Coffee powder' }
      ]
    }
  ];

  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else if (selectedItems.length < 7) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      // Show popup when trying to add more than 7 items
      setShowLimitPopup(true);
    }
  };

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (showLimitPopup) {
      const timer = setTimeout(() => {
        setShowLimitPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLimitPopup]);

  const getSelectedItemsForOrder = () => {
    const items: any[] = [];
    selectedItems.forEach(itemId => {
      let foundItem = null;
      let categoryName = '';
      
      for (const category of categories) {
        const item = category.items.find(i => i.id === itemId);
        if (item) {
          foundItem = item;
          categoryName = category.title;
          break;
        }
      }
      
      if (foundItem) {
        items.push({
          product_name: `${foundItem.name} (Free Sample)`,
          quantity: 1,
          price: 0,
          category: categoryName
        });
      }
    });
    return items;
  };

  const handleContinueWithoutProducts = async () => {
    if (selectedItems.length === 0) return;
    if (!profile) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      const items = getSelectedItemsForOrder();
      
      // Navigate to order details with sample-only order
      navigate('/order-details', {
        state: {
          isAuthenticated: true,
          items: items,
          total_amount: 0,
          discount_amount: 0,
          final_amount: 0,
          isFromSamples: true,
          sampleOnly: true
        }
      });

      // Mark offer as used
      if (fromOffer) {
        await updateProfile({ hasUsedOffer: true });
      }
    } catch (error) {
      console.error('Error processing sample order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithProducts = () => {
    if (selectedItems.length === 0) return;
    
    // Store samples in temporary storage instead of adding to cart
    const tempSampleItems = selectedItems.map(itemId => {
      let foundItem = null;
      let categoryName = '';
      
      for (const category of categories) {
        const item = category.items.find(i => i.id === itemId);
        if (item) {
          foundItem = item;
          categoryName = category.title;
          break;
        }
      }
      
      if (foundItem) {
        return {
          id: `${foundItem.id}-sample`,
          product_name: `${foundItem.name} (Free Sample)`,
          price: 0,
          category: categoryName,
          quantity: 1,
          isSample: true
        };
      }
      return null;
    }).filter(item => item !== null);

    // Store samples in temporary storage
    addTempSamples(tempSampleItems);
    console.log('🆓 Stored temp samples for later:', tempSampleItems);

    // Set flag for 10% discount eligibility
    localStorage.setItem('hasDiscountEligibility', 'true');
    localStorage.setItem('freeSamplesClaimed', 'true');
    
    // Navigate to categories page (not home page)
    navigate('/categories');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-red-500 to-amber-500 rounded-full">
                <Gift className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Free Samples</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose up to 7 items to try for free and discover the authentic taste of tradition
            </p>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-2 text-center">🎉 Special Offer</h3>
          <p className="text-green-700 text-center">
            Select up to 7 free sample items. When you order other products along with these samples, 
            you'll get an additional <span className="font-bold">10% discount</span> on all products!
          </p>
        </div>

        {/* Selection Counter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Selected Items</h3>
            <span className="text-2xl font-bold text-red-600">
              {selectedItems.length}/7
            </span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedItems.length / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            
            return (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: categoryIndex * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${category.gradient} p-6`}>
                  <div className="flex items-center gap-3 text-white">
                    <IconComponent className="h-8 w-8" />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <span className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                      {category.items.length} Items Available
                    </span>
                  </div>
                </div>

                {/* Category Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {category.items.map((item) => {
                      const isSelected = selectedItems.includes(item.id);
                      const isDisabled = !isSelected && selectedItems.length >= 7;

                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => handleItemToggle(item.id)}
                          disabled={isDisabled}
                          className={`
                            w-full h-56 sm:h-48 p-4 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between shadow-lg
                            ${isSelected 
                              ? 'border-red-500 bg-red-50 text-red-800 shadow-xl transform scale-105' 
                              : isDisabled 
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed shadow-md'
                              : 'border-gray-200 hover:border-red-300 hover:bg-red-50 hover:shadow-xl hover:-translate-y-2'
                            }
                          `}
                          whileHover={!isDisabled ? { scale: 1.02 } : {}}
                          whileTap={!isDisabled ? { scale: 0.98 } : {}}
                        >
                          {/* Product Image */}
                          <div className="w-full h-24 mx-auto mb-3 rounded-lg flex items-center justify-center overflow-hidden">
                            {(() => {
                              const imgSrc = getProductImage(item.name, category.title);
                              
                              return imgSrc ? (
                                <img 
                                  src={imgSrc} 
                                  alt={item.name} 
                                  className="max-w-full max-h-full object-contain transform transition-transform duration-300 hover:scale-110"
                                  style={{
                                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))'
                                  }}
                                />
                              ) : (
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  isSelected ? 'bg-red-200' : 'bg-gray-100'
                                }`}>
                                  <Package className={`h-6 w-6 ${
                                    isSelected ? 'text-red-600' : 'text-gray-400'
                                  }`} />
                                </div>
                              );
                            })()} 
                          </div>
                          
                          <div className="text-center">
                            <p className="font-medium text-sm leading-tight mb-2 line-clamp-2">{item.name}</p>
                            <p className="text-sm text-gray-500 font-medium">Sample Size</p>
                          </div>
                          
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 p-6 mt-8 -mx-4">
          <div className="max-w-7xl mx-auto">
            {/* Instructions */}
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm">
                Choose what you'd like to do with your selected samples:
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Continue without any product */}
              <button
                onClick={handleContinueWithoutProducts}
                disabled={selectedItems.length === 0 || loading}
                className={`
                  flex-1 px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300
                  ${selectedItems.length > 0
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Gift className="h-5 w-5" />
                {loading ? 'Processing...' : `Order ${selectedItems.length} Free Samples Only`}
              </button>
              
              {/* Continue to order with products */}
              <button
                onClick={handleContinueWithProducts}
                disabled={selectedItems.length === 0}
                className={`
                  flex-1 px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300
                  ${selectedItems.length > 0
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <ShoppingBag className="h-5 w-5" />
                Add Samples + Shop for 10% OFF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Limit Popup */}
      <AnimatePresence>
        {showLimitPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed top-20 right-4 z-50 max-w-sm"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-red-200 p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Sample Limit Reached</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    You can only select up to 7 free samples. Please remove an item to add a new one.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-red-600 font-medium">
                      {selectedItems.length}/7 selected
                    </span>
                    <button
                      onClick={() => setShowLimitPopup(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FreeSamplesPage;
