const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['HARDWARE', 'SOFTWARE', 'FACILITIES', 'OTHER'], required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }],
  ticketNotes: [{
    body: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  building: { type: String },
  lab: { type: String },
  room: { type: String },
  resolutionNotes: { type: String },
  workLog: [{
    timestamp: { type: Date, default: Date.now },
    action: { type: String },
    note: { type: String },
    user: { type: String }
  }],
  comments: [commentSchema],
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
