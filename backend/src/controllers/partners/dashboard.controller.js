import Order from '../../models/Order.js';
import Transaction from '../../models/Transaction.js';

export const getPartnerDashboard = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const [totalOrders, completedOrders, earningsAgg] = await Promise.all([
      Order.countDocuments({ assignedTo: partnerId }),
      Order.countDocuments({ assignedTo: partnerId, status: 'Completed' }),
      Transaction.aggregate([
        { $match: { userId: partnerId, type: 'credit', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalEarnings = earningsAgg[0]?.total || 0;

    res.status(200).json({
      totalOrders,
      completedOrders,
      totalEarnings
    });
    console.log('Authenticated user:', req.user);

  } catch (error) {
    res.status(500).json({ message: 'Dashboard error', error: error.message });
  }
};
