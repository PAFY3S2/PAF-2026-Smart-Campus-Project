const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Keeping as string YYYY-MM-DD for consistency with frontend
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  purpose: { type: String, required: true },
  attendees: { type: Number },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'], default: 'PENDING' },
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(ret) {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
