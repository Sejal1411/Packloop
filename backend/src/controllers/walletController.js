import Wallet from '../../models/Wallet.js';
import Transaction from '../../models/Transaction.js';

// 1. Get total wallet balance
export const getWalletBalance = async (req, res) => {
  try {
    const mcpId = req.user.id;

    const wallet = await Wallet.findOne({ owner: mcpId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({ balance: wallet.balance });
  } catch (err) {
    console.error('Wallet Balance Error:', err);
    res.status(500).json({ message: 'Failed to fetch wallet balance' });
  }
};

// 2. MCP adds money to own wallet
  export const addFundsToMCPWallet = async (req, res) => {
    try {
      const { amount, paymentMethod } = req.body;
      const mcpId = req.user.id;
  
      const wallet = await Wallet.findOne({ owner: mcpId });
      if (!wallet) {
        wallet = new Wallet({ owner: mcpId });
      }
  
      wallet.balance += amount;
      await wallet.save();
  
      const txn = new Transaction({
        from: 'external',
        to: mcpId,
        amount,
        type: 'credit',
        purpose: 'MCP Wallet Top-up',
        method: paymentMethod,
      });
      await txn.save();

      //Check for low balance
      const LOW_BALANCE_THRESHOLD = 100;
      if(wallet.balance < LOW_BALANCE_THRESHOLD) {
        global.importScripts.to(mcpId.toString()).emit('low-balance-alert', {
          balance: wallet.balance,
          message: `Your wallet balance is low: ${wallet.balance}`,
        });
      }
    
      res.status(200).json({ message: 'Funds added', balance: wallet.balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add funds' });
    }
  };

  // 3. MCP transfers money to Pickup Partner
  export const transferToPartner = async (req, res) => {
    try {
      const { partnerId, amount } = req.body;
      const mcpId = req.user.id;
  
      const mcpWallet = await Wallet.findOne({ owner: mcpId });
      const partnerWallet = await Wallet.findOne({ owner: partnerId });
  
      if (!mcpWallet) {
        return res.status(400).json({ message: 'MCP wallet not found' });
      }
  
      // Deduct from MCP wallet using schema method
      await mcpWallet.deductFunds(amount);
  
      // Credit to Partner
      if (!partnerWallet) {
        await Wallet.create({ owner: partnerId, balance: amount });
      } else {
        partnerWallet.balance += amount;
        await partnerWallet.save();
      }
  
      await Transaction.create([
        {
          from: mcpId,
          to: partnerId,
          amount,
          type: 'debit',
          purpose: 'Transfer to Pickup Partner',
        },
        {
          from: mcpId,
          to: partnerId,
          amount,
          type: 'credit',
          purpose: 'Received from MCP',
        },
      ]);

    // Check for low balance
      const LOW_BALANCE_THRESHOLD = 100;
        if (mcpWallet.balance < LOW_BALANCE_THRESHOLD) {
            global.io.to(mcpId.toString()).emit('low-wallet-balance', {
                balance: mcpWallet.balance,
                message: 'Your wallet balance is low!',
            });
        }
  
      res.status(200).json({ message: 'Funds transferred successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Transfer failed' });
    }
  };


  // 5. Get Transaction History
  export const getTransactionHistory = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const transactions = await Transaction.find({
        $or: [{ from: userId }, { to: userId }],
      })
        .sort({ createdAt: -1 })
        .populate('from to', 'name email');
  
      res.status(200).json({ transactions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch transactions' });
    }
};
