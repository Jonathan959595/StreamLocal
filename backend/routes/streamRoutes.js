const express = require("express");
const { streamVideo } = require("../controllers/streamController");

const router = express.Router();

router.get("/:contentId", streamVideo);

module.exports = router;
