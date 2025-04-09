// components/OrderAssignment.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  Button,
  Box,
  Chip,
} from '@mui/material';

const OrderAssignment = ({ order, partners, onAssign, onAutoAssign }) => {
  const [selectedPartner, setSelectedPartner] = React.useState(order.assignedTo || '');

  const handleManualAssign = () => {
    if (!selectedPartner) return;
    onAssign(order._id, selectedPartner);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Assigned':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order ID: {order._id}
        </Typography>

        <Box mb={1}>
          <Chip
            label={`Status: ${order.status}`}
            color={getStatusColor(order.status)}
            variant="filled"
          />
        </Box>

        <Typography variant="body2" gutterBottom>
          {order.details || 'No additional order details'}
        </Typography>

        <Box my={2}>
          <Select
            fullWidth
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Select a Partner</MenuItem>
            {partners.map((partner) => (
              <MenuItem key={partner._id} value={partner._id}>
                {partner.name} ({partner.phone})
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleManualAssign}
            disabled={!selectedPartner}
          >
            Assign Manually
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onAutoAssign(order._id)}
          >
            Auto Assign
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderAssignment;
