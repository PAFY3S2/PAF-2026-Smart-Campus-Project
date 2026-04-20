const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['BOOKING_UPDATE', 'TICKET_UPDATE', 'SYSTEM'], required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
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

module.exports = mongoose.model('Notification', notificationSchema);
