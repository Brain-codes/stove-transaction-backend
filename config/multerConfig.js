const multer = require("multer");

// Set up multer storage
const storage = multer.memoryStorage(); // Store files in memory for further processing

// Create the multer instance
const upload = multer({ storage });

module.exports = upload;
