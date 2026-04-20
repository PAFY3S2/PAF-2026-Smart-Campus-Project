const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get all tickets (Admin/Technician)
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('resourceId').populate('userId', 'name email').populate('technicianId', 'name');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user tickets
router.get('/user/:userId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId }).populate('resourceId');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create ticket
router.post('/', async (req, res) => {
  const ticket = new Ticket(req.body);
  try {
    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get tickets assigned to technician
router.get('/technician/:techId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ technicianId: req.params.techId }).populate('resourceId').populate('userId', 'name email');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get technician stats
router.get('/stats/:techId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ technicianId: req.params.techId });
    const stats = {
      assigned: tickets.length,
      open: tickets.filter(t => t.status === 'OPEN').length,
      inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter(t => t.status === 'RESOLVED').length,
      highPriority: tickets.filter(t => (t.priority === 'HIGH' || t.priority === 'URGENT') && t.status !== 'RESOLVED' && t.status !== 'CLOSED').length
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add comment to ticket
router.post('/:id/comments', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    ticket.comments.push(req.body);
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update ticket status
router.patch('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add work log to ticket
router.post('/:id/worklog', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    ticket.workLog.push(req.body);
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
