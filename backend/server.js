const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const billingRoutes = require("./routes/billingRoutes");
const contentRoutes = require("./routes/contentRoutes");
const streamRoutes = require("./routes/streamRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chaosRoutes = require("./routes/chaosRoutes");
const telemetry = require("./services/telemetry");

const app = express();

connectDB();

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && /^http:\/\/localhost:\d+$/.test(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Range, x-profile-id");
    res.setHeader("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges, Content-Length");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
});
app.use(express.json());
app.use((req, res, next) => { req.cookies = Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map((part) => { const index = part.indexOf("="); return [decodeURIComponent(part.slice(0, index).trim()), decodeURIComponent(part.slice(index + 1).trim())]; })); next(); });
app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/chaos", chaosRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
    console.log(`StreamLocal backend running on port ${port}`);
    telemetry.register();
    setInterval(() => telemetry.send("/api/v1/telemetry/metrics", { timestamp: new Date().toISOString(), app_id: "netflix-local-clone", query_duration_ms: 0, chunk_read_duration_ms: 0, cpu_usage: process.cpuUsage(), active_stream_count: 0, memory_bytes: process.memoryUsage().rss }), 5000).unref();
});
