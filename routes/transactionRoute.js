const express = require("express");
const router = express.Router();
const { getTransaction, createTransaction, getTransactionID, deleteTransaction } = require("../controllers/transactionController");
const Authentication = require("../middleware/authMiddleware");

router.get("/", Authentication, getTransaction);
router.get("/:id", Authentication, getTransactionID);
router.post("/", Authentication, createTransaction);
router.delete("/:id", Authentication, deleteTransaction);

module.exports = router;
