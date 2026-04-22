const express = require('express');
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Helper to check for overlapping bookings
const checkConflicts = async (resourceId, date, startTime, endTime, excludeId = null) => {
  const query = {
    resourceId,
    date,
    status: { $in: ['APPROVED', 'PENDING'] }, // Both pending and approved block the slot
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingBookings = await Booking.find(query);

  // Check for time overlaps
  // (StartA < EndB) && (EndA > StartB)
  const conflicts = existingBookings.filter(b => {
    return (startTime < b.endTime) && (endTime > b.startTime);
  });

  return conflicts.length > 0;
};

// @route   GET /api/bookings/me
// @desc    Get logged in user's bookings
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('resourceId', 'name type')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/user/:userId
// @desc    Get specific user's bookings (Admin only)
// @access  Private/Admin
router.get('/user/:userId', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('resourceId', 'name type')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('resourceId', 'name type')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking request
// @access  Private
router.post('/', protect, async (req, res) => {
  const { resourceId, date, startTime, endTime, purpose, attendees } = req.body;

  try {
    // 1. Basic Validation
    if (startTime >= endTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // 2. Conflict Checking
    const isConflicted = await checkConflicts(resourceId, date, startTime, endTime);
    if (isConflicted) {
      return res.status(409).json({ 
        message: 'Conflict Detected: This resource is already requested or booked for this time period.',
        error: 'CONFLICT'
      });
    }

    // 3. Create Booking
    const newBooking = new Booking({
      resourceId,
      userId: req.user.id,
      date,
      startTime,
      endTime,
      purpose,
      attendees
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status (Admin Review or User Cancel)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { status, adminReason } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Authorization Check
    // 1. User can only CANCEL their own pending/approved bookings
    // 2. Admin can APPROVE/REJECT any booking
    
    if (status === 'CANCELLED') {
      if (booking.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
    } else if (['APPROVED', 'REJECTED'].includes(status)) {
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only admins can approve or reject bookings' });
      }
      
      if (status === 'REJECTED' && !adminReason) {
        return res.status(400).json({ message: 'Reason is required for rejection' });
      }
    }

    // Double-check conflicts before final approval
    if (status === 'APPROVED') {
      const isConflicted = await checkConflicts(booking.resourceId, booking.date, booking.startTime, booking.endTime, booking._id);
      if (isConflicted) {
        return res.status(409).json({ message: 'Cannot approve: Final conflict check failed. Slot is now taken.' });
      }
    }

    booking.status = status;
    if (adminReason) booking.adminReason = adminReason;
    
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
