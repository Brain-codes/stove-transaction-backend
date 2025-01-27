const express = require("express");
const {
  getAllTransactions,
  createService,
  updateService,
  deleteService,
  createTransaction,
} = require("../controllers/transactionControllers");
const protect = require("../middlewares/authMiddleware");
const upload = require("../config/multerConfig");
const router = express.Router();

router.get("/", getAllTransactions);
// router.post("/", protect("admin"), createService);
// router.put("/:id", protect("admin"), updateService);
// router.delete("/:id", protect("admin"), deleteService);
router.post("/", upload.fields([{ name: 'stoveImage' }, { name: 'agreementImage' }]), createTransaction);

module.exports = router;
