import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types
interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
}

interface Order {
  id: string;
  order_id?: string; // MongoDB ID field
  user_id?: string;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  items: any[];
  final_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

interface DemoContextType {
  isDemo: boolean;
  user: User | null;
  orders: Order[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'created_at' | 'status'>) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  getOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<{ success: boolean; error?: string }>;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};

interface DemoProviderProps {
  children: ReactNode;
}

export const DemoProvider: React.FC<DemoProviderProps> = ({ children }) => {
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Always use demo mode since backend is removed
    setIsDemo(true);
    // Load demo data from MongoDB
    const loadData = async () => {
      await loadUserData();
      await fetchOrdersFromAPI();
    };
    loadData();
  }, []);

  const loadUserData = async () => {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('demo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };
  
  // Fetch orders from the backend API
  const fetchOrdersFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/orders');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          // Transform MongoDB orders to match our Order interface
          const formattedOrders = data.orders.map((order: any) => ({
            id: order.order_id || order._id,
            order_id: order._id,
            user_id: order.user_id,
            guest_name: order.guest_name,
            guest_phone: order.guest_phone,
            guest_address: order.guest_address,
            items: order.items,
            final_amount: order.total_price,
            status: order.status,
            created_at: order.created_at || new Date().toISOString()
          }));
          setOrders(formattedOrders);
          console.log(`Loaded ${formattedOrders.length} orders from MongoDB API`);
        }
      } else {
        console.error('Failed to fetch orders from API');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Always in demo mode now
      const demoUser = {
        id: 'demo-' + uuidv4(),
        email,
        name: 'Demo User',
      };
      setUser(demoUser);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Always in demo mode now
      const demoUser = {
        id: 'demo-' + uuidv4(),
        email,
        name,
      };
      setUser(demoUser);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      return { success: true };
    } catch (err: any) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'status'>) => {
    try {
      // Prepare order data for API
      const apiOrderData = {
        user_id: orderData.user_id,
        guest_name: orderData.guest_name,
        guest_phone: orderData.guest_phone,
        guest_address: orderData.guest_address,
        items: orderData.items.map(item => ({
          name: item.product_name,
          qty: item.quantity
        })),
        total_price: orderData.final_amount,
        status: 'pending'
      };
      
      // Send order to backend API
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiOrderData)
      });
      
      if (!response.ok) {
        throw new Error(`API error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.order) {
        // Create a new order object from the API response
        const newOrder: Order = {
          id: result.order.order_id,
          order_id: result.order._id,
          user_id: result.order.user_id,
          guest_name: result.order.guest_name,
          guest_phone: result.order.guest_phone,
          guest_address: result.order.guest_address,
          items: result.order.items,
          final_amount: result.order.total_price,
          status: result.order.status,
          created_at: result.order.created_at || new Date().toISOString()
        };
        
        // Update local state with the new order
        setOrders([...orders, newOrder]);
        console.log('Order created in MongoDB:', newOrder.id);
        
        return { success: true, orderId: newOrder.id };
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      return { success: false, error: err.message };
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      console.log('Updating order status for ID:', orderId);
      
      // Trim any whitespace that might be causing comparison issues
      const cleanOrderId = orderId.trim();
      
      // Send status update to backend API
      const response = await fetch(`http://localhost:5001/api/orders/${cleanOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`API error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Update the order in local state
        const updatedOrders = orders.map(order => {
          if (order.id === cleanOrderId || order.order_id === cleanOrderId) {
            return { ...order, status };
          }
          return order;
        });
        
        setOrders(updatedOrders);
        console.log('Order status updated in MongoDB:', cleanOrderId);
        
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to update order status');
      }
    } catch (err: any) {
      console.error('Order status update error:', err);
      return { success: false, error: err.message || 'Failed to update order status' };
    }
  };

  const getOrders = async () => {
    try {
      // Refresh orders from API
      await fetchOrdersFromAPI();
      
      // Return all orders if no user is logged in
      if (!user) {
        return orders;
      }
      
      // If user is logged in, filter orders for this user
      const userOrders = orders.filter(order => order.user_id === user.id);
      return userOrders;
    } catch (error) {
      console.error('Error getting orders:', error);
      return orders; // Return current state as fallback
    }
  };

  // Make context available globally for orderService
  if (typeof window !== 'undefined') {
    (window as any).__demoContext = {
      createOrder,
      updateOrderStatus,
      getOrders
    };
  }

  return (
    <DemoContext.Provider
      value={{
        isDemo,
        user,
        orders,
        login,
        register,
        logout,
        createOrder,
        getOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};
