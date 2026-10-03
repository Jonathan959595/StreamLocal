const Movie = require("../models/Movie");
const contentFields = "contentId title description contentType tags posterPath videoPath";

const getFeed = async (req, res) => {
    try {
        const [trending, action, sciFi, movies, series] = await Promise.all([
            Movie.find().select(contentFields).sort({ createdAt: -1 }).limit(12),
            Movie.find({ tags: "Action" }).select(contentFields).limit(12),
            Movie.find({ tags: "Sci-Fi" }).select(contentFields).limit(12),
            Movie.find({ contentType: "movie" }).select(contentFields).limit(24),
            Movie.find({ contentType: "series" }).select(contentFields).limit(24)
        ]);

        return res.status(200).json({
            Trending: trending,
            Action: action,
            "Sci-Fi": sciFi,
            Movies: movies,
            Series: series
        });
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve content feed" });
    }
};

const searchContent = async (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (!query) {
        return res.status(400).json({ message: "A search query is required" });
    }

    try {
        const results = await Movie.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
            .select(contentFields)
            .sort({ score: { $meta: "textScore" } });

        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: "Unable to search content" });
    }
};

module.exports = { getFeed, searchContent };
