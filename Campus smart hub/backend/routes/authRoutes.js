const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Simple login for demo purposes
router.post('/login', async (req, res) => {
  const { role } = req.body;
  
  try {
    // Find or create a demo user for the given role
    let user = await User.findOne({ role });
    
    if (!user) {
      // Create seed users if they don't exist
      const demoUsers = {
        'USER': { name: 'Student Dan', email: 'dan@example.com', password: 'password123', avatar: 'https://ui-avatars.com/api/?name=Student+Dan&bg=indigo&color=fff' },
        'ADMIN': { name: 'Admin Alice', email: 'alice@example.com', password: 'password123', avatar: 'https://ui-avatars.com/api/?name=Admin+Alice&bg=rose&color=fff' },
        'TECHNICIAN': { name: 'Tech Bob', email: 'bob@example.com', password: 'password123', avatar: 'https://ui-avatars.com/api/?name=Tech+Bob&bg=emerald&color=fff' }
      };
      
      const userData = demoUsers[role] || demoUsers['USER'];
      user = new User({ ...userData, role });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        avatar: user.avatar,
        studentId: user.studentId,
        faculty: user.faculty,
        contactNumber: user.contactNumber,
        batch: user.batch
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const { protect, admin } = require('../middleware/auth');

// @route   PUT /api/auth/me
// @route   Update current user profile
router.put('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, studentId, faculty, contactNumber, batch, avatar } = req.body;
    
    if (name)          user.name          = name;
    if (email)         user.email         = email;
    if (studentId)     user.studentId     = studentId;
    if (faculty)       user.faculty       = faculty;
    if (contactNumber) user.contactNumber = contactNumber;
    if (batch)         user.batch         = batch;
    if (avatar)        user.avatar        = avatar;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      studentId: user.studentId,
      faculty: user.faculty,
      contactNumber: user.contactNumber,
      batch: user.batch
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/users/:id
// @desc    Get specific user (Admin only)
router.get('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
