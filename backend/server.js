// Load evironment variables at the start 
require("dotenv").config();

const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const express = require("express");
const http = require("http");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const callRoutes = require("./routes/callRoutes");
const { Server } = require("socket.io");
const path = require("path");

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MongoDB Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error sad:", err));


// Routes
// Default Route
app.get("/", (req, res) => {
  res.send("TaskPilot AI Voice Assistant Backend");
});


app.use("/api", callRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
