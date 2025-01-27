// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const formatResponse = require("./utils/formatResponse");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
// Apply JSON parsing middleware only for POST, PUT, DELETE requests
app.use((req, res, next) => {
  if (["POST", "PUT"].includes(req.method) && !req.is("multipart/form-data")) {
    express.json()(req, res, (err) => {
      if (err)
        return res.status(400).json(formatResponse(400, "Invalid JSON format"));

      if (!Object.keys(req.body).length) {
        return res
          .status(400)
          .json(formatResponse(400, "Request body cannot be empty"));
      }

      next();
    });
  } else {
    next(); // Proceed without JSON parsing for other methods or multipart requests
  }
});

// Enable CORS
app.use(cors());

// Root route
app.get("/", (req, res) => res.send("Welcome to the Backend"));

app.post("/images", (req, res) => res.send("Welcome to the images"));

// Import routes
const transactionRoutes = require("./routes/transactionRoutes");
const imageRoutes = require("./routes/imageRoutes");
app.use("/api/transactions", transactionRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
