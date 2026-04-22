const mongoose = require('mongoose');

// Bypassing SRV and connecting to shards directly
const uri = "mongodb://kumodyathamadi_db_user:CayI2evDLuVuklqM@ac-aakuny8-shard-00-00.h2jrgi7.mongodb.net:27017,ac-aakuny8-shard-00-01.h2jrgi7.mongodb.net:27017,ac-aakuny8-shard-00-02.h2jrgi7.mongodb.net:27017/paf_uni_project?ssl=true&authSource=admin&retryWrites=true&w=majority";

console.log("Connecting directly to shards...");

mongoose.connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas (Direct Shard Method)!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
