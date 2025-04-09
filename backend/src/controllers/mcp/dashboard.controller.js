import Wallet from '../../models/Wallet.js';
import User from '../../models/User.js';
import Order from '../../models/Order.js';

export const getDashboardStats = async (req, res) => {
  try {
    const mcpId = req.user.id; // from auth middleware

    // 1. Get MCP wallet balance
    const mcpWallet = await Wallet.findOne({ owner: mcpId });
    const walletBalance = mcpWallet ? mcpWallet.balance : 0;

    // 2. Count Pickup Partners mapped to  MCP
    const totalPartners = await User.countDocuments({ mcpId, role: 'Partner' });
    const activePartners = await User.countDocuments({ mcpId, role: 'Partner', status: 'active' });
    const inactivePartners = totalPartners - activePartners;

    // 3. Orders mapped to  MCP's partners
    const partners = await User.find({ mcpId, role: 'Partner' }).select('_id');
    const partnerIds = partners.map((p) => p._id);

    const totalOrders = await Order.countDocuments({ assignedTo: { $in: partnerIds } });
    const completedOrders = await Order.countDocuments({ assignedTo: { $in: partnerIds }, status: 'Completed' });
    const pendingOrders = await Order.countDocuments({ assignedTo: { $in: partnerIds }, status: 'Pending' });

    const totalEarnings  = await Transaction.aggregate([
      { $match: { to: req.user._id, type: 'credit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Final response
    res.status(200).json({
      walletBalance,
      totalEarnings: totalEarnings[0]?.total || 0,
      partners: {
        total: totalPartners,
        active: activePartners,
        inactive: inactivePartners,
      },
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
      },
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

