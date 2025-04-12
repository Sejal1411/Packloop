// pages/Wallet.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import WalletCard from '../components/WalletCard';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchWallet = async () => {
    try {
      const res = await axios.get('/api/mcp/wallet');
      setBalance(res.data.walletBalance);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/mcp/wallet/transactions');
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleAddFunds = async (amount, method) => {
    try {
      await axios.post('/api/mcp/wallet/add', { amount, paymentMethod: method || 'UPI' });
      fetchWallet();
      fetchTransactions();
    } catch (err) {
      console.error('Error adding funds:', err);
    }
  };

  const handleTransferFunds = async (amount, partnerId) => {
    try {
      await axios.post('/api/mcp/wallet/transfer', { amount, partnerId });
      fetchWallet();
      fetchTransactions();
    } catch (err) {
      console.error('Error transferring funds:', err);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Wallet Management
      </Typography>

      <WalletCard
        balance={balance}
        transactions={transactions}
        onAddFunds={handleAddFunds}
        onDistributeFunds={handleTransferFunds}
        currentUserId="mcp123" // Replace with actual MCP ID from auth context
      />
    </Container>
  );
};

export default Wallet;
