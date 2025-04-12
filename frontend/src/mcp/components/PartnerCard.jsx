import React from 'react';
import { Card, CardContent, Typography, Stack, Button } from '@mui/material';

const PartnerCard = ({ partner, onEdit, onDelete }) => {
  const {
    name,
    email,
    role,
    paymentType,
    paymentAmount,
    isActive,
  } = partner;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>

        <Stack direction="row" spacing={2} mt={1}>
          <Typography variant="body2"><strong>Role:</strong> {role}</Typography>
          <Typography variant="body2">
            <strong>Payment:</strong> {paymentType === 'commission' ? `${paymentAmount}%` : `₹${paymentAmount}`}
          </Typography>
          <Typography
            variant="body2"
            color={isActive ? 'green' : 'red'}
          >
            ● {isActive ? 'Active' : 'Inactive'}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} mt={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(partner)}
          >
            ✏️ Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => onDelete(partner._id)}
          >
            🗑️ Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PartnerCard;
