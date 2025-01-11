// Load evironment variables at the start 
require("dotenv").config();

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const callRoutes = require("./routes/callRoutes");
const { Server } = require("socket.io");

// Import utilities
const audioToText = require("./utils/audioToText");
const processTextWithGemini = require("./utils/processText");
const textToAudio = require("./utils/textToAudio");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Routes
app.get("/", (req, res) => {
  res.send("BPO Automation Backend");
});
app.use("/api/call", callRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
