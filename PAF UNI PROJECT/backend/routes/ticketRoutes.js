const { auth, checkRole } = require('../middleware/auth');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const Ticket = require('../models/Ticket');
const express = require('express');
const router = express.Router();

// Get all tickets (Admin/Technician)
router.get('/', auth, checkRole(['ADMIN', 'TECHNICIAN']), async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('resourceId').populate('userId', 'name email').populate('technicianId', 'name');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user tickets
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId }).populate('resourceId');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create ticket
router.post('/', auth, async (req, res) => {
  const ticket = new Ticket({
    ...req.body,
    userId: req.user.id
  });
  try {
    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get ticket details by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('technicianId', 'name email')
      .populate('resourceId');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Access control: Admin, Assigned Technician, or Submitter
    const isAdmin = req.user.role === 'ADMIN';
    const isTechnician = req.user.role === 'TECHNICIAN';
    const isOwner = ticket.userId._id.toString() === req.user.id.toString();
    const isAssigned = ticket.technicianId && ticket.technicianId._id.toString() === req.user.id.toString();

    if (!isAdmin && !isTechnician && !isOwner && !isAssigned) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update ticket status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Access control
    if (req.user.role !== 'ADMIN' && ticket.technicianId?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add note to ticket
router.post('/:id/notes', auth, checkRole(['TECHNICIAN', 'ADMIN']), async (req, res) => {
  try {
    const { note } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (req.user.role !== 'ADMIN' && ticket.technicianId?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    ticket.ticketNotes.push({
      body: note,
      authorId: req.user.id,
      createdAt: new Date()
    });
    
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Comment CRUD
router.get('/:id/comments', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.id })
      .populate('authorId', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { body } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const comment = new Comment({
      ticketId: req.params.id,
      authorId: req.user.id,
      authorRole: req.user.role,
      body
    });

    await comment.save();

    // Trigger Notification
    if (req.user.role === 'USER') {
      // Notify assigned technician
      if (ticket.technicianId) {
        await new Notification({
          userId: ticket.technicianId,
          type: 'TICKET_UPDATE',
          message: `New student comment on ticket: ${ticket.description.substring(0, 30)}...`,
          ticketId: ticket._id // I should check if Notification model supports ticketId
        }).save();
      }
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.authorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.body = req.body.body;
    comment.isEdited = true;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.authorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/tickets/:id/evidence
// @desc    Get evidence images for a ticket
router.get('/:id/evidence', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).select('images');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket.images || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/tickets/:id/messages
// @desc    Send a message (communication thread)
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { content, senderType } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Use existing comments array for the thread
    ticket.comments.push({
      text: content,
      author: req.user.name,
      senderType: senderType || (req.user.role === 'TECHNICIAN' ? 'technician' : 'user')
    });

    await ticket.save();
    res.json(ticket.comments[ticket.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/tickets/:id/notes
// @desc    Add internal technician note
router.post('/:id/notes', auth, checkRole(['TECHNICIAN', 'ADMIN']), async (req, res) => {
  try {
    const { content } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.ticketNotes.push({
      body: content,
      authorId: req.user.id
    });

    await ticket.save();
    res.json(ticket.ticketNotes[ticket.ticketNotes.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
