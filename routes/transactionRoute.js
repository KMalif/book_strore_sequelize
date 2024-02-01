const express = require("express");
const router = express.Router();
const { getTransaction, createTransaction, getTransactionID, deleteTransaction } = require("../controllers/transactionController");

router.get("/", getTransaction);
router.get("/:id", getTransactionID);
router.post("/create", createTransaction);
router.delete("/delete/:id", deleteTransaction);

module.exports = router;
