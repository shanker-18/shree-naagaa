import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Gift, CheckCircle, ShoppingCart, Package, Crown, Sparkles, Heart, Coffee, X, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const FreeSamplesPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const { addToCart } = useCart();

  // All categories with their items
  const categories = [
    {
      title: 'Powders',
      icon: Crown,
      gradient: 'from-red-600 to-rose-500',
      items: [
        { id: 'turmeric-powder', name: 'Turmeric Powder' },
        { id: 'idly-powder', name: 'Idly Powder' },
        { id: 'milagu-pepper-powder', name: 'Milagu (Pepper) Powder' },
        { id: 'rasam-powder', name: 'Rasam Powder' },
        { id: 'jeera-powder', name: 'Jeera Powder' },
        { id: 'vathal-powder', name: 'Vathal Powder' },
        { id: 'malli-coriander-powder', name: 'Malli (Coriander) Powder' },
        { id: 'puliyokuzhambu-powder', name: 'Puliyokuzhambu Powder' }
      ]
    },
    {
      title: 'Mixes',
      icon: Package,
      gradient: 'from-amber-600 to-orange-500',
      items: [
        { id: 'puliyotharai-mix', name: 'Puliyotharai (Tamarind) Mix' },
        { id: 'vathakkuzhambu-dried-mix', name: 'Vathakkuzhambu (Dried veg. Gravy)' },
        { id: 'vathakkuzhambu-mix', name: 'Vathakkuzhambu Mix' }
      ]
    },
    {
      title: 'Vathal',
      icon: Sparkles,
      gradient: 'from-blue-600 to-indigo-500',
      items: [
        { id: 'seeni-avarai-vathal', name: 'Seeni Avarai Vathal' },
        { id: 'sundakkai-vathal', name: 'Sundakkai Vathal' },
        { id: 'manathakkali-vathal', name: 'Manathakkali Vathal' },
        { id: 'mithukku-vathal', name: 'Mithukku Vathal' },
        { id: 'koozh-vathal', name: 'Koozh Vathal' },
        { id: 'vendaikkai-vathal', name: 'Vendaikkai Vathal' },
        { id: 'pagalkkai-vathal', name: 'Pagalkkai Vathal' },
        { id: 'morr-milagai-vathal', name: 'Morr Milagai Vathal' }
      ]
    },
    {
      title: 'Appalam',
      icon: Gift,
      gradient: 'from-emerald-600 to-green-500',
      items: [
        { id: 'pai-appalam', name: 'Pai Appalam' },
        { id: 'kizangu-appalam', name: 'Kizangu Appalam' },
        { id: 'sovi-appalam', name: 'Sovi Appalam' },
        { id: 'ulundhu-blackgram-appalam', name: 'Ulundhu (Blackgram) Appalam' },
        { id: 'arisi-appalam', name: 'Arisi Appalam' },
        { id: 'garlic-appalam', name: 'Garlic Appalam' },
        { id: 'ilai-vadaam', name: 'Ilai Vadaam' }
      ]
    },
    {
      title: 'Pickles',
      icon: Heart,
      gradient: 'from-purple-600 to-indigo-500',
      items: [
        { id: 'salted-lemon', name: 'Salted Lemon' },
        { id: 'lemon-pickle', name: 'Lemon Pickle' },
        { id: 'avakkai-pickle', name: 'Avakkai Pickle' },
        { id: 'kidarangakai-pickle', name: 'Kidarangakai Pickle' },
        { id: 'inji-ginger-pickle', name: 'Inji (Ginger) Pickle' },
        { id: 'mavadu-pickle', name: 'Mavadu Pickle' },
        { id: 'kovaikkai-pickle', name: 'Kovaikkai Pickle' },
        { id: 'mudakatthan-pickle', name: 'Mudakatthan Pickle' },
        { id: 'banana-stem-pickle', name: 'Banana Stem Pickle' },
        { id: 'kongura-pickle', name: 'Kongura Pickle' }
      ]
    },
    {
      title: 'Oils',
      icon: Coffee,
      gradient: 'from-yellow-600 to-amber-500',
      items: [
        { id: 'cekku-groundnut-oil', name: 'Cekku Groundnut Oil' },
        { id: 'cekku-coconut-oil', name: 'Cekku Coconut Oil' },
        { id: 'cekku-gingelly-oil', name: 'Cekku Gingelly Oil' }
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

  const handleAddToCart = () => {
    // Add selected free samples to cart
    selectedItems.forEach(itemId => {
      // Find the item in all categories
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
        addToCart({
          id: `${foundItem.id}-sample`,
          name: `${foundItem.name} (Free Sample)`,
          price: 0,
          category: categoryName,
          image: '/placeholder-product.jpg',
          isSample: true,
          quantity: 1
        }, 1);
      }
    });

    // Store in localStorage that user has claimed free samples
    localStorage.setItem('freeSamplesClaimed', 'true');
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
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-red-800 mb-2 text-center">🎉 Special Offer</h3>
          <p className="text-red-700 text-center">
            Select up to 7 free sample items. When you add other products to your cart along with these samples, 
            you'll get an additional <span className="font-bold">20% discount</span> on your entire order!
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
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {category.items.map((item) => {
                      const isSelected = selectedItems.includes(item.id);
                      const isDisabled = !isSelected && selectedItems.length >= 7;

                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => handleItemToggle(item.id)}
                          disabled={isDisabled}
                          className={`
                            aspect-square p-3 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between
                            ${isSelected 
                              ? 'border-red-500 bg-red-50 text-red-800 shadow-md transform scale-105' 
                              : isDisabled 
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'border-gray-200 hover:border-red-300 hover:bg-red-50 hover:shadow-lg hover:-translate-y-1'
                            }
                          `}
                          whileHover={!isDisabled ? { scale: 1.02 } : {}}
                          whileTap={!isDisabled ? { scale: 0.98 } : {}}
                        >
                          {/* Product icon placeholder */}
                          <div className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-red-200' : 'bg-gray-100'
                          }`}>
                            <Package className={`h-4 w-4 ${
                              isSelected ? 'text-red-600' : 'text-gray-400'
                            }`} />
                          </div>
                          
                          <div className="text-center">
                            <p className="font-medium text-xs leading-tight mb-1 line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-500">Sample Size</p>
                          </div>
                          
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="h-4 w-4 text-white" />
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
          <div className="max-w-7xl mx-auto flex gap-4">
            <Link 
              to="/"
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
            >
              Continue Shopping
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={selectedItems.length === 0}
              className={`
                flex-2 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors
                ${selectedItems.length > 0
                  ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white hover:from-red-600 hover:to-amber-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <ShoppingCart className="h-5 w-5" />
              Add {selectedItems.length} Free Samples to Cart
            </button>
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
