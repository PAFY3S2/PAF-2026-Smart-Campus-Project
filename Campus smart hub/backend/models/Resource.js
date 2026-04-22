const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['ROOM', 'LAB', 'EQUIPMENT'], required: true },
  capacity: { type: Number },
  location: { type: String },
  status: { type: String, enum: ['ACTIVE', 'OUT_OF_SERVICE', 'MAINTENANCE'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
