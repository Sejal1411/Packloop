import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerMCP = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, education } = req.body;
    const aadharFile = req.file;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with MCP role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      education,
      aadhar: aadharFile.path, // or store file name, etc.
      role: "mcp",
    });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response with token
    res.status(201).json({
      message: "MCP registered successfully",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};