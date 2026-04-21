const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { auth, checkRole } = require('../middleware/auth');

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

// @route   PUT /api/technician/profile
// @desc    Update technician profile
// @access  Private (Technician)
router.put('/profile', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const { name, email, phoneNumber, address, specialty, experienceYears, bio, expertise, department, workLocations, workingHours, availability } = req.body;
    
    const updates = {
      name,
      phoneNumber,
      address,
      specialty,
      experienceYears,
      bio,
      expertise,
      department,
      workLocations,
      workingHours,
      availability
    };

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/technician/password
// @desc    Update technician password
// @access  Private (Technician)
router.put('/password', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/technician/profile-picture
// @desc    Upload profile picture
// @access  Private (Technician)
router.post('/profile-picture', auth, checkRole(['TECHNICIAN']), upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl }, { new: true }).select('-password');
    
    res.json({ avatarUrl, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/assignments/:id/complete
// @desc    Mark assignment as complete
// @access  Private (Technician)
router.patch('/assignments/:id/complete', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (ticket.technicianId.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized to complete this assignment' });
    }

    ticket.status = 'RESOLVED';
    await ticket.save();

    res.json({ message: 'Assignment marked as complete', ticket });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/assignments/:id/notes
// @desc    Add note to assignment
// @access  Private (Technician)
router.post('/assignments/:id/notes', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const { note } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (ticket.technicianId.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized to add notes to this assignment' });
    }

    ticket.workLog.push({
        action: 'Note Added',
        notes: note,
        timestamp: new Date()
    });
    
    await ticket.save();

    res.json({ message: 'Note added successfully', ticket });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
