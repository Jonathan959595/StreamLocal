const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        contentType: {
            type: String,
            enum: ["movie", "series"],
            default: "movie",
            required: true
        },
        tags: {
            type: [String],
            default: []
        },
        posterPath: {
            type: String,
            trim: true
        },
        videoPath: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

movieSchema.index({ title: "text", tags: "text" });

module.exports = mongoose.model("Movie", movieSchema);
