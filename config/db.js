// config/db.js
const dotenv = require("dotenv");

dotenv.config();


// Create config/db.js to handle the MySQL connection
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "stove_transaction_db",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("MySQL connected");
});

module.exports = connection; // Export the connection object

// config/db.js
// Create config/db.js to handle the MongoDB connection
// const mongoose = require("mongoose");
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       //   useNewUrlParser: true,
//       //   useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 90000,
//     });
//     console.log("MongoDB connected y");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error);
//     process.exit(1);
//   }
// };
// module.exports = connectDB;
