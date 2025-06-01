import { Description } from '@mui/icons-material';
import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Wallet from '../../models/Wallet.js';
import mongoose from 'mongoose';

//  Create new order
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
        mcpId: mcp._id,
        customerId,
        pickupLocation,
        amount,
        commission,
        scheduledTime,
        customerNotes,
        status: 'PENDING'
        });
        
      await order.save();

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
        
      res.status(201).json({ 
        message: 'Order assigned successfully',
        data: { order } 
      });
      } catch (error) {
        console.error('Error assigning order:', error);
        res.status(500).json({ 
          message: 'Failed to assign order' 
        });
      }
}

// Assign order to pickup partner
export const assignOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

    try {
      const { orderId, partnerId } = req.body;

      // Validate MCP
      const mcp = await User.findById(req.user.userId);
      if (mcp.role !== 'MCP') {
        throw new Error('Only MCPs can assign orders');
      }

       // Validate order
      const order = await Order.findOne({
        _id: orderId,
        mcpid: mcp_id,
        status: 'PENDING'
      });

      if(!order) {
        throw new Error('Order not found or not assignable');
      }


      // Validate pickup partner
      const partner = await User.findone({
        _id: partnerId,
        role: 'PICKUP PARTNER',
        mcpId: mcp._id,
        status: 'ACTIVE'
      });

      if (!partner) {
        throw new Error('Invalid pickup partner');
      }

      await order.assignPartner(partnerId);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ 
        message: 'Order created successfully', 
        order 
      });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Assign order error:', error);
        res.status(500).json({ 
          message: 'Error assigning order',
          error: error.message
        });
    }
}

// Update order status
exports.updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderId, status, notes } = req.body;

        // Find order and validate access
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const user = await User.findById(req.user.userId);
        if (user.role === 'PICKUP_PARTNER' && order.pickupPartnerId.toString() !== user._id.toString()) {
            throw new Error('Unauthorized to update this order');
        }

        if (user.role === 'MCP' && order.mcpId.toString() !== user._id.toString()) {
            throw new Error('Unauthorized to update this order');
        }

        // Update order status
        await order.updateStatus(status, notes);

        // If order is completed, process payment
        if (status === 'COMPLETED') {
            const partnerWallet = await Wallet.findOne({ userId: order.pickupPartnerId });
            if (!partnerWallet) {
                throw new Error('Partner wallet not found');
            }

            // Deduct amount from partner's wallet
            await partnerWallet.addTransaction({
                type: 'DEBIT',
                amount: order.amount,
                description: `Payment for order ${order._id}`,
                reference: `ORD-${order._id}`,
                status: 'COMPLETED',
                metadata: {
                    orderId: order._id
                }
            });

            // Update order payment status
            order.paymentStatus = 'COMPLETED';
            await order.save();
        }

        await session.commitTransaction();
        session.endSession();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: { order }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Get orders with filters
export const getOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
  

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update order status
    order.status = status;
    await order.save();

    // Get assigned partner and their MCP
    const partner = await User.findById(order.assignedTo);
    if (!partner) return res.status(404).json({ message: 'Assigned partner not found' });

    const mcpId = partner.mcpId;
    const io = req.app.get('io');

    // Emit to MCP room
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

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('customerId', 'name phone')
      .populate('pickupPartnerId', 'name phone')
      .populate('mcpId', 'name phone');

    if(!order) {
      return res.status(401).json({
        message: 'Order not found'
      });
    }

    // Validate access
    const user = await User.findById(req.user.userId);

    if(
      (user.role === 'PICKUP_PARTNER' && order.pickupPartnerId?.toString() !== user._id.toString()) ||
      (user.role === 'MCP' && order.mcpId.toString() !== user._id.toString())
    ) {
      return res.status(403).json({
        message: 'Unauthorised to view this order'
      });
    }

    res.json({
      data: { order }
    });

  } catch (err) {
    console.error('Get order details error:', err);
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: err.message 
    });
  }
};

// Generate Daily or Weekly Report
export const getOrderReport = async (req, res) => {
    try {
      const { startDate, endDate } = req.query; 
      const query = {};
  
      // Apply filters based on user role
      const user = await User.findById(req.user.userId);
      if (user.role === 'MCP') {
        query.mcpid = user._id;
      } else if (user.role === 'PICKUP PARTNER') {
        query.pickupPartnerId = user._id;
      }

      if(startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
  
      const stats = await Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1},
            totalAmount: { $sum: '$amount'},
            totalCommission: { $sum: '$commission' }
          }
        }
      ]);
  
      const formattedStats = {
        total: 0,
        totalAmount: 0,
        totalCommission: 0,
        byStatus: {}
      };

      stats.forEach(stat => {
        formattedStats.total += stat.count;
        formattedStats.totalAmount += stat.totalAmount;
        formattedStats.totalCommission += stat.totalCommission;
        formattedStats.byStatus[stat._id] = {
          count: stat.count,
          amount: stat.totalAmount,
          commission: stat.totalCommission
        };
      })
  
      res.status(200).json({ 
        data: formattedStats
      });
    } catch (error) {
      console.error('Get order stats error:', error);
      res.status(500).json({ 
        message: 'Failed to generate report',
        error: error.message
      });
    }
  };