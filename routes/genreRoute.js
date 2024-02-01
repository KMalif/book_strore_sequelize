const express = require("express");
const router = express.Router();
const { getGenre, postGenre } = require("../controllers/genreController");

router.get("/", getGenre);
router.post("/", postGenre);

module.exports = router;
