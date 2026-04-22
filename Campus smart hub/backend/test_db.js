const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Node.js 18+ DNS issues with Atlas SRV
dns.setDefaultResultOrder('ipv4first');

const uri = "mongodb+srv://kumodyathamadi_db_user:CayI2evDLuVuklqM@cluster0.h2jrgi7.mongodb.net/paf_uni_project?retryWrites=true&w=majority";

console.log("Connecting to:", uri);

mongoose.connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
