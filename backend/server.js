const express = require("express");
const connectDB = require("./config/db");
const app = express();
  
connectDB();

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

app.listen(5000, () => {
    console.log("StreamLocal backend running on port 5000");
});