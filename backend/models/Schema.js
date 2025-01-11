const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  callTranscript: {
    type: String,
    required: true,
  },
  sentimentScore: {
    type: Number,
    default: 0,
  },
  escalated: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interaction", interactionSchema);
