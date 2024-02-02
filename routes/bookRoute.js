const express = require("express");
const router = express.Router();
const { getBook, getBookID, createBook, editBook } = require("../controllers/bookController");
const Authentication = require("../middleware/authMiddleware");

router.get("/", getBook);
router.get("/:id", getBookID);
router.post("/", Authentication, createBook);
router.put("/:id", Authentication, editBook);

module.exports = router;
