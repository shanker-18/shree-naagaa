import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Plus, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductDetailsProps {}

const ProductDetails: React.FC<ProductDetailsProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  // Get product details from location state
  const { product } = location.state || {};
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been moved.</p>
          <Link to="/">
            <button className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-300">Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  const { name, category, description, price, image } = product;
  
  const handleAddToCart = () => {
    addToCart({ product_name: name, category, price, quantity: 1 });
  };

  const handleBuyNow = () => {
    if (!isInCart(name)) {
      addToCart({ product_name: name, category, price, quantity: 1 });
    }
    navigate('/cart');
  };

  // Determine category color scheme
  const getCategoryStyle = (categoryName: string) => {
    const categoryMap: Record<string, { gradient: string, bgColor: string, borderColor: string, textColor: string }> = {
      'Powders': {
        gradient: "from-red-600 to-rose-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
      },
      'Mixes': {
        gradient: "from-amber-600 to-orange-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-800",
      },
      'Vathal': {
        gradient: "from-blue-600 to-indigo-500",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
        textColor: "text-indigo-800",
      },
      'Appalam': {
        gradient: "from-emerald-600 to-green-500",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-800",
      },
      'Pickles': {
        gradient: "from-purple-600 to-indigo-500",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-800",
      },
      'Oils': {
        gradient: "from-yellow-600 to-amber-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-800",
      },
    };
    
    return categoryMap[categoryName] || {
      gradient: "from-gray-600 to-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-800",
    };
  };

  const categoryStyle = getCategoryStyle(category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/25 to-blue-300/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Back to {category}</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${categoryStyle.gradient} p-6 md:p-8`}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
            <div className="flex items-center">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">{category}</span>
              <span className="ml-4 text-white/90 text-lg font-semibold">₹{price}</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            <div>
              {image ? (
                <div className={`w-full h-80 ${categoryStyle.bgColor} border ${categoryStyle.borderColor} rounded-xl flex items-center justify-center overflow-hidden`}>
                  <img src={image} alt={name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className={`w-full h-80 bg-gray-50 border border-dashed ${categoryStyle.borderColor} rounded-xl flex items-center justify-center`}>
                  <span className="text-gray-400 text-sm">Image not available</span>
                </div>
              )}
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button 
                  onClick={handleBuyNow}
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Buy Now</span>
                </button>
                
                <button 
                  onClick={handleAddToCart}
                  className={`font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${isInCart(name) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-700 hover:to-orange-600'}`}
                >
                  {isInCart(name) ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className={`${categoryStyle.bgColor} ${categoryStyle.borderColor} border rounded-xl p-6`}>
                <p className="text-gray-700 leading-relaxed">{description}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Category:</span>
                      <span className="text-gray-800 font-medium">{category}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Price:</span>
                      <span className="text-gray-800 font-medium">₹{price}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Availability:</span>
                      <span className="text-green-600 font-medium">In Stock</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;