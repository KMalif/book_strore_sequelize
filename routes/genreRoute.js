const express = require("express");
const router = express.Router();
const { getGenre } = require("../controllers/genreController");

router.get("/", getGenre);

module.exports = router;
