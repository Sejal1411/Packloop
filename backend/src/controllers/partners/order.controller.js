import Order from '../../models/Order.js';
import User from '../../models/User.js';

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.assignedTo.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized access' });

    order.status = status;
    await order.save();

    // Emit socket event to MCP (real-time tracking)
    const partner = await User.findById(req.user.id);
    const mcpRoom = `mcp-${partner.mcpId}`;
    const io = req.app.get('io'); // From server

    if (io && mcpRoom) {
      io.to(mcpRoom).emit('orderStatusUpdate', {
        orderId: order._id,
        status,
        updatedBy: req.user.id,
        time: new Date(),
      });
    }

    res.status(200).json({ message: `Order ${status}`, order });

  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ message: 'Order status update failed', error: err.message });
  }
};

export const acceptOrRejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action } = req.body; // should be 'accept' or 'reject'
    const partnerId = req.user.id;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.assignedTo.toString() !== partnerId) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order is already processed' });
    }

    // Update order status based on action
    order.status = action === 'accept' ? 'In Progress' : 'Rejected';
    await order.save();

    // Optionally emit socket update to MCP
    const partner = await User.findById(partnerId);
    const io = req.app.get('io');
    if (io && partner?.mcpId) {
      io.to(`mcp-${partner.mcpId}`).emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status,
        updatedBy: partnerId,
      });
    }

    return res.status(200).json({
      message: `Order ${action}ed successfully`,
      order,
    });

  } catch (err) {
    console.error('Order Accept/Reject Error:', err);
    return res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
};