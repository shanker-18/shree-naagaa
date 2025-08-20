import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Order Schema (inline for serverless)
const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    default: null
  },
  guest_name: {
    type: String,
    required: true
  },
  guest_phone: {
    type: String,
    required: true
  },
  guest_address: {
    type: String,
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    qty: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      default: 0
    }
  }],
  total_price: {
    type: Number,
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  delivery_date: {
    type: String,
    default: '3-5 business days'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updated_at field before saving
orderSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// In-memory storage fallback
let inMemoryOrders = [];
let isConnected = false;
let Order;

// MongoDB Connection
async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sample_mflix';
    await mongoose.connect(mongoUri);
    isConnected = true;
    
    // Create or get the model
    if (!Order) {
      Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
    }
    
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log("⚠️ MongoDB connection failed, using in-memory storage");
    console.error("MongoDB Error:", error.message);
    isConnected = false;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectToDatabase();

  try {
    if (req.method === 'GET') {
      // GET all orders or specific order
      const { orderId } = req.query;
      
      if (orderId) {
        // Get specific order
        let order = null;
        
        if (isConnected && Order) {
          try {
            order = await Order.findOne({ order_id: orderId });
            console.log("✅ Order retrieved from MongoDB");
          } catch (mongoError) {
            console.log("⚠️ MongoDB query failed, using in-memory storage");
            order = inMemoryOrders.find(o => o.order_id === orderId);
          }
        } else {
          order = inMemoryOrders.find(o => o.order_id === orderId);
          console.log("✅ Order retrieved from in-memory storage");
        }
        
        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Order not found'
          });
        }
        
        return res.status(200).json({
          success: true,
          order: order
        });
      } else {
        // Get all orders
        let orders = [];
        
        if (isConnected && Order) {
          try {
            orders = await Order.find().sort({ created_at: -1 });
            console.log("✅ Orders retrieved from MongoDB");
          } catch (mongoError) {
            console.log("⚠️ MongoDB query failed, using in-memory storage");
            orders = [...inMemoryOrders].sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
          }
        } else {
          orders = [...inMemoryOrders].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          console.log("✅ Orders retrieved from in-memory storage");
        }
        
        return res.status(200).json({
          success: true,
          count: orders.length,
          orders: orders
        });
      }
    } 
    
    else if (req.method === 'POST') {
      // Create new order
      const orderData = req.body;
      
      // Generate order_id if not provided
      if (!orderData.order_id) {
        orderData.order_id = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
      
      console.log("📝 Creating order with ID:", orderData.order_id);
      
      let order;
      
      if (isConnected && Order) {
        try {
          order = await Order.create(orderData);
          console.log("✅ Order saved to MongoDB successfully");
        } catch (mongoError) {
          console.log("⚠️ MongoDB save failed, using in-memory storage");
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
      } else {
        // Use in-memory storage
        order = {
          ...orderData,
          _id: uuidv4(),
          created_at: new Date(),
          updated_at: new Date()
        };
        inMemoryOrders.push(order);
        console.log("✅ Order saved to in-memory storage");
      }
      
      return res.status(201).json({
        success: true,
        order
      });
    } 
    
    else if (req.method === 'PATCH') {
      // Update order status
      const { orderId } = req.query;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      let result = null;
      
      if (isConnected && Order) {
        try {
          result = await Order.findOneAndUpdate(
            { order_id: orderId },
            { 
              $set: { 
                status: status,
                updated_at: new Date()
              } 
            },
            { new: true }
          );
          console.log("✅ Order updated in MongoDB");
        } catch (mongoError) {
          console.log("⚠️ MongoDB update failed, using in-memory storage");
          // Fallback to in-memory storage
          const orderIndex = inMemoryOrders.findIndex(o => o.order_id === orderId);
          if (orderIndex !== -1) {
            inMemoryOrders[orderIndex].status = status;
            inMemoryOrders[orderIndex].updated_at = new Date();
            result = inMemoryOrders[orderIndex];
          }
        }
      } else {
        // Use in-memory storage
        const orderIndex = inMemoryOrders.findIndex(o => o.order_id === orderId);
        if (orderIndex !== -1) {
          inMemoryOrders[orderIndex].status = status;
          inMemoryOrders[orderIndex].updated_at = new Date();
          result = inMemoryOrders[orderIndex];
          console.log("✅ Order updated in in-memory storage");
        }
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: `Order with ID ${orderId} not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order: result
      });
    } 
    
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error'
    });
  }
}
