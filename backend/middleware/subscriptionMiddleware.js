const User = require("../models/User");

const requireActiveSubscription = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const userId = typeof req.user === "object" ? req.user.id : req.user;

    try {
        const user = await User.findById(userId);
        const subscription = user?.subscription;

        if (!subscription || subscription.status !== "ACTIVE" || !subscription.expiresAt || subscription.expiresAt <= new Date()) {
            return res.status(403).json({ message: "An active subscription is required" });
        }

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication required" });
    }
};

module.exports = { requireActiveSubscription };
