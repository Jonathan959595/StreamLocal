const fs = require("fs");
const path = require("path");
const Movie = require("../models/Movie");

const videosDirectory = path.resolve(__dirname, "..", "videos");

const streamVideo = async (req, res) => {
    let movie;

    try {
        movie = await Movie.findOne({ contentId: req.params.contentId });
    } catch (error) {
        return res.status(404).json({ message: "Video not found" });
    }

    if (!movie) {
        return res.status(404).json({ message: "Video not found" });
    }

    if (!movie.videoPath) {
        return res.status(404).json({ message: "Video is unavailable for this title" });
    }

    const filename = movie.videoPath;
    if (typeof filename !== "string" || path.basename(filename) !== filename || path.isAbsolute(filename)) {
        return res.status(404).json({ message: "Video file not found" });
    }

    const filePath = path.resolve(videosDirectory, filename);
    if (!filePath.startsWith(`${videosDirectory}${path.sep}`)) {
        return res.status(404).json({ message: "Video file not found" });
    }

    let fileSize;
    try {
        const fileStats = await fs.promises.stat(filePath);
        if (!fileStats.isFile()) {
            return res.status(404).json({ message: "Video file not found" });
        }
        fileSize = fileStats.size;
    } catch (error) {
        return res.status(404).json({ message: "Video file not found" });
    }

    const range = req.headers.range;
    if (!range) {
        res.writeHead(200, {
            "Accept-Ranges": "bytes",
            "Content-Length": fileSize,
            "Content-Type": "video/mp4"
        });
        return fs.createReadStream(filePath).pipe(res);
    }

    const rangeMatch = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!rangeMatch || !rangeMatch[1]) {
        res.set("Content-Range", `bytes */${fileSize}`);
        return res.status(416).json({ message: "Requested range is not satisfiable" });
    }

    const start = Number(rangeMatch[1]);
    const requestedEnd = rangeMatch[2] ? Number(rangeMatch[2]) : fileSize - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) || start >= fileSize || requestedEnd < start) {
        res.set("Content-Range", `bytes */${fileSize}`);
        return res.status(416).json({ message: "Requested range is not satisfiable" });
    }

    const end = Math.min(requestedEnd, fileSize - 1);
    const chunkSize = end - start + 1;
    res.writeHead(206, {
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4"
    });
    return fs.createReadStream(filePath, { start, end }).pipe(res);
};

module.exports = { streamVideo };
