const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "development-only-secret";
const { state } = require("../services/chaosState");

const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    const streamToken = req.cookies?.stream_access;

    if (!authorization && !streamToken) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : streamToken;

    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.type === "stream" && req.params.contentId && decoded.contentId !== req.params.contentId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        req.user = decoded.id;
        if (state.authDropRate > 0 && Math.random() < state.authDropRate) return res.status(401).json({ message: "Authentication temporarily unavailable" });
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
