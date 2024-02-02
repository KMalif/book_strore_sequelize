const express = require("express");
const router = express.Router();
const { getGenre, postGenre } = require("../controllers/genreController");
const Authentication = require("../middleware/authMiddleware");

router.get("/", getGenre);
router.post("/", Authentication, postGenre);

module.exports = router;
