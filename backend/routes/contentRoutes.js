const express = require("express");
const { getFeed, searchContent } = require("../controllers/contentController");

const router = express.Router();

router.get("/feed", getFeed);
router.get("/search", searchContent);

module.exports = router;
