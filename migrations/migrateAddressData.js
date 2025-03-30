// migrations/migrateAddressData.js
const mongoose = require("mongoose");
const StoveTransaction = require("../models/StoveTransaction");
require("dotenv").config();

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 90000,
    });

    // Temporarily disable validation
    StoveTransaction.schema.set("validateBeforeSave", false);

    // Get all existing transactions
    const transactions = await StoveTransaction.find({});

    for (const transaction of transactions) {
      // Create new addressData object with default values
      const addressData = {
        fullAddress: transaction.address || "Not provided",
        street: "Not provided",
        city: "Not provided",
        state: transaction.state || "Not provided",
        country: "Nigeria",
        latitude: 0,
        longitude: 0,
      };

      // Update the transaction with new addressData
      transaction.addressData = addressData;

      // Remove old fields
      transaction.address = undefined;
      transaction.state = undefined;

      // Save the updated transaction
      await transaction.save();
    }

    // Re-enable validation
    StoveTransaction.schema.set("validateBeforeSave", true);

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateData();
