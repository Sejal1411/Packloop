import User from '../../models/User.js';
import Wallet from '../../models/Wallet.js';
import bcrypt from 'bcrypt';

// Get All Pickup Partners 
export const getAllPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: 'PICKUP_PARTNER' }); 
    res.status(200).json({
      message: 'Partner fetched successfully',
      data: {
        partners
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error getting partners',
      error: err.message
    });
  }
};

// Add a Pickup Partner
export const addPartner = async (req, res) => {
  console.log('Add partner request body:', req.body);
  let { name, email, password, phone, mcpId, commission = 0 } = req.body;

  try {
    // Validate required fields
    if(!name || !email || !password || !phone || !mcpId) {
      return res.status(400).json({
        message: 'Missing required fields',
        data: { required: ['name', 'email', 'password', 'phone', 'mcpId'] }
      });
    }

    console.log('Checking if email exists:', email);
    const existing = await User.findOne({ email });

    if (existing) {
      const timestamp = Date.now().toString().slice(-6);
      email = `${email.split('@')[0]}_${timestamp}@${email.split('@')[1]}`;
      console.log('Email already exists, using alternative:', email);
    }

    // Check if phone exists
    const existingPhone = await User.findOne({ phone });
    if(existingPhone) {
      const timestamp = Date.now().toString().slice(-6);
      phone = `${phone}${timestamp}`;
      console.log('Phone already exists', phone);
    }

    // Verify the mcp exists
    console.log('Checking MCP ID:', mcpId);
    const mcp = await User.findById(mcpId);
    if(!mcp) {
      return res.status(400).json({
        message: 'Invalid MCP ID provided'
      });
    }

    if(mcp.role !== 'MCP') {
      return res.status(400).json({
        message: 'The provided ID does not belong to an MCP user'
      })
    }
  
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating new partner');
    const partner = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'PICKUP_PARTNER',
      mcpId,
      commissionRate: commission,
      status: 'ACTIVE'
    });

    console.log('Saving partner to database');
    await partner.save();
  

    console.log('Creating wallet for partners');
    
    const wallet = new Wallet({
      userId: partner._id,
      balance: 0
    });

    await wallet.save();

    console.log('Partner created successfully:', partner._id);
    res.status(201).json({
      message: 'Pickup Partner added successfully',
      data: {
        partner: {
          id: partner._id,
          name: partner.name,
          email: partner.email,
          phone: partner.phone,
          role: partner.role 
        }
      }
    });
    } catch (error) {
      console.error('Partner creation error:', err);
      console.error('Error stack:', err.stack);

      if(err.name === 'Validation error') {
        return res.status(400).json({
          message: 'Validation error',
          error: err.message
        })
      }
    }
  };

  // Delete Pickup Partner
  export const deletePartner = async (req, res) => {
    const { id } = req.params;

    try {
      await User.findByIdAndUpdate(id);
      res.status(200).json({
        message: 'Partner deleted successfully',
        date: {}
      });
      } catch (error) {
      res.status(500).json({ 
        message: 'Failed to deactivate pickup partner',
        error: err.message 
      });
    }
  };
  

  // Update Partner Status or Commission
  export const updatePartnerRole = async (req, res) => {
    const { id } = req.params;
    const { active, commission } = req.body;

    try {
      const updatedPartner = await User.findByIdAndUpdate(
        id,
        { active, commission },
        { new: true }
      );
  
      res.status(200).json({ 
        message: 'Partner updated successfully',
        data: {
          partner: updated
        }
      });
    } catch (error) {
      console.error('Update Partner Error:', error);
      res.status(500).json({ 
        message: 'Failed to update partner',
        error: err.message 
      });
    }
};





