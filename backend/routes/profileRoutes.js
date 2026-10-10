const express = require("express");
const auth = require("../middleware/authMiddleware");
const { createProfile } = require("../controllers/authController");
const router = express.Router();
router.post("/create", auth, createProfile);
module.exports = router;
