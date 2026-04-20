const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  category: {
    type: String,
    enum: ['HARDWARE', 'SOFTWARE', 'FACILITIES', 'OTHER'],
    required: true
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  images: {
    type: [String],
    default: []
  },
  adminReply: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
