const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { requireActiveSubscription } = require("../middleware/subscriptionMiddleware");
const { streamVideo } = require("../controllers/streamController");
const { createStreamSession } = require("../controllers/streamSessionController");
const { heartbeat, getWatchState } = require("../controllers/watchController");

const router = express.Router();

router.use(authMiddleware);
router.use(requireActiveSubscription);

router.post("/session/:contentId", createStreamSession);
router.post("/heartbeat", heartbeat);
router.get("/progress/:contentId", getWatchState);
router.get("/:contentId", streamVideo);

module.exports = router;
