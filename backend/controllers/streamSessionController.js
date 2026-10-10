const jwt = require("jsonwebtoken");
const Movie = require("../models/Movie");
const fs = require("fs");
const path = require("path");

const createStreamSession = async (req, res) => {
    const movie = await Movie.findOne({ contentId: req.params.contentId });
    if (!movie || !movie.videoPath || path.basename(movie.videoPath) !== movie.videoPath) return res.status(404).json({ message: "Video not found" });
    try { await fs.promises.access(path.resolve(__dirname, "..", "videos", movie.videoPath)); } catch { return res.status(404).json({ message: "Video not found" }); }
    const token = jwt.sign(
        { id: req.user, type: "stream", contentId: req.params.contentId },
        process.env.JWT_SECRET || "development-only-secret",
        { expiresIn: "15m" }
    );
    res.cookie("stream_access", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 15 * 60 * 1000, path: "/api/stream" });
    return res.status(204).end();
};

module.exports = { createStreamSession };
