// Order service implementation

import { v4 as uuidv4 } from 'uuid';
import { saveOrderToMongoDB, getOrderFromMongoDB, updateOrderStatusInMongoDB } from './mongodb';
import { sendWarehouseEmail } from './email';
// Don't import useDemoContext hook here as it can only be used in React components

// Function to place an order and send warehouse email
export const placeOrder = async (order: any) => {
  try {
    // save order to MongoDB (API call)
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save order: ${response.statusText}`);
    }
    
    // send warehouse email
    const emailResult = await sendWarehouseEmail(order);
    
    return {
      success: true,
      orderResult: await response.json(),
      emailResult
    };
  } catch (error: any) {
    console.error("Error in placeOrder:", error);
    return {
      success: false,
      error: error.message || "Failed to place order"
    };
  }
};

// Define order interface
interface OrderData {
  user_id?: string | null;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    category: string;
  }>;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  is_guest: boolean;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

// Create order function
export async function createOrder(orderData: OrderData) {
  try {
    // First try to save to MongoDB via the Data API
    try {
      // Generate a UUID for the order
      const orderId = uuidv4();
      
      // Format the order data for MongoDB
      const mongoOrderData = {
        order_id: orderId, // Use the generated UUID
        user_id: orderData.user_id || null,
        guest_name: orderData.guest_name,
        guest_phone: orderData.guest_phone,
        guest_address: orderData.guest_address,
        items: orderData.items.map(item => ({
          name: item.product_name,
          qty: item.quantity
        })),
        total_price: orderData.final_amount,
        payment_status: 'Confirmed', // Set to Confirmed as per requirements
        delivery_date: '3-5 business days', // Set as per requirements
        status: 'pending' // Initial status
      };
      
      console.log('Sending order to MongoDB:', mongoOrderData);
      
      // Save to MongoDB using the backend API
      const result = await saveOrderToMongoDB(mongoOrderData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save order to MongoDB');
      }
      
      if (result.success) {
        // Use the order_id from the backend response
        const savedOrderId = result.order?.order_id || orderId;
        // If MongoDB returns a different ID (_id), store it as order_id
        const mongoDbId = result.order?._id;
        console.log('Order saved to backend successfully:', savedOrderId);
        console.log('MongoDB _id:', mongoDbId);
        
        // Store the order in localStorage as a backup
        storeOrderInLocalStorage({
          ...orderData,
          id: savedOrderId,
          // Store MongoDB _id as order_id if available
          order_id: mongoDbId || savedOrderId,
          created_at: new Date().toISOString(),
          backend_saved: true
        });
        
        // Optionally fetch the saved order from MongoDB to sync with context
        // This could be implemented here if needed
        
        return { success: true, orderId: savedOrderId, mongoDbId };
      } else {
        throw new Error(result.message || 'Failed to save order to backend');
      }
    } catch (apiError) {
      console.error('Failed to save order to backend API:', apiError);
      // Continue to fallback methods
    }
    
    // Fallback to DemoContext if API fails
    // Create a simplified order object for DemoContext
    const simplifiedOrder = {
      user_id: orderData.user_id || undefined,
      guest_name: orderData.guest_name,
      guest_phone: orderData.guest_phone,
      guest_address: orderData.guest_address,
      items: orderData.items,
      final_amount: orderData.final_amount
    };
    
    // Use window object to access the global context instance
    if (typeof window !== 'undefined' && (window as any).__demoContext) {
      const result = await (window as any).__demoContext.createOrder(simplifiedOrder);
      console.log('Order saved to DemoContext:', result.orderId);
      
      // Also store in localStorage as a backup
      storeOrderInLocalStorage({
        ...orderData,
        id: result.orderId,
        // Set order_id to be the same as id for consistency
        order_id: result.orderId,
        created_at: new Date().toISOString(),
        backend_saved: false,
        saved_to: 'demoContext'
      });
      
      return result;
    } else {
      // Final fallback to local storage if context is not available
      const orderId = uuidv4();
      const newOrder = {
        ...orderData,
        id: orderId,
        // Set order_id to be the same as id for consistency
        order_id: orderId,
        created_at: new Date().toISOString(),
        backend_saved: false,
        saved_to: 'localStorage'
      };
      
      // Store in localStorage
      storeOrderInLocalStorage(newOrder);
      
      console.log('Order saved to localStorage:', orderId);
      return { success: true, orderId };
    }
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Failed to create order' };
  }
}

// Helper function to store order in localStorage
function storeOrderInLocalStorage(order: any) {
  try {
    const existingOrders = localStorage.getItem('demo_orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(order);
    localStorage.setItem('demo_orders', JSON.stringify(orders));
    console.log('Order stored in localStorage:', order.id);
  } catch (error) {
    console.error('Failed to store order in localStorage:', error);
  }
}