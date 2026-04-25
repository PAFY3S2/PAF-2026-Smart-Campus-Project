const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const email = 'admin@SLIIT.com';
    const password = 'Admin@SLIIT';

    // Remove existing admin if any to ensure clean state
    await User.deleteMany({ role: 'ADMIN' });
    
    // Create new admin
    const admin = new User({
      name: 'System Administrator',
      email: email,
      password: password,
      role: 'ADMIN',
      avatar: 'https://ui-avatars.com/api/?name=Admin&bg=rose&color=fff'
    });

    await admin.save();
    console.log(`Admin account created: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:');
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        console.error(`${key}: ${err.errors[key].message}`);
      });
    } else {
      console.error(err.stack || err);
    }
    process.exit(1);
  }
};

createAdmin();
