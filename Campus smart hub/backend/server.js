require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// Fix for Node.js 18+ DNS issues with MongoDB Atlas on some networks
dns.setDefaultResultOrder('ipv4first');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);

// MongoDB Connection with robust options
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000, // Timeout after 15s instead of 30s
      socketTimeoutMS: 45000,        // Close sockets after 45s of inactivity
    });
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('TIP: Check your IP Whitelist in MongoDB Atlas.');
    }
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
