const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    
    const user = await User.findOne({ email: 'IT23331136@my.sliit.lk' }); // Adjust if needed
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Original User:', user.name);
    
    const updates = { name: user.name + ' Test' };
    const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true, runValidators: true });
    console.log('Updated User:', updatedUser.name);
    
    // Test with array
    const updates2 = { expertise: ['Test'] };
    const updatedUser2 = await User.findByIdAndUpdate(user._id, updates2, { new: true, runValidators: true });
    console.log('Updated Expertise:', updatedUser2.expertise);

    process.exit(0);
  } catch (err) {
    console.error('Test Error:', err);
    process.exit(1);
  }
}

test();
