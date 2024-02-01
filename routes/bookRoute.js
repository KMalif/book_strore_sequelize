const express = require("express");
const router = express.Router();
const { getBook, getBookID, createBook, editBook } = require("../controllers/bookController");

router.get("/", getBook);
router.get("/:id", getBookID);
router.post("/", createBook);
router.put("/:id", editBook);

module.exports = router;
