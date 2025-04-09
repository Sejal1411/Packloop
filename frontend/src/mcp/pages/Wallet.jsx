// pages/Wallet.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import WalletCard from '../components/WalletCard';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchWallet = async () => {
    try {
      const res = await axios.get('/api/mcp/wallet');
      setBalance(res.data.walletBalance);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/mcp/wallet/transactions');
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleAddFunds = async (amount, method) => {
    try {
      await axios.post('/api/mcp/wallet/add', {
        amount,
        paymentMethod: method || 'UPI',
      });
      fetchWallet();
    } catch (error) {
      console.error('Error adding funds:', error);
    }
  };
  
  const handleTransferFunds = async (amount, partnerId) => {
    try {
      await axios.post('/api/mcp/wallet/transfer', {
        amount,
        partnerId,
      });
      fetchWallet();
    } catch (error) {
      console.error('Error transferring funds:', error);
    }
  };
  

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Wallet Management
      </Typography>

      <WalletCard
        balance={balance}
        onAddFunds={handleAddFunds}
        onDistributeFunds={handleTransferFunds}
      />

      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>

      <List>
        {transactions.map((txn) => (
          <React.Fragment key={txn._id}>
            <ListItem>
              <ListItemText
                primary={`₹${txn.amount} - ${txn.type}`}
                secondary={new Date(txn.createdAt).toLocaleString()}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default Wallet;
