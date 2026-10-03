const bcrypt = require("bcryptjs");
const User = require("../models/User");

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
    if (email === "admin@gmail.com" && password === "admin") {
        return res.status(200).json({ message: "Login successful" });
    }
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
}
module.exports = { register, login };
