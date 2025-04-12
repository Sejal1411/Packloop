import User from '../../models/User.js';
import Wallet from '../../models/Wallet.js';
import bcrypt from 'bcrypt';

// 1. Get All Pickup Partners for an MCP
export const getAllPartners = async (req, res) => {
  try {
    const mcpId = req.user.id; // from auth middleware

    const partners = await User.find({
      mcpId,
      role: 'Partner',
    }).select('-password'); // exclude password from results

    res.status(200).json({ partners });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Failed to fetch partners' });
  }
};

// 2. Add Pickup Partner
export const addPartner = async (req, res) => {
  try {
    const { name, phone, email, password, commissionRate, paymentType, age } = req.body;
    const mcpId = req.user.id; // from auth middleware
  
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Partner already exists with this email' });
    }

      // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    const newPartner = await User.create({
      name,
      phone,
      email,
      password: hashedPassword, // Make sure to hash this in a real app
      role: 'Partner',
      mcpId,
      commissionRate,
      paymentType,
      age,
      status: 'active',
    });
  
    await Wallet.create({
      owner: newPartner._id,
      balance: 0,
    });
  
      res.status(201).json({ message: 'Pickup Partner added successfully', partner });
    } catch (error) {
      console.error('Add Partner Error:', error);
      res.status(500).json({ message: 'Failed to add pickup partner' });
    }
  };

  // 3. Delete Pickup Partner
  export const deletePartner = async (req, res) => {
    try {
      const { partnerId } = req.params;
      const mcpId = req.user.id;
  
      // Check if partner exists and is owned by this MCP
      const partner = await User.findOne({ _id: partnerId, mcpId, role: 'Partner' });
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found or unauthorized' });
      }
  
      // Soft delete → set status to inactive
      partner.status = 'inactive';
      await partner.save();
  
      res.status(200).json({ message: 'Pickup Partner deactivated successfully' });
    } catch (error) {
      console.error('Soft Delete Partner Error:', error);
      res.status(500).json({ message: 'Failed to deactivate pickup partner' });
    }
  };
  

  // 4. Update Role/Responsibilities (commission, payment type)
  export const updatePartnerRole = async (req, res) => {
    try {
      const { partnerId } = req.params;
      const { commissionRate, paymentType } = req.body;
  
      const updatedPartner = await User.findByIdAndUpdate(
        partnerId,
        { commissionRate, paymentType },
        { new: true }
      );
  
      res.status(200).json({ message: 'Partner updated successfully', updatedPartner });
    } catch (error) {
      console.error('Update Partner Error:', error);
      res.status(500).json({ message: 'Failed to update partner' });
    }
};


export const trackPartnerStatus = async (req, res) => {
  try {
    const mcpId = req.user.id; // From auth middleware

    // Count all partners created by this MCP
    const total = await User.countDocuments({ mcpId, role: 'Partner' });

    // Count active partners
    const active = await User.countDocuments({
      mcpId,
      role: 'Partner',
      status: 'active',
    });

    // Inactive = total - active
    const inactive = total - active;

    res.status(200).json({
      totalPartners: total,
      activePartners: active,
      inactivePartners: inactive,
    });
  } catch (error) {
    console.error('Error getting partner status stats:', error);
    res.status(500).json({ message: 'Failed to get partner status stats' });
  }
};


