import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  MenuItem,
} from '@mui/material';

const WalletCard = ({ balance, onAddFunds, onDistributeFunds }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [partnerId, setPartnerId] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidAmount = amount && !isNaN(amount) && Number(amount) > 0;

  const handleAdd = async () => {
    if (isValidAmount) {
      setLoading(true);
      await onAddFunds(Number(amount), paymentMethod);
      setAmount('');
      setLoading(false);
    }
  };

  const handleDistribute = async () => {
    if (isValidAmount && partnerId) {
      setLoading(true);
      await onDistributeFunds(Number(amount), partnerId);
      setAmount('');
      setPartnerId('');
      setLoading(false);
    }
  };

  return (
    <Card sx={{ marginBottom: 3 }}>
      <CardContent>
        <Typography variant="h6">MCP Wallet Balance</Typography>
        <Typography variant="h4" color="primary" gutterBottom>
          ₹ {balance.toLocaleString()}
        </Typography>

        <Stack spacing={2} direction="column">
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            fullWidth
          />
          <TextField
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            select
            fullWidth
          >
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
          </TextField>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={!isValidAmount || loading}
            >
              Add Funds
            </Button>
            <TextField
              label="Partner ID"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={handleDistribute}
              disabled={!isValidAmount || loading || !partnerId}
            >
              Distribute to Partner
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
