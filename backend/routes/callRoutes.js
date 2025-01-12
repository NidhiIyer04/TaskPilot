// routes/callRoutes.js
const express = require("express");
const multer = require("multer");
const { handleAudioProcessing } = require("../controllers/callController");

const router = express.Router();

// ✅ Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Route to process audio
router.post("/process-audio", upload.single("audio"), handleAudioProcessing);

module.exports = router;
