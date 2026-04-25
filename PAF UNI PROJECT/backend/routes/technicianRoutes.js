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
// POST route to upload profile picture
router.post(
  '/profile-picture',

  auth, // Middleware: checks if user is authenticated (valid token)

  checkRole(['TECHNICIAN']), // Middleware: allows only users with TECHNICIAN role

  upload.single('avatar'), // Multer middleware: handles single file upload (field name = 'avatar')

  async (req, res) => {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
      }

      // Build a public URL for the uploaded image
      // req.protocol -> http or https
      // req.get('host') -> domain + port (e.g., localhost:5000)
      // req.file.filename -> name of uploaded file
      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      // Update the logged-in user's avatar in the database
      const user = await User.findByIdAndUpdate(
        req.user.id,                 // Get user ID from auth middleware
        { avatar: avatarUrl },       // Update avatar field
        { new: true }                // Return updated user document
      ).select('-password');         // Exclude password from returned data (security)

      // Send response back to frontend
      res.json({
        avatarUrl, // URL of uploaded image
        user       // Updated user data
      });

    } catch (err) {
      // Log error in server console
      console.error(err.message);

      // Send generic server error response
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/technician/dashboard/stats
// @desc    Get technician dashboard statistics
// @access  Private (Technician)
router.get('/dashboard/stats', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const technicianId = req.user.id;

    const [assignedCount, inProgressCount, resolvedCount, priorityCount] = await Promise.all([
      // Assigned: OPEN or IN_PROGRESS
      Ticket.countDocuments({ 
        technicianId, 
        status: { $in: ['OPEN', 'IN_PROGRESS'] } 
      }),
      // In Progress
      Ticket.countDocuments({ 
        technicianId, 
        status: 'IN_PROGRESS' 
      }),
      // Resolved Operations
      Ticket.countDocuments({ 
        technicianId, 
        status: 'RESOLVED' 
      }),
      // Priority Alerts: HIGH, URGENT, or CRITICAL and not CLOSED
      Ticket.countDocuments({ 
        technicianId, 
        priority: { $in: ['HIGH', 'URGENT', 'CRITICAL'] },
        status: { $ne: 'CLOSED' }
      })
    ]);

    res.json({
      assignedCount,
      inProgressCount,
      resolvedCount,
      priorityCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/technician/active-assignments
// @desc    Get active assignments for logged-in technician with search/filter
// @access  Private (Technician)
router.get('/active-assignments', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const { search, status, priority, from, to } = req.query;
    let query = { 
        technicianId: req.user.id,
        status: { $in: ['OPEN', 'IN_PROGRESS'] } 
    };

    // Apply Filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (from || to) {
        query.createdAt = {};
        if (from) query.createdAt.$gte = new Date(from);
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            query.createdAt.$lte = toDate;
        }
    }

    // Apply Search
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        const possibleIds = search.match(/^[0-9a-fA-F]{24}$/) ? [search] : [];
        
        query.$and = query.$and || [];
        query.$and.push({
            $or: [
                { _id: possibleIds.length > 0 ? { $in: possibleIds } : undefined },
                { description: searchRegex }
            ].filter(Boolean)
        });
    }

    const tickets = await Ticket.find(query)
    .populate('userId', 'name email text avatar')
    .sort({ createdAt: -1 });

    let filteredTickets = tickets;
    if (search && tickets.length === 0) {
         filteredTickets = await Ticket.find({ technicianId: req.user.id, status: { $in: ['OPEN', 'IN_PROGRESS'] } })
            .populate({
                path: 'userId',
                match: { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] },
                select: 'name email'
            });
         filteredTickets = filteredTickets.filter(t => t.userId !== null);
    }

    res.json(filteredTickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/technician/in-progress
// @desc    Get in-progress assignments
router.get('/in-progress', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const tickets = await Ticket.find({ 
      technicianId: req.user.id,
      status: 'IN_PROGRESS'
    })
    .populate('userId', 'name email')
    .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/technician/resolved
// @desc    Get resolved assignments
router.get('/resolved', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const tickets = await Ticket.find({ 
      technicianId: req.user.id,
      status: 'RESOLVED'
    })
    .populate('userId', 'name email')
    .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/technician/priority
// @desc    Get high/urgent priority assignments
router.get('/priority', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const tickets = await Ticket.find({ 
      technicianId: req.user.id,
      priority: { $in: ['HIGH', 'URGENT'] },
      status: { $ne: 'CLOSED' }
    })
    .populate('userId', 'name email')
    .sort({ priority: -1, createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/technician/closed
// @desc    Get closed assignments
router.get('/closed', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const tickets = await Ticket.find({ 
      technicianId: req.user.id,
      status: 'CLOSED'
    })
    .populate('userId', 'name email')
    .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/technician/tickets/:id/notes
// @desc    Add individual note to ticket (technician only)
router.post('/tickets/:id/notes', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const { note } = req.body;
    if (!note || note.length > 2000) {
        return res.status(400).json({ message: 'Note is required and must be under 2000 characters' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.technicianId.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized - you are not assigned to this ticket' });
    }

    const newNote = {
      body: note,
      authorId: req.user.id,
      createdAt: new Date()
    };

    ticket.ticketNotes.push(newNote);
    await ticket.save();

    res.status(201).json(newNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/technician/tickets/:id/notes
// @desc    Get internal notes for a ticket
router.get('/tickets/:id/notes', auth, checkRole(['TECHNICIAN']), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.technicianId.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(ticket.ticketNotes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
