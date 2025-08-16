import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order.js';

// In-memory storage fallback
let inMemoryOrders = [];

const router = express.Router();

// Create new order
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;
    
    // Generate order_id if not provided
    if (!orderData.order_id) {
      orderData.order_id = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    
    console.log("📝 Creating order with ID:", orderData.order_id);
    console.log("📊 Order data:", JSON.stringify(orderData, null, 2));

    let order;
    
    // Try to save to MongoDB first
    try {
      order = await Order.create(orderData);
      console.log("✅ Order saved to MongoDB successfully");
      console.log("📋 MongoDB Order ID:", order._id);
    } catch (mongoError) {
      console.log("⚠️  MongoDB not available, using in-memory storage");
      console.error("MongoDB Error:", mongoError.message);
      // Fallback to in-memory storage
      order = {
        ...orderData,
        _id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date()
      };
      inMemoryOrders.push(order);
      console.log("✅ Order saved to in-memory storage");
    }

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Retrieve all orders
router.get('/', async (req, res) => {
  try {
    let orders = [];
    
    // Try to get from MongoDB first
    try {
      orders = await Order.find().sort({ created_at: -1 });
      console.log("✅ Orders retrieved from MongoDB");
    } catch (mongoError) {
      console.log("⚠️  MongoDB not available, using in-memory storage");
      // Fallback to in-memory storage
      orders = [...inMemoryOrders].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      console.log("✅ Orders retrieved from in-memory storage");
    }
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Retrieve a specific order by order_id
router.get('/:orderId', async (req, res) => {
  try {
    let order = null;
    
    // Try to get from MongoDB first
    try {
      order = await Order.findOne({ order_id: req.params.orderId });
      if (order) console.log("✅ Order retrieved from MongoDB");
    } catch (mongoError) {
      console.log("⚠️  MongoDB not available, using in-memory storage");
      // Fallback to in-memory storage
      order = inMemoryOrders.find(o => o.order_id === req.params.orderId);
      if (order) console.log("✅ Order retrieved from in-memory storage");
    }
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH - Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const result = await Order.findOneAndUpdate(
      { order_id: orderId },
      { 
        $set: { 
          status: status,
          updated_at: new Date()
        } 
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: result
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update order status'
    });
  }
});

export default router;
