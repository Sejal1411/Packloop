import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button, TextField, Stack, MenuItem, Table,
  TableHead, TableBody, TableCell, TableRow, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';

const WalletCard = ({
  balance = 0,
  onAddFunds,
  transactions = [],
  onDistributeFunds,
  currentUserId
}) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [partnerId, setPartnerId] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openTxnDialog, setOpenTxnDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = amount && !isNaN(amount) && Number(amount) > 0;

  const handleSubmit = async () => {
    setLoading(true);
    partnerId
      ? await onDistributeFunds(Number(amount), partnerId)
      : await onAddFunds(Number(amount), paymentMethod);
    setAmount('');
    setPartnerId('');
    setOpenAddDialog(false);
    setLoading(false);
  };

  const ActionCard = ({ title, buttonText, onClick, variant = 'contained' }) => (
    <Grid item xs={12} md={4}>
      <Card sx={{ width: 400, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <Button variant={variant} onClick={onClick}>{buttonText}</Button>
        </CardContent>
      </Card>
    </Grid>
  );

  const getType = (txn) =>
    txn.from?._id === currentUserId ? 'Debit' : txn.to?._id === currentUserId ? 'Credit' : '—';

  return (
    <Grid container spacing={3}>
      {/* Balance Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ width: 400, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardContent>
            <Typography variant="h6">Total Balance</Typography>
            <Typography variant="h4" color="primary">
              ₹ {balance.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Add Funds Button */}
      <ActionCard title="Add Funds" buttonText="Add" onClick={() => setOpenAddDialog(true)} />

      {/* View Transactions Button */}
      <ActionCard title="Transaction History" buttonText="View" onClick={() => setOpenTxnDialog(true)} />

      {/* Add Money Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Money to Wallet</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />
            <TextField
              label="Payment Method"
              value={paymentMethod}
              select
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {['UPI', 'Bank Transfer', 'Cash'].map((method) => (
                <MenuItem key={method} value={method}>{method}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Partner ID (optional)"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button variant="contained" disabled={!isValid || loading} onClick={handleSubmit}>
            {partnerId ? 'Distribute' : 'Add Funds'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transaction History Dialog (Slide up) */}
      <Dialog
        open={openTxnDialog}
        onClose={() => setOpenTxnDialog(false)}
        fullWidth
        maxWidth="md"
        keepMounted
      >
        <DialogTitle>Transaction History</DialogTitle>
        <DialogContent dividers>
          {transactions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No transactions yet.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn._id}>
                    <TableCell>{getType(txn)}</TableCell>
                    <TableCell>{txn.amount}</TableCell>
                    <TableCell>{txn.from?.name || '—'}</TableCell>
                    <TableCell>{txn.to?.name || '—'}</TableCell>
                    <TableCell>{new Date(txn.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTxnDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default WalletCard;
