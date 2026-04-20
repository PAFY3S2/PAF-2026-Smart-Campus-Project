const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnect = async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connection Successful!');
    process.exit(0);
  } catch (err) {
    console.error('Connection Failed:', err);
    process.exit(1);
  }
};

testConnect();
