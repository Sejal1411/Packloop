import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, mcpId } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }, { phone });
    if (existingUser) {
      return res.status(400).json({ message: "User with phone or already exists" });
    }

    if(role === 'PICKUP_PARTNER') {
      if(!mcpId) {
        return res.status(400).json({
          success: false,
          message: 'MCP ID is required for Pickup Partner Registration'
        });
      }

      const mcp = await User.findById(mcpId);
      if (!mcp || mcp.role !== 'MCP') {
        return res.status(400).json({
          success: false,
          message: 'Invalid MCP ID provided'
        });
      }
    }

     // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      role,
      mcpId: role === 'PICKUP_PARTNER' ? mcpId : undefined
    });

    await user.save();

    const wallet = new Wallet({
      userId: user._id,
      balance: 0
    });

    await wallet.save();

      // Create JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

    // Send response with token
    res.status(201).json({
      message: "User registered successfully",
      data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "Registration failed", 
      error: error.message 
    });
  }
};

// Login 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }


    if(user.status !== 'ACTIVE') {
      return res.status(403).json({
        message: 'Account is not active'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login Successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });
  } catch(error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error during login',
      error: error.message
    });
  }
}

export const getProfile = async (req, res) => {
  try{
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('mcpId', 'name email phone');

      if(!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      res.json({
        data: { user }
      });
  } catch(error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, deviceToken } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (deviceToken) updates.deviceToken = deviceToken;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    if(!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile Updated successfully',
      data: { user }
    });
    
  } catch(error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if(!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password changed successfully"
    });
  } catch(error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: 'Error changing password',
      error: error.message
    });
  }
};