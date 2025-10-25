const User = require("../models/User");

exports.checkIn = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: "User account is not active." });
    }

    const now = new Date();
    user.lastHeartbeat = now;
    user.heartbeatMissedCount = 0;

    const nextHeartbeat = new Date();
    nextHeartbeat.setDate(nextHeartbeat.getDate() + user.heartbeatIntervalDays);
    user.nextHeartbeat = nextHeartbeat;

    await user.save();

    res.status(200).json({
      message: "Check-in successful. Your capsules are safe.",
      nextHeartbeat: user.nextHeartbeat,
    });
  } catch (error) {
    console.error("Heartbeat check-in error:", error);
    res
      .status(500)
      .json({ message: "Failed to process check-in.", error: error.message });
  }
};
