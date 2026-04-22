const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { protect, admin } = require('../middleware/auth');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { resourceId, category, priority, description, images } = req.body;
    
    const ticket = await Ticket.create({
      userId: req.user.id,
      resourceId,
      category,
      priority,
      description,
      images
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get current user tickets
// @route   GET /api/tickets/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate('resourceId', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all tickets (Admin only)
// @route   GET /api/tickets
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate('userId', 'name email')
      .populate('resourceId', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update ticket status/reply
// @route   PATCH /api/tickets/:id
// @access  Private/Admin
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      if (status) ticket.status = status;
      if (adminReply) ticket.adminReply = adminReply;
      
      const updatedTicket = await ticket.save();
      res.json(updatedTicket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
