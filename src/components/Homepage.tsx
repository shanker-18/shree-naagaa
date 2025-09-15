import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  X,
  ShoppingCart,
  
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Heart,
  Leaf,
  Award,
  
  Package,
  Sparkles,
  Crown,
  Gift,
  
  Coffee,
  Expand,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { categories } from '../data/categories';
import { createCategoryUrl, toSlug } from '../utils/slugUtils';

// Custom CSS for premium styling
const customStyles = `
  .corporate-blue {
    color: #1e3a8a;
  }
  .corporate-blue-bg {
    background-color: #1e3a8a;
  }
  .corporate-blue-border {
    border-color: #1e3a8a;
  }
  .corporate-blue-gradient {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  }
  .animation-delay-300 {
    animation-delay: 0.3s;
  }
  .animation-delay-600 {
    animation-delay: 0.6s;
  }
  .fast-moving-label {
    background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 4px 8px rgba(220, 38, 38, 0.25);
  }
  .special-dish-label {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 4px 8px rgba(30, 64, 175, 0.25);
  }
  .enhanced-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid rgba(30, 64, 175, 0.1);
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .enhanced-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(30, 64, 175, 0.1), 0 10px 10px -5px rgba(30, 64, 175, 0.05);
    border-color: rgba(30, 64, 175, 0.2);
  }
  .product-image-container {
    position: relative;
    overflow: hidden;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .product-image {
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .product-image-container:hover .product-image {
    transform: scale(1.08);
  }
  .label-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .enhanced-header {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(30, 64, 175, 0.1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .enhanced-button {
    background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
    box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.25);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.025em;
  }
  .enhanced-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -2px rgba(220, 38, 38, 0.15);
  }
  .enhanced-section {
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  }
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
  .brand-duo-text {
    background: linear-gradient(135deg, #991b1b 0%, #1e3a8a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 10px rgba(30, 64, 175, 0.1);
  }
  
  /* @keyframes scroll - DISABLED */
  /* .animate-scroll - DISABLED */
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const Homepage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChatText, setShowChatText] = useState(true);
  const { profile } = useAuth();

  // Create refs for scroll containers
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Scroll function for category items
  const scrollCategory = (categoryIndex: number, direction: 'left' | 'right') => {
    const scrollContainer = scrollRefs.current[`category-${categoryIndex}`];
    if (scrollContainer) {
      const scrollAmount = 280; // Width of one card + gap
      const currentScroll = scrollContainer.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Check if scroll is needed
  const [scrollStates, setScrollStates] = useState<{ [key: string]: { canScrollLeft: boolean, canScrollRight: boolean } }>({});
  
  const updateScrollState = (categoryIndex: number) => {
    const scrollContainer = scrollRefs.current[`category-${categoryIndex}`];
    if (scrollContainer) {
      const canScrollLeft = scrollContainer.scrollLeft > 0;
      const canScrollRight = scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      setScrollStates(prev => ({
        ...prev,
        [`category-${categoryIndex}`]: { canScrollLeft, canScrollRight }
      }));
    }
  };
  
  // Extract item title (before colon)
  const getItemTitle = (item: string): string => {
    return item.includes(':') ? item.split(':')[0].trim() : item;
  };

  // Comprehensive image mapping for all categories - Updated to match available images
  const productImageMap: { pattern: RegExp; src: string; category?: string }[] = [
    // Powder category - exact matches with available images
    { pattern: /^turmeric.*powder|manjal.*powder/i, src: '/Items/Turmeric Powder.jpeg', category: 'Powder' },
    { pattern: /^sambar.*powder/i, src: '/Items/Sambar powder.jpeg', category: 'Powder' },
    { pattern: /^rasam.*powder/i, src: '/Items/Rasam Powder.jpeg', category: 'Powder' },
     { pattern: /^idli.*powder/i, src: '/Items/Idli Powder.jpeg', category: 'Powder' },
    { pattern: /^poondu.*idli.*powder|^poondu.*idly.*powder/i, src: '/Items/Poondu Idli Powder.jpeg', category: 'Powder' },
    { pattern: /^ellu.*idli.*powder/i, src: '/Items/Idli Powder.jpeg', category: 'Powder' },
    { pattern: /^andra.*spl.*paruppu.*powder/i, src: '/Items/Sambar powder.jpeg', category: 'Powder' }, // Using similar image
    { pattern: /^moringa.*leaf.*powder/i, src: '/Items/Turmeric Powder.jpeg', category: 'Powder' }, // Using similar image
    { pattern: /^curry.*leaves.*powder/i, src: '/Items/Idli Powder.jpeg', category: 'Powder' }, // Using similar image
    { pattern: /^red.*chilli.*powder/i, src: '/Items/Sambar powder.jpeg', category: 'Powder' }, // Using similar image
    
    // Mix & Pickle category - exact matches with available images
    { pattern: /^puliodharai.*mix|^puliyotharai.*mix|tamarind.*mix/i, src: '/Items/Puliyotharai Mix.jpeg', category: 'Mix & Pickle' },
     { pattern: /^puliyotharai.*tamarind.*mix/i, src: '/Items/Puliyotharai Mix.jpeg', category: 'Mix & Pickle' },
    { pattern: /^vathakkuzhambu.*mix|vathal.*kuzhambu.*mix/i, src: '/Items/Vathakkuzhambu Mix.jpeg', category: 'Mix & Pickle' },
    { pattern: /^puliyokuzhambu.*powder/i, src: '/Items/Puliyokuzhambu Powder.jpeg', category: 'Mix & Pickle' },
    { pattern: /^poondu.*pickle/i, src: '/Items/Poondu pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^garlic.*pickle/i, src: '/Items/Garlic Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^pirandai.*pickle/i, src: '/Items/Pirandai pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^jathikkai.*pickle/i, src: '/Items/Jathikkai pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^jadhikkai.*pickle/i, src: '/Items/Jadhikkai Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^mudakatthan.*pickle|^mudakkathan.*pickle/i, src: '/Items/Mudakatthan Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^kara.*narthangai.*pickle/i, src: '/Items/Kara narthangai pickle.jpeg', category: 'Mix & Pickle' },
    
    // Appalam category - using available images as fallbacks
    { pattern: /^ulundhu.*appalam/i, src: '/Items/Idli Powder.jpeg', category: 'Appalam' }, // Using similar image
    { pattern: /^rice.*appalam/i, src: '/Items/Turmeric Powder.jpeg', category: 'Appalam' }, // Using similar image
    { pattern: /^kizhangu.*appalam/i, src: '/Items/Sambar powder.jpeg', category: 'Appalam' }, // Using similar image
    
    // Coffee category - using available image as fallback
    { pattern: /^coffee.*powder/i, src: '/Items/Idli Powder.jpeg', category: 'Coffee' }, // Using similar image
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

  // testimonials reserved for future use
  // const testimonials = [...];

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  // };
  // 
  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  // };
  
  // Initialize scroll states when component mounts
  useEffect(() => {
    // Slight delay to ensure DOM is ready
    setTimeout(() => {
      categories.forEach((_, categoryIndex) => {
        updateScrollState(categoryIndex);
      });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-100">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />



      {/* Hero Section - Empty Image Placeholder */}
      <section
        id="home"
        className="relative h-96 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border-b border-gray-200"
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Image carousel will be placed here</p>
          </div>
        </div>
      </section>

      {/* Our Products Section - Horizontal Scroll */}
      <section id="categories" className="py-20 bg-gradient-to-b from-slate-100 via-blue-50 to-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold corporate-blue mb-4 tracking-tight">
              Our Products
            </h2>
            <p className="text-lg text-red-600 max-w-2xl mx-auto font-medium italic">
              Discover our complete collection of authentic Indian spices and products
            </p>
          </div>

          {/* Horizontal Scrolling Products */}
          <div className="relative">
            <div 
              ref={el => scrollRefs.current['all-products'] = el}
              className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide px-4" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {(() => {
                // Flatten all products from all categories
                const allProducts: Array<{ item: string, category: string, categoryTitle: string }> = [];
                categories.forEach(category => {
                  category.items.forEach(item => {
                    allProducts.push({
                      item,
                      category: category.title,
                      categoryTitle: category.title
                    });
                  });
                });
                
                return allProducts.map((product, index) => {
                  const itemTitle = getItemTitle(product.item);
                  const imgSrc = getProductImage(itemTitle, product.category);
                  
                  return (
                    <Link 
                      key={index}
                      to={`/category/${toSlug(product.category)}`}
                      className="flex-none w-80 group cursor-pointer"
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group-hover:-translate-y-1 relative">
                        {/* 5% OFF Badge */}
                        <div className="absolute top-3 right-3 z-20">
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            5% OFF
                          </span>
                        </div>
                        
                        {/* Vegetarian Icon */}
                        <div className="absolute top-3 left-3 z-20">
                          <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Product Image Container */}
                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <div className="h-full flex items-center justify-center p-4">
                            {imgSrc ? (
                              <img 
                                src={imgSrc} 
                                alt={itemTitle} 
                                className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain'
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center ${imgSrc ? 'hidden' : 'flex'}`}>
                              <div className="text-center text-gray-400">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <p className="text-sm font-medium">Product Image</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="p-5">
                          <h3 className="text-gray-800 font-bold text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-300" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '3.5rem'
                          }}>
                            {itemTitle}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4">Ready-to-cook authentic traditional mix</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-gray-900">₹200</span>
                              <span className="text-lg text-gray-500 line-through">₹240</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                });
              })()
              }
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => {
                const container = scrollRefs.current['all-products'];
                if (container) {
                  container.scrollBy({ left: -350, behavior: 'smooth' });
                }
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200 z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            
            <button 
              onClick={() => {
                const container = scrollRefs.current['all-products'];
                if (container) {
                  container.scrollBy({ left: 350, behavior: 'smooth' });
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200 z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>



      {/* Brand Story Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-full max-w-sm h-64 bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl shadow-lg flex items-center justify-center border border-blue-100">
                  <img
                    src="/logo.png"
                    alt="Shree Raga SWAAD GHAR Logo"
                    className="h-40 w-40 object-contain drop-shadow-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden h-40 w-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center drop-shadow-xl">
                    <Leaf className="h-16 w-16 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold corporate-blue tracking-tight">Our Heritage Story</h2>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  Prepared the age-old way with handpicked ingredients and no artificial additives, our foods carry the true flavor of our heritage, straight from our kitchen to yours.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  Every product at Shree Raaga Swaad Ghar tells a story of tradition, passed down through generations of culinary expertise and refined with modern care.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  Shree Raaga Swaad Ghar is where flavors sing the melody of tradition. Every jar of pickle, every spoon of podi, every drop of chekku oil and ghee is a tribute to timeless recipes passed down through generations. Blended with the purity of nature and the care of handmade preparation, our creations carry the essence of a bygone era, touched with the finesse of modern taste. Here, every bite is not just food — it’s a memory, a story, and a celebration of heritage.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="text-center">
                    <Award className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold corporate-blue italic">Premium Quality</p>
                  </div>
                  <div className="text-center">
                    <Leaf className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold corporate-blue italic">Natural Ingredients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Get In Touch
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium italic">
              Ready to experience authentic flavors? Contact us today!
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-blue-200 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white text-lg font-medium mb-1">Address</p>
                      <p className="text-white/90 text-sm leading-relaxed">
                        99/50 Gopala Krishna Swamy Kovil Street<br/>
                        Krishnapuram, Tenkasi - 627759
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-blue-200 flex-shrink-0" />
                    <div>
                      <p className="text-white text-lg font-medium">Email</p>
                      <p className="text-white/90">shreeraagaswaadghar@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6 text-blue-200 flex-shrink-0" />
                    <div>
                      <p className="text-white text-lg font-medium">Phone</p>
                      <p className="text-white/90">+91 90250 85523</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <svg className="h-6 w-6 text-blue-200 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    <div>
                      <p className="text-white text-lg font-medium">WhatsApp</p>
                      <p className="text-white/90">+91 7305391377</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <svg className="h-6 w-6 text-blue-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                    <div>
                      <p className="text-white text-lg font-medium">Online Store</p>
                      <a href="https://www.shreeraagaswaadghar.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                        www.shreeraagaswaadghar.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
        {/* Chat with us text - conditionally rendered */}
        {showChatText && (
          <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2">
            <span className="text-sm font-medium text-black whitespace-nowrap">Chat with us</span>
            <button 
              onClick={() => setShowChatText(false)}
              className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Hide chat text"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/917305391377" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
          </svg>
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
                              <div className="flex items-center space-x-2 mb-6">
                  <Coffee className="h-8 w-8 text-red-400" />
                  <span className="text-xl font-bold">Shree Raaga SWAAD GHAR</span>
                </div>
              <p className="text-gray-300 leading-relaxed font-medium">
                Bringing timeless taste of tradition to your table with authentic Indian flavors made with love and care.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'Categories', 'About Us', 'Contact', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-red-400" />
                  <span className="text-gray-300">+91 90250 85523</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-red-400" />
                  <span className="text-gray-300">shreeraagaswaadghar@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-red-400" />
                  <span className="text-gray-300">Krishnapuram, Tenkasi</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Follow Us</h4>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-300 hover:text-red-400 cursor-pointer transition-colors duration-300" />
                <Instagram className="h-6 w-6 text-gray-300 hover:text-red-400 cursor-pointer transition-colors duration-300" />
                <Twitter className="h-6 w-6 text-gray-300 hover:text-red-400 cursor-pointer transition-colors duration-300" />
              </div>

            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 Shree Raaga SWAAD GHAR. All rights reserved. Made with ❤️ for traditional flavors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;