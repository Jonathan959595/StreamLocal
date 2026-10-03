const User = require("../models/User");

const plans = [
    { planId: "basic", name: "Basic", price: 4.99 },
    { planId: "standard", name: "Standard", price: 9.99 },
    { planId: "premium", name: "Premium", price: 14.99 }
];

const getPlans = (req, res) => {
    return res.status(200).json(plans);
};

const checkout = async (req, res) => {
    const { cardNumber, cvv, planId } = req.body || {};

    if (typeof cardNumber !== "string" || !cardNumber.trim()) {
        return res.status(400).json({ message: "Card number is required" });
    }

    if (typeof cvv !== "string" || !cvv.trim()) {
        return res.status(400).json({ message: "CVV is required" });
    }

    const selectedPlan = plans.find((plan) => plan.planId === planId);
    if (!selectedPlan) {
        return res.status(400).json({ message: "A valid plan is required" });
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        user.subscription.status = "ACTIVE";
        user.subscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Subscription activated successfully",
            plan: selectedPlan,
            expiresAt: user.subscription.expiresAt
        });
    } catch (error) {
        return res.status(500).json({ message: "Unable to activate subscription" });
    }
};

module.exports = { getPlans, checkout };
