const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
  
connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

app.listen(5000, () => {
    console.log("StreamLocal backend running on port 5000");
});
