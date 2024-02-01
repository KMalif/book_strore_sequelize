const express = require("express");
const router = express.Router();
const { getBook, getBookID, createBook, editBook } = require("../controllers/bookController");

router.get("/", getBook);
router.get("/:id", getBookID);
router.post("/create", createBook);
router.put("/edit/:id", editBook);

module.exports = router;
