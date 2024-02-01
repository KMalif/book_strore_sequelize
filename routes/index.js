const express = require("express");
const transactionRoute = require("./transactionRoute");
const genreRoute = require("./genreRoute");
const bookRoute = require("./bookRoute");

// const taskRoute = require("./taskRoute");
const router = express.Router();

router.use("/transaction", transactionRoute);
router.use("/genre", genreRoute);
router.use("/book", bookRoute);

module.exports = router;
