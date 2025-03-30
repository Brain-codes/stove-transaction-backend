const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  fullAddress: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

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
  addressData: locationSchema,
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
