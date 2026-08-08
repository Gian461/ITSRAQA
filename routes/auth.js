const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "default_latk_secret_2026";

function signToken(user) {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { lastName, firstName, email, username, homeAddress, password, confirmPassword } = req.body;

    if (!lastName || !firstName || !email || !username || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "Email or username already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      username,
      homeAddress: homeAddress || "",
      passwordHash,
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message || "Server error while creating account." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username.toLowerCase() }],
    });
    if (!user) return res.status(401).json({ message: "Invalid username or password." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid username or password." });

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message || "Server error while logging in." });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
