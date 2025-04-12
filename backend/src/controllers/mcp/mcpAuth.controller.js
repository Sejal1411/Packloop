import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerMCP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with MCP role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "mcp", 
    });

    // Creates JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Response sent with token
    res.status(201).json({
      message: "MCP registered successfully",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};
