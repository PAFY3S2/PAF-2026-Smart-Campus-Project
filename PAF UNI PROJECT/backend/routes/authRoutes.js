const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, png, webp) are allowed'));
  }
});

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role: 'USER', avatar });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all Technicians (Admin only)
router.get('/technicians', async (req, res) => {
  try {
    const technicians = await User.find({ role: 'TECHNICIAN' }).select('-password');
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Technician (Admin only)
router.post('/technicians', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role: 'TECHNICIAN' });
    await user.save();
    res.json({ message: 'Technician created successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// Update current user profile
router.patch('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updates = req.body;
    
    console.log('Updating user:', decoded.id, 'with:', updates);

    // Protected fields
    delete updates.password;
    delete updates.role;
    delete updates.email;

    const user = await User.findByIdAndUpdate(decoded.id, updates, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error('PATCH /me Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Upload avatar
router.post('/upload-avatar', (req, res) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

      // Build file URL - ensure it handles localhost correctly
      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(decoded.id, { avatar: avatarUrl }, { new: true }).select('-password');
      
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error('Upload Error:', err);
      res.status(500).json({ message: 'Server error during upload' });
    }
  });
});

// Update Password
router.post('/update-password', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(decoded.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

