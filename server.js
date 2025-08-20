import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ordersRouter from './routes/orders.js';

// Load environment variables from .env file
dotenv.config();

// MongoDB Connection with fallback
let mongoConnected = false;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sample_mflix';

console.log("🔍 Connecting to MongoDB...");
console.log("Database URI:", mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs

// Set connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
};

mongoose.connect(mongoUri, mongooseOptions)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Database: sample_mflix");
    console.log("📋 Collection: orders");
    mongoConnected = true;
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("💡 To fix this error:");
    console.log("   1. Install MongoDB locally or use MongoDB Atlas");
    console.log("   2. Make sure MongoDB service is running on your system");
    console.log("   3. For Windows: Download MongoDB Community Server from https://www.mongodb.com/try/download/community");
    console.log("   4. After installation, start MongoDB service");
    console.log("⚠️  MongoDB not available, using in-memory storage");
    mongoConnected = false;
  });

// Export mongoConnected status for use in routes
export { mongoConnected };

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
