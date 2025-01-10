// Load evironment variables at the start 
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const callRoutes = require("./routes/callRoutes");

// Initialize Express app
const app = express();

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
