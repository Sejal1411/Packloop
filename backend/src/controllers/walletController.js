import Wallet from '../../models/Wallet.js';
import Transaction from '../../models/Transaction.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

// Get total wallet balance
export const getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findone({ userId: req.user.userId });
 
    if(!wallet) {
      return res.status(404).json({
        message: 'Wallet not found'
      });
    }

    const recentTransactions = wallet.transactions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

      res.json({
        data: {
          balance: wallet.balance,
          recentTransactions
        }
      });
    } catch (err) {
    console.error('Wallet Balance Error:', err);
    res.status(500).json({ 
      message: 'Failed to fetch wallet balance',
      error: err.message
    });
  }
};


//  Add funds to wallet
  export const addFunds = async (req, res) => {
    try {
      console.log('Add funds request received:', {
        body: req.body,
        user: req.user
      })

      const { amount, paymentMethod } = req.body;
      const userId = req.user.userId;

      if(!userId) {
        console.error('No user ID found in request');
        return res.status(401).json({
          message: 'User is not authenticated'
        });
      }

      if(!amount || isNaN(amount) || amount <= 0) {
        console.error('Invalid amount:', amount);
        return res.status(400).json({
          message: 'Invalid amount'
        });
      }

      if(!paymentMethod) {
        console.error('Payment method missing');
        return res.status(400).json({
          message: 'Payment method is required'
        });
      }
  
      const wallet = await Wallet.findOne({ userId });
      console.log('Found wallet:', wallet ? 'Yes' : 'No');
      
      if (!wallet) {
        console.log('Creating new wallet for user:', userId);

        wallet = new Wallet({ 
          userId,
          balance: 0,
          transactions: []
        });
      }
  
      const txn = {
        type: 'CREDIT',
        amount: Number(amount),
        description: `Added funds via ${paymentMethod}`,
        reference: `ADD-${Date.now()}`,
        status: 'COMPLETED',
        metadata: {
          paymentMethod
        }
      };

      console.log('Adding transaction:', txn);

      try {
        await wallet.addTransaction(txn);
        console.log('Transaction added successfully');
      } catch (error) {
        console.error('Error adding transaction', error);
        throw error;
      }

      res.status(200).json({
        message: 'Funds added successfully',
        data: {
          balance: wallet.balance,
          txn
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        message: 'Failed to add funds' 
      });
    }
  };


  //  Transfer funds to pickup partner
  export const transferToPartner = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { partnerId, amount, description } = req.body;
  
      const mcp = await User.findById(req.user.userId);
      if (mcp.role !== 'MCP') {
        throw new Error('Only MCPs can transfer funds');
      }

      // Validate pickup partner
      const partner = await User.findById( partnerId );
      if (!partner || partner.role !== 'PICKUP_PARTNER' || partner.mcpId.toString() !== mcp_id.toString()) {
        throw new Error('Invalid pickup partner');
      }
  
      // Get both wallets
      const mcpWallet = await Wallet.findOne({ userId: mcp._id });
      const partnerWallet = await Wallet.findone({ userId: partnerId });

      if(!mcpWallet || !partnerWallet) {
        throw new Error('Wallet not found');
      }

      if(mcpWallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const reference = `TRF-${Date.now()}`;

      // Debit from MCP wallet
      await mcpWallet.addTransaction({
        type: 'DEBIT',
        amount,
        description: `Transfer to ${partner.name}`,
        reference,
        status: 'COMPLETED',
        metadata: {
          transferredTo: partnerId
        }
      });
  
      // Credit partner wallet
      await partnerWallet.addTransaction({
        type: 'CREDIT',
        amount,
        description: `Received from ${mcp.name}`,
        reference,
        status: 'COMPLETED',
        metadata: {
          transferredFrom: mcp._id
        }
      })

      await session.commitTransaction();
      session.endSession();

      res.json({
        success: true,
        message: 'Funds transferred successfully',
        data: {
          mcpBalance: mcpWallet.balance,
          partnerBalance: partnerWallet.balance,
          transaction: mcpWallet.transactions[mcpWallet.transaction.length - 1]
        }
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      console.error('Transfer funds error:', error);
      res.status(500).json({ 
        message: 'Transfer failed' ,
        error: err.message
      });
    }
  };


// Get all transactions 
export const getAllTransactions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};

    if(startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Transaction.find(filter)
    .populate('userId', 'name email')
    .sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching transactions', error: err.message 
    });
  }
};


// Get transaction history of a pickup partner
export const getPartnerTransactions = async (req, res) => {
  try {
    const { id } = req.params;

    const transactions = await Transaction.find({ userId: id }).sort({ data: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user transactions', error: err.message });
  }
};


//  Withdraw funds from wallet
export const withdrawFunds = async(req, res) => {
  try {
    const { amount, bankDetails } = req.body;
    const userId = req.user.id;

    if(!amount || amount <= 0) {
      return res.status(400).json({
        message: 'invalid amount'
      })
    }

    const user = await User.findbyId(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if(user.walletBalance < amount) {
      return res.status(400).json({
        message: 'Insufficient balance'
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      amount,
      type: 'debit',
      reason: 'Withdrawal request',
      balanceAfter: user.walletBalance - amount,
      status: 'pending',
      metadata: { bankDetails }
    });

    user.walletBalance -= amount;
    await user.save();
    await transaction.save();

    res.status(200).json({
      message: 'Withdrawal request submitted successfully',
      balance: user.walletBalance,
      transaction
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error processing withdrawal', error: err.message
    });
  }
}


