const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.handleEngagementClick = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Engagement token is missing.");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).send("Invalid or expired engagement token.");
    }

    if (!decoded.userId || decoded.type !== "engagement") {
      return res.status(401).send("Invalid token type.");
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.lastEngagementClick = new Date();
    user.consecutiveEngagementMisses = 0;
    await user.save();

    return res.redirect(
      `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/engagement-success`
    );
  } catch (error) {
    console.error("Engagement click error:", error);
    res.status(500).send("Server error processing engagement click.");
  }
};
