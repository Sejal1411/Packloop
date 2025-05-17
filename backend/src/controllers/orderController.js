import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Wallet from '../../models/Wallet.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
    try {
      const { 
        customerId, 
        amount,
        scheduledTime,
        customerNotes 
      } = req.body;

      // Validate MCP
      const mcp = await User.findById(req.user.userId);
      if(mcp.role !== 'MCP') {
        return res.status(403).json({
          message: 'Only MCPs can create orders'
        });
      }

      // Calculate commission
      const commission = amount * 0.01;

      const order = new Order({
        assignedTo: partnerId,
        assignedBy: req.user._id,
        status: "assigned"
        }, { new: true });
        
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
        
      res.status(200).json({ message: 'Order assigned successfully', order });
    } catch (error) {
        console.error('Error assigning order:', error);
        res.status(500).json({ message: 'Failed to assign order' });
    }
}
export const assignOrder = async (req, res) => {
    try {
      const { 
        orderId, 
        partnerId 
      } = req.body;

        // Check if order exists
      const order = await Order.findByIdAndUpdate(orderId, {
        assignedTo: partnerId,
        assignedBy: req.user._id,
        status: "assigned"
        }, { new: true });
        
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
        
      res.status(200).json({ message: 'Order assigned successfully', order });
    } catch (error) {
        console.error('Error assigning order:', error);
        res.status(500).json({ message: 'Failed to assign order' });
    }
}

// 2. Auto Assign Based on Partner Availability (very basic)
export const autoAssignOrder = async (req, res) => {
    try {
      const { orderId } = req.body;
  
      const availablePartner = await User.findOne({ role: 'Partner', status: 'active' });
  
      if (!availablePartner) {
        return res.status(404).json({ message: 'No available partner found' });
      }
  
      const order = await Order.findByIdAndUpdate(
        orderId,
        { assignedTo: availablePartner._id, status: 'Pending' },
        { new: true }
      );
  
      res.status(200).json({ message: 'Order auto-assigned', order });
    } catch (error) {
      console.error('Auto Assign Error:', error);
      res.status(500).json({ message: 'Failed to auto assign order' });
    }
};

// Track live order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // 1. Find the order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // 2. Update order status
    order.status = status;
    await order.save();

    // 3. Get assigned partner and their MCP
    const partner = await User.findById(order.assignedTo);
    if (!partner) return res.status(404).json({ message: 'Assigned partner not found' });

    const mcpId = partner.mcpId;
    const io = req.app.get('io');

    // 4. Emit to MCP room
    if (mcpId && io) {
      io.to(`mcp-${mcpId}`).emit('orderStatusUpdated', {
        orderId: order._id,
        assignedTo: partner._id,
        newStatus: status,
      });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });

  } catch (err) {
    console.error('Update Order Error:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// 4. See which partner is working on which order
export const getOrdersByPartners = async (req, res) => {
  try {
    const mcpId = req.user.id;

    const partners = await User.find({ mcpId, role: 'Partner' }).select('_id name');
    const partnerIds = partners.map(p => p._id);

    const orders = await Order.find({
      assignedTo: { $in: partnerIds },
      status: { $in: ['In Progress', 'Pending'] },
    }).populate('assignedTo', 'name phone');

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching active orders', error: err.message });
  }
};

// 5. Generate Daily or Weekly Report
export const getOrderReport = async (req, res) => {
    try {
      const { type } = req.query; // type = 'daily' or 'weekly'
      const now = new Date();
      let fromDate;
  
      if (type === 'weekly') {
        fromDate = new Date(now.setDate(now.getDate() - 7));
      } else {
        fromDate = new Date(now.setDate(now.getDate() - 1));
      }
  
      const orders = await Order.find({ createdAt: { $gte: fromDate } });
  
      const report = {
        total: orders.length,
        completed: orders.filter((o) => o.status === 'Completed').length,
        pending: orders.filter((o) => o.status === 'Pending').length,
        inProgress: orders.filter((o) => o.status === 'In Progress').length,
      };
  
      res.status(200).json({ report });
    } catch (error) {
      console.error('Report Error:', error);
      res.status(500).json({ message: 'Failed to generate report' });
    }
  };