const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getPlans, checkout } = require("../controllers/billingController");

const router = express.Router();

router.get("/plans", getPlans);
router.post("/checkout", authMiddleware, checkout);

module.exports = router;
