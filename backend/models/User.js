const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["curator"],
      default: "curator",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastHeartbeat: {
      type: Date,
      default: Date.now,
    },
    heartbeatMissedCount: {
      type: Number,
      default: 0,
    },
    heartbeatIntervalDays: {
      type: Number,
      default: 30,
    },
    preferredHeartbeatChannel: {
      type: String,
      enum: ["email", "whatsapp"],
      default: "email",
    },
    heartbeatContact: {
      type: String,
    },
    nextHeartbeat: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
