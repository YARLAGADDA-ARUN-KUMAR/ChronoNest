const Capsule = require("../models/Capsule");

exports.createCapsule = async (req, res) => {
  try {
    const { title, description, triggerType, triggerDate, videos } = req.body;

    if (
      triggerType === "date" &&
      (!triggerDate || isNaN(new Date(triggerDate).getTime()))
    ) {
      return res
        .status(400)
        .json({
          message: "Valid trigger date is required for date-based capsules.",
        });
    }

    let recipientsArr = [];
    if (req.body.recipients) {
      try {
        const rawRecipients =
          typeof req.body.recipients === "string"
            ? JSON.parse(req.body.recipients)
            : req.body.recipients;

        recipientsArr = Array.isArray(rawRecipients)
          ? rawRecipients
          : [rawRecipients];

        recipientsArr = recipientsArr
          .map((recipient) => {
            if (typeof recipient === "string")
              recipient = JSON.parse(recipient);
            if (recipient.type && recipient.value) {
              return recipient.type === "email"
                ? { email: recipient.value }
                : { whatsapp: recipient.value };
            }
            return recipient;
          })
          .filter(
            (recipient) => recipient && (recipient.email || recipient.whatsapp)
          );
      } catch (err) {
        recipientsArr = [];
      }
    }

    if (
      !title ||
      !description ||
      recipientsArr.length === 0 ||
      !triggerType ||
      !triggerDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(
        (file) =>
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      );
    }

    const videosArr = Array.isArray(videos) ? videos : [videos].filter(Boolean);

    const capsule = await Capsule.create({
      title,
      description,
      recipients: recipientsArr,
      images: imageUrls,
      videos: videosArr,
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

exports.getCapsuleById = async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);
    if (!capsule) return res.status(404).json({ message: "Capsule not found" });
    res.json({ capsule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching capsule", error: error.message });
  }
};

exports.updateCapsule = async (req, res) => {
  try {
    const { id } = req.params;
    const capsule = await Capsule.findOne({ _id: id, createdBy: req.userId });
    if (!capsule) return res.status(404).json({ message: "Capsule not found" });

    if (
      req.body.triggerType === "date" &&
      (!req.body.triggerDate || isNaN(new Date(req.body.triggerDate).getTime()))
    ) {
      return res
        .status(400)
        .json({
          message: "Valid trigger date is required for date-based capsules.",
        });
    }

    let recipientsArr = [];
    if (req.body.recipients) {
      try {
        recipientsArr = JSON.parse(req.body.recipients);
        recipientsArr = recipientsArr
          .map((recipient) => {
            if (recipient.type && recipient.value) {
              return recipient.type === "email"
                ? { email: recipient.value }
                : { whatsapp: recipient.value };
            }
            return recipient;
          })
          .filter(
            (recipient) => recipient && (recipient.email || recipient.whatsapp)
          );
      } catch (e) {
        recipientsArr = [];
      }
    }

    let imageUrls = capsule.images;
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(
        (file) =>
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      );
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    const videosArr = req.body.videos
      ? Array.isArray(req.body.videos)
        ? req.body.videos
        : [req.body.videos].filter(Boolean)
      : capsule.videos;

    capsule.title = req.body.title ?? capsule.title;
    capsule.description = req.body.description ?? capsule.description;
    capsule.images = imageUrls;
    capsule.videos = videosArr;
    capsule.triggerType = req.body.triggerType ?? capsule.triggerType;
    capsule.triggerDate = req.body.triggerDate ?? capsule.triggerDate;
    capsule.recipients = recipientsArr.length
      ? recipientsArr
      : capsule.recipients;

    await capsule.save();
    res.json({ message: "Capsule updated!", capsule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update capsule", error: error.message });
  }
};

exports.deleteCapsule = async (req, res) => {
  try {
    const { id } = req.params;
    const capsule = await Capsule.findOneAndDelete({
      _id: id,
      createdBy: req.userId,
    });
    if (!capsule) return res.status(404).json({ message: "Capsule not found" });
    res.json({ message: "Capsule deleted!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete capsule", error: error.message });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const allCapsules = await Capsule.find({ createdBy: req.userId }).sort({
      triggerDate: 1,
    });
    const count = allCapsules.length;
    const released = allCapsules.filter((c) => c.isReleased).length;
    const pending = count - released;
    const now = new Date();
    const upcoming = allCapsules.find(
      (c) => new Date(c.triggerDate) > now && !c.isReleased
    );
    res.json({
      count,
      released,
      pending,
      nextRelease: upcoming
        ? {
            id: upcoming._id,
            title: upcoming.title,
            triggerDate: upcoming.triggerDate,
          }
        : null,
      recent: allCapsules.slice(-3).reverse(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Dashboard fetch failed", error: error.message });
  }
};
