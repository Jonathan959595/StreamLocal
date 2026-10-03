const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "development-only-secret";

const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const token = authorization.slice(7);

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
