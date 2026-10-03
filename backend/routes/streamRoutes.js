const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { requireActiveSubscription } = require("../middleware/subscriptionMiddleware");
const { streamVideo } = require("../controllers/streamController");

const router = express.Router();

router.use(authMiddleware);
router.use(requireActiveSubscription);

router.get("/:contentId", streamVideo);

module.exports = router;
