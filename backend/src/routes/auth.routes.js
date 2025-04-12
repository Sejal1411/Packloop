import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // MCP user model

const router = express.Router();

// POST /api/auth/mcp-register
router.post("/mcp-register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "mcp"
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({ token });

  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
});

export default router;
