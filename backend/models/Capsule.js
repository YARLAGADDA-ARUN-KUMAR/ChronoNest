const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  email: { type: String },
  whatsapp: { type: String },
});

const capsuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    videos: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipients: [recipientSchema],
    triggerType: { type: String, enum: ["date", "butterfly"], required: true },
    triggerDate: { type: Date, required: true },
    isReleased: { type: Boolean, default: false },
    releaseDate: Date,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Capsule", capsuleSchema);
