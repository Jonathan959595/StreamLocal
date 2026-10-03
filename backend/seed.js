const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Movie = require("./models/Movie");
const movies = require("./data/movies.json");

const seed = async () => {
    const contentIds = movies.map((movie) => movie.contentId);
    if (contentIds.some((contentId) => !contentId) || new Set(contentIds).size !== movies.length) {
        throw new Error("Each movie record must have a unique contentId");
    }

    await connectDB();
    await Movie.deleteMany({});
    const insertedMovies = await Movie.insertMany(movies);
    console.log(`Inserted ${insertedMovies.length} movie records`);
    await mongoose.disconnect();
};

seed().catch(async (error) => {
    console.error("Movie seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
});
