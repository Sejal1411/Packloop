import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Typography, Container, Grid, CircularProgress,
  Button, Box, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Fab,
} from '@mui/material';
import OrderAssignment from '../components/OrderAssignment';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ orderId: '', partnerId: '', partnerName: '' });

  const fetchOrdersAndPartners = async () => {
    setLoading(true);
    try {
      const [ordersRes, partnersRes] = await Promise.all([
        axios.get('/api/mcp/orders'),
        axios.get('/api/mcp/partners'),
      ]);

      setOrders(ordersRes.data.orders || []);
      setPartners(partnersRes.data.partners || partnersRes.data || []);
    } catch (err) {
      console.error('Error fetching orders or partners:', err);
      setOrders([]);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndPartners();
  }, []);

  const fetchReport = async (type) => {
    try {
      const res = await axios.get(`/api/mcp/orders/report?type=${type}`);
      setReport(res.data.report);
      setReportType(type);
      setOpenReportDialog(true); // open the dialog
    } catch (err) {
      console.error('Error fetching report:', err);
      setSnackbar({ open: true, message: 'Failed to fetch report.', severity: 'error' });
    }
  };
  

  const handleAssign = async (orderId, partnerId) => {
    try {
      await axios.post(`/api/mcp/orders/${orderId}/assign`, { orderId, partnerId });
      fetchOrdersAndPartners();
      setSnackbar({ open: true, message: 'Order assigned successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error assigning order:', err);
      setSnackbar({ open: true, message: 'Failed to assign order.', severity: 'error' });
    }
  };

  const handleAutoAssign = async (orderId) => {
    try {
      await axios.post('/api/mcp/orders/auto-assign', { orderId });
      fetchOrdersAndPartners();
      setSnackbar({ open: true, message: 'Order auto-assigned!', severity: 'success' });
    } catch (err) {
      console.error('Auto-assign error:', err);
      setSnackbar({ open: true, message: 'No available partner for auto-assign.', severity: 'error' });
    }
  };

  const handleDialogSubmit = () => {
    if (formData.orderId && formData.partnerId) {
      handleAssign(formData.orderId, formData.partnerId);
      setFormData({ orderId: '', partnerId: '', partnerName: '' });
      setOpenDialog(false);
    } else {
      setSnackbar({ open: true, message: 'Please fill required fields.', severity: 'warning' });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>

      {/* Optional Report buttons */}
      <Box mb={3}>
        <Button onClick={() => fetchReport('daily')} variant="outlined" sx={{ mr: 1 }}>
          Daily Report
        </Button>
        <Button onClick={() => fetchReport('weekly')} variant="outlined" sx={{ mr: 1 }}>
          Weekly Report
        </Button>
        <Button onClick={() => setOpenDialog(true)} variant="outlined">
          Assign Order
        </Button>
      </Box>

      {report && (
        <Box mb={3}>
          <Typography variant="subtitle1">Report:</Typography>
          <Typography>Total: {report.total}</Typography>
          <Typography>Pending: {report.pending}</Typography>
          <Typography>In Progress: {report.inProgress}</Typography>
          <Typography>Completed: {report.completed}</Typography>
        </Box>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} key={order._id}>
              <OrderAssignment
                order={order}
                partners={partners}
                onAssign={handleAssign}
                onAutoAssign={handleAutoAssign}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Assign Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Order</DialogTitle>
        <DialogContent>
         {['orderId', 'partnerId', 'partnerName'].map((field) => (
         <TextField
          key={field}
          label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          fullWidth
          margin="dense"
          value={formData[field]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogSubmit}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Orders;
