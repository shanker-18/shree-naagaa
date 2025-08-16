import mongoose from 'mongoose';

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

const Order = mongoose.model('Order', orderSchema);

export default Order;
