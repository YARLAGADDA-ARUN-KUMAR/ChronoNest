const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const connectDB = asyncHandler(async () => {
  const conn = await mongoose.connect(process.env.DB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
});

module.exports = connectDB;
