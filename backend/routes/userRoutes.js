const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { validateProfileUpdate } = require("../middleware/validator");

router.put(
  "/profile",
  protect,
  validateProfileUpdate,
  userController.updateProfile
);

module.exports = router;
