import Transaction from '../../models/Transaction.js';

export const getMyTransactions = async (req, res) => {
  try {
    const partnerId = req.user.id;

    // Fetch credit (received from MCP) and debit (withdrawals)
    const [receivedFunds, withdrawals] = await Promise.all([
      Transaction.find({
        userId: partnerId,
        type: 'credit',
        status: 'completed',
      }).sort({ createdAt: -1 }),

      Transaction.find({
        userId: partnerId,
        type: 'debit',
        status: 'completed',
      }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      receivedFunds,
      withdrawals,
    });

  } catch (error) {
    console.error('Partner Wallet Transactions Error:', error);
    res.status(500).json({ message: 'Failed to fetch wallet transactions', error: error.message });
  }
};
