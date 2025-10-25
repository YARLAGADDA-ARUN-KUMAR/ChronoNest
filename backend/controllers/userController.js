const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const {
      name,
      password,
      heartbeatIntervalDays,
      preferredHeartbeatChannel,
      heartbeatContact,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name) user.name = name;
    if (heartbeatIntervalDays)
      user.heartbeatIntervalDays = heartbeatIntervalDays;
    if (preferredHeartbeatChannel)
      user.preferredHeartbeatChannel = preferredHeartbeatChannel;
    if (heartbeatContact) user.heartbeatContact = heartbeatContact;

    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long." });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        heartbeatIntervalDays: user.heartbeatIntervalDays,
        preferredHeartbeatChannel: user.preferredHeartbeatChannel,
        heartbeatContact: user.heartbeatContact,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res
      .status(500)
      .json({ message: "Failed to update profile.", error: error.message });
  }
};
