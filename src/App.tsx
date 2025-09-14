import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import CategoryPage from './components/CategoryPage';
import Categories from './components/Categories';
import CartPage from './components/CartPage';
import Login from './components/Login';
import Register from './components/Register';
import OrderDetails from './components/OrderDetails';
import OrderSummary from './components/OrderSummary';
import ProductDetails from './components/ProductDetails';
import EmailTest from './components/EmailTest';
import Profile from './components/Profile';
import FreeSamplesPage from './components/FreeSamplesPage';
import Navbar from './components/Navbar';
import FreeSamplePopup from './components/FreeSamplePopup';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { TempSamplesProvider } from './contexts/TempSamplesContext';
import { useFreeSamplePopup } from './hooks/useFreeSamplePopup';

// Inner component to use hooks after providers are initialized
function AppContent() {
  const { isVisible, hidePopup, onClaim } = useFreeSamplePopup();

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/free-samples" element={<FreeSamplesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/email-test" element={<EmailTest />} />
          {/* EmailJS routes removed */}
        </Routes>
      </div>
      
      {/* Free Sample Popup */}
      <FreeSamplePopup 
        isVisible={isVisible}
        onClose={hidePopup}
        onClaim={onClaim}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <TempSamplesProvider>
          <AppContent />
        </TempSamplesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;