const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Database connection attempt...");
    console.log("MONGO_URI is defined:", !!process.env.MONGO_URI);
    if (process.env.MONGO_URI) {
      console.log("MONGO_URI starts with:", process.env.MONGO_URI.substring(0, 25));
    } else {
      console.log("MONGO_URI is NOT defined, falling back to local MongoDB.");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/jewellery");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
