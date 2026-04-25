const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['ROOM', 'LAB', 'EQUIPMENT'], required: true },
  capacity: { type: Number },
  location: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'OUT_OF_SERVICE', 'MAINTENANCE'], default: 'ACTIVE' },
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

module.exports = mongoose.model('Resource', resourceSchema);
