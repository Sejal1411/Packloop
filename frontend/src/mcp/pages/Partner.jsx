import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Snackbar, Alert, Box,
} from '@mui/material';
import PartnerCard from '../components/PartnerCard';
import axios from 'axios';

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    paymentType: 'commission',
    paymentAmount: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchPartners = async () => {
    try {
      const res = await axios.get('/api/mcp/partners');
      setPartners(res.data.partners || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleOpenDialog = (partner = null) => {
    if (partner) {
      setEditMode(true);
      setCurrentPartner(partner);
      setFormData({
        name: partner.name,
        email: partner.email,
        role: partner.role,
        paymentType: partner.paymentType,
        paymentAmount: partner.paymentAmount,
      });
    } else {
      setEditMode(false);
      setFormData({ name: '', email: '', role: '', paymentType: 'commission', paymentAmount: '' });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(`/api/mcp/partners/${currentPartner._id}`, formData);
        setSnackbar({ open: true, message: 'Partner updated successfully', severity: 'success' });
      } else {
        await axios.post('/api/mcp/partners', formData);
        setSnackbar({ open: true, message: 'Partner added successfully', severity: 'success' });
      }
      fetchPartners();
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error saving partner', severity: 'error' });
    }
  };

  const handleDelete = async (partnerId) => {
    try {
      await axios.delete(`/api/mcp/partners/${partnerId}`);
      setSnackbar({ open: true, message: 'Partner deleted successfully', severity: 'success' });
      fetchPartners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Pickup Partners</Typography>

      <Box mb={2}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => handleOpenDialog()}>Add Partner</Button>
        <Button variant="outlined" sx={{ mr: 2 }} disabled={!partners.length}>Edit Partner</Button>
        <Button variant="outlined" onClick={() => alert('Tracking view not implemented yet')}>Track Partners</Button>
      </Box>

      <Grid container spacing={2}>
        {partners.map((partner) => (
          <Grid item xs={12} md={6} key={partner._id}>
            <PartnerCard
              partner={partner}
              onEdit={() => handleOpenDialog(partner)}
              onDelete={() => handleDelete(partner._id)}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
        <DialogContent>
          {['name', 'Phone no.', 'role', ].map((field) => (
            <TextField
              key={field}
              label={field[0].toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              fullWidth
              margin="normal"
            />
          ))}
          <TextField
            select
            label="Payment Type"
            value={formData.paymentType}
            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
            fullWidth
            margin="normal"
          >
            <option value="commission">Commission per order</option>
            <option value="fixed">Fixed Payment</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Add'}
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

export default Partner;
