const express = require("express");
const router = express.Router();
const {
  createCapsule,
  getMyCapsules,
} = require("../controllers/capsuleController");
const auth = require("../middleware/auth");

router.post("/", auth, createCapsule);
router.get("/mine", auth, getMyCapsules);

module.exports = router;
