import { Card, CardContent, Typography, Box } from '@mui/material';

const DashboardCard = ({ title, value }) => {
  return (
    <Card sx={{ minWidth: 250, boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
