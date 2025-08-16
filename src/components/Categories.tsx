import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package, ArrowLeft } from 'lucide-react';

// Import the categories data
import { categories } from './CategoryPage';
const toSlug = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const Categories: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600">
            Our Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collection of authentic traditional products
          </p>
        </div>
        
         {/* Grid layout with 3 items per row for larger screens; page retained in case it's bookmarked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* First row - 3 categories */}
          {categories.slice(0, 3).map((category, index) => (
            <div 
              key={index}
              className={`rounded-xl shadow-lg overflow-hidden border ${category.borderColor} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
            >
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-r ${category.gradient} p-6 relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 right-2 w-12 h-12 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/50 rounded-full"></div>
                </div>
                
                {/* Title */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                  <p className="text-white/80 text-sm">{category.description}</p>
                </div>
              </div>
              
              {/* Items list */}
              <div className={`${category.bgColor} p-6`}>
                <ul className="space-y-2">
                  {category.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className={`w-2 h-2 ${category.textColor} rounded-full mr-3 flex-shrink-0`}></div>
                      <span className={`${category.textColor} text-sm font-medium`}>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {category.items.length > 3 && (
                  <p className="text-xs text-gray-500 mt-2 italic">+{category.items.length - 3} more items</p>
                )}
                
                {/* Action button */}
                <div className="mt-4">
                  <Link to={`/category/${toSlug(category.title)}`}>
                    <button className={`w-full bg-gradient-to-r ${category.gradient} text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm group`}>
                      <Package className="h-3.5 w-3.5" />
                      <span>Explore All</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second row - 3 categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(3, 6).map((category, index) => (
            <div 
              key={index + 3}
              className={`rounded-xl shadow-lg overflow-hidden border ${category.borderColor} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
            >
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-r ${category.gradient} p-6 relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 right-2 w-12 h-12 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/50 rounded-full"></div>
                </div>
                
                {/* Title */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                  <p className="text-white/80 text-sm">{category.description}</p>
                </div>
              </div>
              
              {/* Items list */}
              <div className={`${category.bgColor} p-6`}>
                <ul className="space-y-2">
                  {category.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className={`w-2 h-2 ${category.textColor} rounded-full mr-3 flex-shrink-0`}></div>
                      <span className={`${category.textColor} text-sm font-medium`}>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {category.items.length > 3 && (
                  <p className="text-xs text-gray-500 mt-2 italic">+{category.items.length - 3} more items</p>
                )}
                
                {/* Action button */}
                <div className="mt-4">
                  <Link to={`/category/${toSlug(category.title)}`}>
                    <button className={`w-full bg-gradient-to-r ${category.gradient} text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm group`}>
                      <Package className="h-3.5 w-3.5" />
                      <span>Explore All</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;