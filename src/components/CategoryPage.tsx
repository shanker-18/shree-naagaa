import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Plus, Check } from 'lucide-react';
import AuthModal from './AuthModal';
import { useCart } from '../contexts/CartContext';

export const categories = [
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
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; category: string; price: number; description?: string } | null>(null);
  const { addToCart, isInCart } = useCart();
  
  const toSlug = (input: string): string =>
    input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = categories.find((c) => toSlug(c.title) === (categoryName || '').toLowerCase());

  // Explicit image mapping for Powder category
  const powderImageMap: { pattern: RegExp; src: string }[] = [
    { pattern: /sambar/i, src: '/Items/Sambar powder.jpeg' },
    { pattern: /red\s*chilli|chilli/i, src: '/Items/Red chilli powder.jpeg' },
    { pattern: /rasam/i, src: '/Items/Rasam.jpeg' },
    { pattern: /turmeric|manjal/i, src: '/Items/Pure Turmeric powder.jpeg' },
    { pattern: /puliyo?kuzhambu|puli\s*kuzhambu/i, src: '/Items/Puliyokuzhambu Powder.jpeg' },
    { pattern: /moringa|drumstick/i, src: '/Items/moringa leaf.jpeg' },
    { pattern: /kollu|horse\s*gram/i, src: '/Items/kollu sadha powder.jpeg' },
    { pattern: /garlic.*idli|poondu.*idli/i, src: '/Items/Garlic idlie.jpeg' },
    { pattern: /ellu.*idli/i, src: '/Items/Idly Powder.jpeg' },
    { pattern: /curry\s*leaf|curry\s*leaves/i, src: '/Items/currly leaf.jpeg' },
    { pattern: /andra\s*spl|andhra/i, src: '/Items/Andra Spl.jpeg' },
    { pattern: /vathal\s*powder/i, src: '/Items/Vathal Powder.jpeg' },
    { pattern: /idli|idly/i, src: '/Items/Idly Powder.jpeg' },
  ];

  // Function to exclude specific products from image mapping
  const excludedProducts = ["Milagu (Pepper) Powder"];

  const getPowderImageForItem = (item: string): string | null => {
    // Check if the item is in the excluded products list
    if (excludedProducts.some(excluded => item.includes(excluded))) {
      return null;
    }
    
    const lower = item.toLowerCase();
    const found = powderImageMap.find((m) => m.pattern.test(lower));
    return found ? found.src : null;
  };

  const handleBuyNow = (productName: string) => {
    const defaultPrices: { [key: string]: number } = {
      'appalam': 150,
      'vadam': 120,
      'podi': 200,
      'herbal': 250,
      'rice': 180,
      'oils': 300
    };
    const price = defaultPrices[(categoryName || '').toLowerCase()] || 200;
    // Find the full item string for better description
    const fullItem = category?.items.find(item => getItemTitle(item) === productName) || productName;
    const product = { name: productName, category: category!.title, price, description: getProductDescription(fullItem) };
    setSelectedProduct(product);
    localStorage.setItem('pendingProduct', JSON.stringify(product));
    setShowAuthModal(true);
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
    const defaultPrices: { [key: string]: number } = {
      'appalam': 150,
      'vadam': 120,
      'podi': 200,
      'herbal': 250,
      'rice': 180,
      'oils': 300
    };
    const price = defaultPrices[(categoryName || '').toLowerCase()] || 200;
    
    // Find the full item string from the category items for better description and image matching
    const fullItem = category?.items.find(item => getItemTitle(item) === productName) || productName;
    const imgSrc = isPowderCategory ? getPowderImageForItem(fullItem) : null;
    
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
    const defaultPrices: { [key: string]: number } = {
      'appalam': 150,
      'vadam': 120,
      'podi': 200,
      'herbal': 250,
      'rice': 180,
      'oils': 300
    };
    const price = defaultPrices[(categoryName || '').toLowerCase()] || 200;
    addToCart({ product_name: productName, category: category!.title, price, quantity: 1 });
  };

  const handleSignIn = () => { setShowAuthModal(false); navigate('/login'); };
  const handleGuest = () => {
    setShowAuthModal(false);
    if (selectedProduct) {
      navigate('/order-details', { state: { isAuthenticated: false, productName: selectedProduct.name, category: selectedProduct.category, price: selectedProduct.price } });
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
  const [isGridView, setIsGridView] = useState(true);
  const gridClass = isGridView
    ? (isPowderCategory ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8')
    : 'space-y-4';

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
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1 shadow-lg">
              <button 
                onClick={() => setIsGridView(true)} 
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${isGridView 
                  ? 'bg-white text-gray-800 shadow-md transform scale-105' 
                  : 'text-white/90 hover:bg-white/20'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
              <button 
                onClick={() => setIsGridView(false)} 
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${!isGridView 
                  ? 'bg-white text-gray-800 shadow-md transform scale-105' 
                  : 'text-white/90 hover:bg-white/20'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                List
              </button>
            </div>
          </div>
        </div>
        
        <div className={gridClass}>
          {category.items.map((item, index) => {
            const itemLower = item.toLowerCase();
            const fastMovingList = ['puliodharai mix','vathakkuzhambu mix','poondu pickle','pirandai pickle','jathikkai pickle','mudakkathan pickle','kara narthangai pickle','turmeric powder','sambar powder','rasam powder','ellu idli powder','poondu idli powder','andra spl paruppu powder','moringa leaf powder','curry leaves powder','red chilli powder','ulundhu appalam','rice appalam','kizhangu appalam'];
            const isFast = fastMovingList.some((x) => itemLower.includes(x));
            
            // Get just the title part for display
            const itemTitle = getItemTitle(item);
            
            // Get image based on the full item text for better matching
            const imgSrc = isPowderCategory ? getPowderImageForItem(item) : null;

            if (!isGridView) {
              return (
                <div key={index} className={`bg-white rounded-xl shadow-sm p-4 border ${category.borderColor} hover:shadow-md transition-all duration-300 relative cursor-pointer`} onClick={() => handleProductClick(itemTitle)}>
                  {isFast && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm">Fast Moving</span>
                    </div>
                  )}

                  <div className="flex gap-4 items-center">
                    {imgSrc ? (
                      <div className={`w-28 h-20 bg-white border ${category.borderColor} rounded-md flex items-center justify-center overflow-hidden`}>
                        <img src={imgSrc} alt={itemTitle} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className={`w-28 h-20 bg-gray-50 border border-dashed ${category.borderColor} rounded-md flex items-center justify-center`}>
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <span className={`${category.textColor} text-base md:text-lg font-semibold leading-snug block`}>{itemTitle}</span>
                    </div>

                    <div className="w-48 min-w-[12rem] space-y-2">
                      <button onClick={(e) => { e.stopPropagation(); handleBuyNow(itemTitle); }} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 text-sm">
                        Buy Now
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleAddToCart(itemTitle); }} className={`w-full font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm ${isInCart(itemTitle) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-700 hover:to-orange-600'}`}>
                        {isInCart(itemTitle) ? 'Added to Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className={`bg-white rounded-2xl shadow-md p-6 border ${category.borderColor} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer`} onClick={() => handleProductClick(itemTitle)}>
                {isFast && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm">Fast Moving</span>
                  </div>
                )}

                {imgSrc ? (
                  <div className={`w-full h-44 md:h-52 bg-white border ${category.borderColor} rounded-lg mb-5 flex items-center justify-center overflow-hidden`}>
                    <img src={imgSrc} alt={itemTitle} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className={`w-full h-32 bg-gray-50 border border-dashed ${category.borderColor} rounded-lg mb-5 flex items-center justify-center`}>
                    <span className="text-gray-400 text-xs">Image not available</span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2.5 h-2.5 ${category.textColor} rounded-full flex-shrink-0`}></div>
                  <div className="flex-1">
                    <span className={`${category.textColor} text-base md:text-lg font-semibold leading-snug block`}>{itemTitle}</span>
                    <div className={`${category.textColor} h-0.5 w-12 opacity-60 rounded`} style={{ backgroundColor: 'currentColor' }}></div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button onClick={(e) => { e.stopPropagation(); handleBuyNow(itemTitle); }} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm group">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Buy Now</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleAddToCart(itemTitle); }} className={`w-full font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm group ${isInCart(itemTitle) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-700 hover:to-orange-600'}`}>
                    {isInCart(itemTitle) ? (<><Check className="h-4 w-4" /><span>Added to Cart</span></>) : (<><Plus className="h-4 w-4" /><span>Add to Cart</span></>)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSignIn={handleSignIn} onGuest={handleGuest} />
    </div>
  );
};

export default CategoryPage;
