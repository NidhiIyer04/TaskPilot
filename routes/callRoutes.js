const express = require("express");
const router = express.Router();
const { handleCall } = require("../controllers/callController");

// Route for handling calls
router.post("/handle", handleCall);

module.exports = router;
