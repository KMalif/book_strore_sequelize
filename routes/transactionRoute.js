const express = require("express");
const router = express.Router();
const { getTransaction, createTransaction, getTransactionID, deleteTransaction } = require("../controllers/transactionController");

router.get("/", getTransaction);
router.get("/:id", getTransactionID);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
