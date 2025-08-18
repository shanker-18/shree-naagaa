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
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <div className="pt-16">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
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
      </CartProvider>
    </AuthProvider>
  );
}

export default App;