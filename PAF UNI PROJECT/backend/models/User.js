const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN', 'TECHNICIAN'], default: 'USER' },
  avatar: { type: String },
  phoneNumber: { type: String },
  department: { type: String },
  expertise: [{ type: String }],
  workLocations: [{ type: String }],
  availability: { type: Boolean, default: true },
  workingHours: { type: String },
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const crypto = require('crypto');

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString('hex');
  this.password = `${salt}:${hash}`;
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  const [salt, hash] = this.password.split(':');
  const candidateHash = crypto.pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512').toString('hex');
  return hash === candidateHash;
};

module.exports = mongoose.model('User', userSchema);
