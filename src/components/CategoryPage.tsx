import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Plus, Check, ChevronLeft, Expand, X, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthModal from './AuthModal';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTempSamples } from '../contexts/TempSamplesContext';
import { categories } from '../data/categories';
import { toSlug, parseCategorySlug } from '../utils/slugUtils';

// Legacy categories kept for reference only
const legacyCategories = [
  {
    title: "Powders",
    description: "Traditional cooking powders made fresh without additives.",
    gradient: "from-red-600 to-rose-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    items: [
      "Turmeric Powder: Prepared from cleaned and dried 'virali' turmeric tubes, ground finely without additives. Used for cooking and as a cosmetic facial application. It's an effective germicide and adds flavor.",
      "Idly Powder: Prepared in two ways: one with Gingelly oil and garlic, another with 'JAI NATTU-CHEKKU' Gingelly oil and garlic. Eaten as a side dish with Idly or Dosa.",
      "Milagu (Pepper) Powder: Used as an ingredient for cooking Rasam and Ven Pongal, adding flavor and taste.",
      "Rasam Powder: Prepared with tomato in dhal stew. Used in rasam to make it aromatic and tasty.",
      "Jeera Powder: Can be used as an ingredient in any type of cooking.",
      "Vathal Powder: Made from a fine variety of chili. Used for making pickles and savory preparations.",
      "Malli (Coriander) Powder: Prepared from clean and plain coriander seeds. Can be mixed with any type of cooking.",
      "Puliyokuzhambu Powder: Blended with vegetables to make 'puliyokuzhambu'.",
    ],
  },
  {
    title: "Mixes",
    description: "Ready-to-cook mixes crafted for authentic taste.",
    gradient: "from-amber-600 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    items: [
      "Puliyotharai (Tamarind) Mix: A chemical-free mix used to prepare tamarind rice. 100 grams are sufficient for a quarter-measure of rice.",
      "Vathakkuzhambu (Dried veg. Gravy): A tasty and appetizing gravy. It's a unique combination with 'JAI Blackgram Appalam'.",
      "Vathakkuzhambu Mix: Contains sundakkai vathal, manathakkali vathal, and garlic. Mixing 2 tablespoons with Gingelly oil and rice makes a tasty dish.",
    ],
  },
  {
    title: "Vathal",
    description: "Sun-dried traditional vathals ready to fry and relish.",
    gradient: "from-blue-600 to-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-800",
    items: [
      "Seeni Avarai (Cluster Beans) Vathal: Can be fried in oil or ghee and eaten with various rice dishes.",
      "Sundakkai Vathal: Fried in oil or ghee, eaten with Kuzhambu rice, Curd rice, etc. Used in Vathal Kuzhambu to remove stomach worms and control ulcers.",
      "Manathakkali Vathal: Also called tiny-tomato or short-tomato. Tastes good when fried in coconut oil. Can be mixed with rice or sprinkled with ghee.",
      "Mithukku Vathal: Prepared from 'KOVAIKKAI'. Can be fried in ghee and eaten with rice.",
      "Koozh Vathal",
      "Vendaikkai (Bhendi) Vathal: Prepared from Bhendi, fried in ghee, and eaten with rice.",
      "Pagalkkai (Bitter Gourd) Vathal: Can be fried in oil and eaten with different rice varieties.",
      "Morr Milagai (Dried Chilli) Vathal: Prepared by immersing dried green chili in buttermilk. Fried in cooking oil, it's a side dish for 'Pazhaiya Sadam' and 'Koozhu'.",
      "Dried Brinjal (Kathirikai) Vathal: Fried in oil and eaten with different rice varieties.",
      "Onion Vathal: When fried with greens preparation, it adds taste and aroma.",
      "Pirandai Vathal: Good for digestion.",
      "Onion Vadagam: Prepared with gram and onion paste and dried in sunlight. Can be fried in gingelly or groundnut oil and eaten as a side dish or standalone.",
    ],
  },
  {
    title: "Appalam",
    description: "Crispy appalams made from quality ingredients.",
    gradient: "from-emerald-600 to-green-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
    items: [
      "Pai Appalam: Prepared from pure black-gram powder. Fried and eaten as a side dish for Puttu, Sambar Rice, Rasam Rice. Can also be a snack for children.",
      "Kizangu Appalam: Made from Tapioca powder mixed with masala and dried on a flatbed. Can be eaten as is or with rice.",
      "Sovi Appalam: Fried and eaten with food or as a snack for children.",
      "Ulundhu (Blackgram) Appalam: Prepared from quality blackgram powder. It's very tasty and healthy.",
      "Arisi Appalam: Fried in cooking oil. Eaten as a side dish for Sambar Rice, Rasam Rice, Puli Kuzhambu rice, Vathal rice, and puliyotharai rice.",
      "Garlic Appalam: Prepared by blending garlic in the dough.",
      "Ilai Vadaam: Can be eaten with Sambar and Rasam Rice.",
    ],
  },
  {
    title: "Pickles",
    description: "Homemade pickles with medicinal benefits and rich taste.",
    gradient: "from-purple-600 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    items: [
      "Salted Lemon: Oil-free pickle preserved in salt. Aids digestion and can be eaten with Kuzhambu Rice, Curd Rice, etc.",
      "Lemon Pickle: A common pickle that can be eaten with any dish.",
      "Avakkai Pickle: Mango pickle prepared in Andhra style.",
      "Kidarangakai Pickle: Very tasty and improves digestive system function.",
      "Inji (Ginger) Pickle: Has a tickling taste and is healthy.",
      "Mavadu Pickle: A good combination as a side dish for buttermilk or curd rice and 'Koozh'.",
      "Kovaikkai Pickle: Good for the digestive system and helps control diabetes.",
      "Mudakatthan Pickle: Good for joint pain.",
      "Banana Stem Pickle: Helps segregate residuals from the body and is good for kidney function.",
      "Kongura Pickle: A special pickle from Andhra state that removes constipation.",
      "Garlic Pickle: Has medicinal value for an ailing heart and removes gastritis.",
      "Jadhikkai Pickle: Aids the digestive function.",
      "Tamarind Green Chilly Pickle: Eaten as a side dish for idli, dosa, and curd rice.",
    ],
  },
  {
    title: "Oils",
    description: "Pure chekku (cold-pressed) oils for cooking and wellness.",
    gradient: "from-yellow-600 to-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    items: [
      "Cekku (Chaki) Groundnut Oil: Extracted from groundnuts using a country oil extractor (Cekku). Full of aroma and is healthy.",
      "Cekku (Chaki) Coconut Oil: Contains 'Monolarin', which is found in mother's milk. It's chemical-free and can be used for any cooking.",
      "Cekku (Chaki) Gingelly Oil: Extracted from quality Gingelly by adding country jaggery. Used for both cooking and bathing.",
    ],
  },
];

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; category: string; price: number; description?: string } | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalProduct, setModalProduct] = useState<{ name: string; category: string; price: number; description?: string; image?: string | null } | null>(null);
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const { tempSamples, hasTempSamples } = useTempSamples();
  
  // Check if user has discount eligibility from free samples
  const hasDiscountEligibility = localStorage.getItem('hasDiscountEligibility') === 'true';
  
  // Debug: Check temp samples on component mount
  console.log('📱 CategoryPage mounted with temp samples:', { tempSamples, hasSamples: hasTempSamples(), count: tempSamples?.length });
  
  // Parse the category slug and find matching category
  const decodedSlug = slug ? parseCategorySlug(slug) : '';
  const category = categories.find((c) => toSlug(c.title) === decodedSlug);

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

  const handleBuyNow = (productName: string) => {
    console.log('🚀 CategoryPage handleBuyNow called for:', productName);
    console.log('📊 TempSamples context state:', { tempSamples, hasTempSamples: hasTempSamples(), count: tempSamples?.length });
    
    // Use discounted price if eligible, otherwise regular price
    const originalPrice = 200;
    const price = hasDiscountEligibility ? 180 : originalPrice;
    // Find the full item string for better description
    const fullItem = category?.items.find(item => getItemTitle(item) === productName) || productName;
    const product = { name: productName, category: category!.title, price, description: getProductDescription(fullItem) };
    setSelectedProduct(product);
    
    // Create current product item
    const currentProductItem = {
      product_name: product.name,
      quantity: 1,
      price: product.price,
      category: product.category,
      isSample: false
    };

    // Merge temp samples with current product
    const allItems = hasTempSamples() ? [...tempSamples, currentProductItem] : [currentProductItem];
    console.log('🛒 CategoryPage merging items:', { tempSamples, currentProduct: currentProductItem, allItems });
    console.log('🎯 Final merged items count:', allItems.length);

    // Calculate totals (samples are free)
    const productTotal = product.price;
    let discountAmount = 0;
    let finalAmount = productTotal;

    // Apply 10% discount if there are samples
    if (hasTempSamples() && localStorage.getItem('hasDiscountEligibility') === 'true') {
      discountAmount = productTotal * 0.1;
      finalAmount = productTotal - discountAmount;
    }
    
    // Store merged product data for guest checkout
    localStorage.setItem('pendingProduct', JSON.stringify({ ...product, items: allItems, total_amount: productTotal, discount_amount: discountAmount, final_amount: finalAmount }));
    
    // Check if user is already authenticated
    if (user) {
      // User is logged in, go directly to order details
      navigate('/order-details', { 
        state: { 
          isAuthenticated: true, 
          productName: product.name, 
          category: product.category, 
          price: product.price,
          items: allItems,
          total_amount: productTotal,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          isFromBuyNow: true,
          hasTempSamples: hasTempSamples()
        } 
      });
    } else {
      // User is not logged in, show auth modal
      setShowAuthModal(true);
    }
  };
  
  const getProductDescription = (productName: string): string => {
    // Find the full item description from the category items
    const fullItem = category?.items.find(item => {
      // Handle items that already have descriptions
      if (item.includes(':')) {
        return item.split(':')[0].trim() === productName;
      }
      // Handle special case for Koozh Vathal
      if (productName === "Koozh Vathal") {
        return item === "Koozh Vathal";
      }
      return item === productName;
    });
    
    if (fullItem) {
      if (fullItem.includes(':')) {
        return `${productName}: ${fullItem.split(':')[1].trim()}`;
      } else if (productName === "Koozh Vathal") {
        return "Koozh Vathal - Prepared from wet-ground boiled rice with salt and spices.";
      }
    }
    
    return `${productName} - A quality product from our ${category?.title} collection.`;
  };
  
  // Extract just the title part (before the colon) from a full item string
  const getItemTitle = (item: string): string => {
    return item.includes(':') ? item.split(':')[0].trim() : item;
  };
  
  const handleProductClick = (productName: string) => {
    // Force all products to be ₹200
    const price = 200;
    
    // Find the full item string from the category items for better description and image matching
    const fullItem = category?.items.find(item => getItemTitle(item) === productName) || productName;
    const imgSrc = getProductImage(fullItem, category!.title);
    
    navigate('/product-details', {
      state: {
        product: {
          name: productName,
          category: category!.title,
          price,
          description: getProductDescription(productName),
          image: imgSrc
        }
      }
    });
  };

  const handleAddToCart = (productName: string) => {
    // Use discounted price if eligible, otherwise regular price
    const originalPrice = 200;
    const price = hasDiscountEligibility ? 180 : originalPrice;
    addToCart({ product_name: productName, category: category!.title, price, quantity: 1 });
  };

  const handleQuickView = (productName: string) => {
    const originalPrice = 200;
    const price = hasDiscountEligibility ? 180 : originalPrice;
    const fullItem = category?.items.find(item => getItemTitle(item) === productName) || productName;
    const imgSrc = getProductImage(fullItem, category!.title);
    
    setModalProduct({
      name: productName,
      category: category!.title,
      price,
      description: getProductDescription(fullItem),
      image: imgSrc
    });
    setShowProductModal(true);
  };

  const handleModalBuyNow = () => {
    if (modalProduct) {
      setShowProductModal(false);
      handleBuyNow(modalProduct.name);
    }
  };

  const handleModalAddToCart = () => {
    if (modalProduct) {
      handleAddToCart(modalProduct.name);
    }
  };

  const handleSignIn = () => { setShowAuthModal(false); navigate('/login'); };
  const handleGuest = () => {
    setShowAuthModal(false);
    
    // Get merged product data from localStorage
    const pendingProduct = JSON.parse(localStorage.getItem('pendingProduct') || '{}');
    
    if (selectedProduct) {
      navigate('/order-details', { 
        state: { 
          isAuthenticated: false, 
          productName: selectedProduct.name, 
          category: selectedProduct.category, 
          price: selectedProduct.price,
          items: pendingProduct.items || [{
            product_name: selectedProduct.name,
            quantity: 1,
            price: selectedProduct.price,
            category: selectedProduct.category
          }],
          total_amount: pendingProduct.total_amount || selectedProduct.price,
          discount_amount: pendingProduct.discount_amount || 0,
          final_amount: pendingProduct.final_amount || selectedProduct.price,
          isFromBuyNow: true,
          hasTempSamples: hasTempSamples()
        } 
      });
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist or has been moved.</p>
          <Link to="/">
            <button className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-300">Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  const isPowderCategory = /podi|powder/i.test(category.title);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/25 to-blue-300/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/#categories" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Back to Categories</span>
          </Link>
        </div>
        
        <div className={`rounded-2xl overflow-hidden mb-6 bg-gradient-to-r ${category.gradient} p-6 md:p-10 relative shadow-xl`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/50 rounded-full"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-sm">{category.title}</h1>
            <p className="text-white/95 text-lg max-w-3xl leading-relaxed">{category.description}</p>
          </div>
        </div>
        
        {/* Modern E-commerce Product Grid */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {category.items.map((item, index) => {
            const itemLower = item.toLowerCase();
            const fastMovingList = ['puliodharai mix','vathakkuzhambu mix','poondu pickle','pirandai pickle','jathikkai pickle','mudakkathan pickle','kara narthangai pickle','turmeric powder','sambar powder','rasam powder','ellu idli powder','poondu idli powder','andra spl paruppu powder','moringa leaf powder','curry leaves powder','red chilli powder','ulundhu appalam','rice appalam','kizhangu appalam'];
            const isFast = fastMovingList.some((x) => itemLower.includes(x));
            
            // Get just the title part for display
            const itemTitle = getItemTitle(item);
            
            // Get image based on the full item text for better matching
            const imgSrc = getProductImage(item, category.title);

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Product Image Container */}
                <div className="relative">
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">5% off</span>
                  </div>
                  
                  {/* Product Image with angled effect */}
                  <div className="h-56 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 overflow-hidden">
                    {imgSrc ? (
                      <img 
                        src={imgSrc} 
                        alt={itemTitle} 
                        className="max-w-full max-h-full object-contain transform rotate-3 hover:rotate-0 transition-transform duration-300 hover:scale-110"
                        style={{
                          filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center transform rotate-3">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-5">
                  {/* Product Name */}
                  <h3 className="text-gray-800 font-medium text-base mb-4 leading-tight" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '3rem'
                  }}>
                    {itemTitle}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{hasDiscountEligibility ? '180' : '200'}
                    </span>
                    {hasDiscountEligibility && (
                      <span className="text-sm text-gray-500 line-through">₹200</span>
                    )}
                  </div>
                  
                  {/* Weight Badge */}
                  <div className="mb-5">
                    <span className="bg-black text-white text-sm font-medium px-3 py-1.5 rounded-full">200g</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(itemTitle); }}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl"
                      title="Add to Cart"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleQuickView(itemTitle); }}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl"
                      title="Quick View"
                    >
                      <Expand className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSignIn={handleSignIn} onGuest={handleGuest} />
      
      {/* Product Details Modal */}
      {showProductModal && modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
              <button 
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center h-80">
                  {modalProduct.image ? (
                    <img 
                      src={modalProduct.image} 
                      alt={modalProduct.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                      <p>No Image Available</p>
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  {/* Discount Badge */}
                  <div>
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-md">5% off</span>
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="text-2xl font-bold text-gray-900">{modalProduct.name}</h3>
                  
                  {/* Category */}
                  <p className="text-gray-600">{modalProduct.category}</p>
                  
                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{hasDiscountEligibility ? '180' : '200'}
                    </span>
                    {hasDiscountEligibility && (
                      <span className="text-lg text-gray-500 line-through">₹200</span>
                    )}
                  </div>
                  
                  {/* Weight */}
                  <div>
                    <span className="bg-black text-white text-sm font-medium px-3 py-1 rounded-full">200g</span>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Description</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {modalProduct.description?.split(': ')[1] || modalProduct.description}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <button 
                      onClick={handleModalBuyNow}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Buy Now</span>
                    </button>
                    
                    <button 
                      onClick={handleModalAddToCart}
                      className={`w-full font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                        isInCart(modalProduct.name) 
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      {isInCart(modalProduct.name) ? (
                        <><Check className="h-5 w-5" /><span>Added to Cart</span></>
                      ) : (
                        <><Plus className="h-5 w-5" /><span>Add to Cart</span></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
