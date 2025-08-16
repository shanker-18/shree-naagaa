import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ordersRouter from './routes/orders.js';

// Load environment variables from .env file
dotenv.config();

// MongoDB Connection with fallback
let mongoConnected = false;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shreeraga';

console.log("🔍 Connecting to MongoDB...");
console.log("Database URI:", mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs

mongoose.connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Database: shreeraga");
    console.log("📋 Collection: orders");
    mongoConnected = true;
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Using in-memory storage as fallback");
    mongoConnected = false;
  });

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Log environment status
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Use the orders router
app.use('/api/orders', ordersRouter);

// Add a test route
app.get('/', (req, res) => {
  res.send('ShreeRaagaSWAADGHAR API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api/orders`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});
