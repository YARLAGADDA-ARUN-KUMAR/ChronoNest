const express = require("express");
const router = express.Router();
const engagementController = require("../controllers/engagementController");

router.get("/click", engagementController.handleEngagementClick);

module.exports = router;
