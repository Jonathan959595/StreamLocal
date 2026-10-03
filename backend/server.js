const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const billingRoutes = require("./routes/billingRoutes");
const contentRoutes = require("./routes/contentRoutes");
const streamRoutes = require("./routes/streamRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/stream", streamRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

app.listen(5000, () => {
    console.log("StreamLocal backend running on port 5000");
});
