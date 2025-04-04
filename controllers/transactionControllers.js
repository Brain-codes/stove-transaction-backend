const cloudinary = require('../config/cloudinaryConfig');
const Image = require('../models/Image');
const StoveTransaction = require("../models/StoveTransaction");
const formatResponse = require("../utils/formatResponse");


exports.getAllTransactions = async (req, res) => {
  try {
    const Transactions = await StoveTransaction.find();
    res
      .status(200)
      .json(formatResponse(200, "Transaction retrieved successfully", Transactions));
  } catch (error) {
    res.status(500).json(formatResponse(500, "Error retrieving transactions"));
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { stoveImage, agreementImage, ...transactionData } = req.body;

    // Validate that both stoveImage and agreementImage are provided
    if (!stoveImage || !agreementImage) {
      return res
        .status(400)
        .json(
          formatResponse(400, "Both stove and agreement images are required")
        );
    }

    // Create new transaction with image references
    const newTransaction = new StoveTransaction({
      ...transactionData,
      stoveImage: {
        public_id: stoveImage.public_id,
        url: stoveImage.url,
      },
      agreementImage: {
        public_id: agreementImage.public_id,
        url: agreementImage.url,
      },
    });

    await newTransaction.save();

    res
      .status(201)
      .json(
        formatResponse(201, "Transaction created successfully", newTransaction)
      );
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(500, "Error creating transaction", error));
  }
};

// exports.createTransaction = async (req, res) => {
//   try {
//     const { stoveImage, agreementImage, ...transactionData } = req.body;

//     // Validate that both stoveImage and agreementImage are provided
//     if (!stoveImage || !agreementImage) {
//       return res.status(400).json(formatResponse(400, "Both stove and agreement images are required"));
//     }

//     // Create new transaction with image references
//     const newTransaction = new StoveTransaction({
//       ...transactionData,
//       stoveImage: {
//         public_id: stoveImage.public_id,
//         url: stoveImage.url,
//       },
//       agreementImage: {
//         public_id: agreementImage.public_id,
//         url: agreementImage.url,
//       },
//     });

//     await newTransaction.save();

//     res.status(201).json(formatResponse(201, "Transaction created successfully", newTransaction));
//   } catch (error) {
//     res.status(500).json(formatResponse(500, "Error creating transaction", error));
//   }
// };