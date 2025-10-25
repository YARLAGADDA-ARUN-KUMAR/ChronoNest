const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/signup", upload.single("profile"), authController.signup);
router.post("/login", authController.login);

module.exports = router;
