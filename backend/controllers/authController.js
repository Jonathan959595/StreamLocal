const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET || "development-only-secret";

const register = async (req, res) => {
    const { email, password } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (typeof password !== "string" || !password.trim()) {
        return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email: normalizedEmail,
            password: hashedPassword
        });

        await user.save();

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email already registered" });
        }

        return res.status(500).json({ message: "Unable to register user" });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (typeof password !== "string" || !password.trim()) {
        return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id.toString() }, jwtSecret, { expiresIn: "7d" });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id.toString(),
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Unable to log in" });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        return res.status(200).json({
            id: user._id.toString(),
            email: user.email,
            subscription: user.subscription,
            profiles: user.profiles
        });
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve user" });
    }
};

module.exports = { register, login, getCurrentUser };
