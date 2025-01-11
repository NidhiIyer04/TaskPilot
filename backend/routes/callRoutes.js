// routes/callRoutes.js
const express = require("express");
const { handleCall } = require("../controllers/callController");

const router = express.Router();

// Route to handle incoming calls
router.post("/handle", handleCall);

module.exports = router;
