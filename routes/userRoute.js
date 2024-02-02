const express = require("express");
const router = express.Router();

const { signup, signin, getProfile, changePassword } = require("../controllers/userController");
const Authentication = require("../middleware/authMiddleware");


router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile",Authentication ,getProfile);
router.patch("/change-password",Authentication , changePassword);

module.exports = router;