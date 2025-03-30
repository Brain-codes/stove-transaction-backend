const db = require("../config/db");

class StoveTransaction {
  static create(transactionData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO stove_transactions (transactionId, stoveSerialNo, salesDate, contactPerson, contactPhone, endUserName, aka, state, lga, address, phone, otherPhone, partnerName, amount, signature, stoveImage, agreementImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      // Prepare values, setting optional fields to NULL if not provided
      const values = [
        transactionData.transactionId,
        transactionData.stoveSerialNo,
        transactionData.salesDate,
        transactionData.contactPerson,
        transactionData.contactPhone,
        transactionData.endUserName,
        transactionData.aka || null,  // Set to NULL if not provided
        transactionData.state,
        transactionData.lga,
        transactionData.address,
        transactionData.phone,
        transactionData.otherPhone || null,  // Set to NULL if not provided
        transactionData.partnerName || null,  // Set to NULL if not provided
        transactionData.amount || null,  // Set to NULL if not provided
        transactionData.signature || null,  // Set to NULL if not provided
        JSON.stringify(transactionData.stoveImage),
        JSON.stringify(transactionData.agreementImage),
      ];

      // Log the SQL query and the values being inserted
      console.log("Executing SQL Query:", query);
      console.log("With Values:", values);

      db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM stove_transactions`;
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = StoveTransaction;

// const mongoose = require("mongoose");

// const stoveTransactionSchema = new mongoose.Schema({
//   transactionId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   stoveSerialNo: {
//     type: String,
//     required: true,
//   },
//   salesDate: {
//     type: Date,
//     required: true,
//   },
//   contactPerson: {
//     type: String,
//     required: true,
//   },
//   contactPhone: {
//     type: String,
//     required: true,
//   },
//   endUserName: {
//     type: String,
//     required: true,
//   },
//   aka: String,
//   state: {
//     type: String,
//     required: true,
//   },
//   lga: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   otherPhone: String,
//   partnerName: String,
//   amount: Number,
//   signature: String, // Assuming you store the signature as a base64 string
//   stoveImage: {
//     public_id: String,
//     url: String,
//   },
//   agreementImage: {
//     public_id: String,
//     url: String,
//   },
// });

// module.exports = mongoose.model("stove-transaction", stoveTransactionSchema);
