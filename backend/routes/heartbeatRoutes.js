const express = require("express");
const router = express.Router();
const heartbeatController = require("../controllers/heartbeatController");
const auth = require("../middleware/auth");

router.post("/check-in", auth, heartbeatController.checkIn);

module.exports = router;
