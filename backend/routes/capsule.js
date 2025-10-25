const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const capsuleController = require("../controllers/capsuleController");
const auth = require("../middleware/auth");

router.get("/mine", auth, capsuleController.getMyCapsules);
router.get("/:id", auth, capsuleController.getCapsuleById);

router.post(
  "/",
  auth,
  upload.array("images", 10),
  capsuleController.createCapsule
);
router.put(
  "/:id",
  auth,
  upload.array("images", 10),
  capsuleController.updateCapsule
);

router.delete("/:id", auth, capsuleController.deleteCapsule);
router.get("/dashboard/summary", auth, capsuleController.getDashboardSummary);

module.exports = router;
