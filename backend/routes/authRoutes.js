const express = require("express");
const { register, login, getCurrentUser, createProfile, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/profiles", authMiddleware, createProfile);
router.post("/logout", logout);
module.exports = router;
