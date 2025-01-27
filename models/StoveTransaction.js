const mongoose = require("mongoose");

const stoveTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  stoveSerialNo: {
    type: String,
    required: true,
  },
  salesDate: {
    type: Date,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  endUserName: {
    type: String,
    required: true,
  },
  aka: String,
  state: {
    type: String,
    required: true,
  },
  lga: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  otherPhone: String,
  partnerName: String,
  amount: Number,
  signature: String, // Assuming you store the signature as a base64 string
  stoveImage: {
    public_id: String,
    url: String,
  },
  agreementImage: {
    public_id: String,
    url: String,
  },
});

module.exports = mongoose.model("stove-transaction", stoveTransactionSchema); 