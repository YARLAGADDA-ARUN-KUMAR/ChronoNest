const Capsule = require("../models/Capsule");

exports.createCapsule = async (req, res) => {
  const { title, content, recipients, triggerType, triggerDate } = req.body;
  try {
    if (!title || !content || !recipients || !triggerType || !triggerDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const capsule = await Capsule.create({
      title,
      content,
      recipients,
      createdBy: req.userId,
      triggerType,
      triggerDate,
    });

    res.status(201).json({ message: "Capsule created!", capsule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create capsule", error: error.message });
  }
};

exports.getMyCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find({ createdBy: req.userId });
    res.json({ capsules });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching capsules", error: error.message });
  }
};
