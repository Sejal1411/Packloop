import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';

// Reusable StatCard component
const StatCard = ({ title, mainValue, breakdown = [] }) => (
  <Grid item xs={12} md={6}>
    <Card sx={{ width: 400, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {mainValue}
        </Typography>
        {breakdown.map((item, index) => (
          <Typography key={index} variant="body2">
            {item.label}: {item.value}
          </Typography>
        ))}
      </CardContent>
    </Card>
  </Grid>
);

const McpDashboard = () => {
  const [stats, setStats] = useState({
    totalBalance: 0,
    partners: { total: 0, active: 0, inactive: 0 },
    orders: { total: 0, completed: 0, pending: 0 },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/mcp/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const {
    totalBalance = 0,
    partners = {},
    orders = {},
  } = stats;

  const {
    total: totalPartners = 0,
    active: activePartners = 0,
    inactive: inactivePartners = 0,
  } = partners;

  const {
    total: totalOrders = 0,
    completed: completedOrders = 0,
    pending: pendingOrders = 0,
  } = orders;

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h3" gutterBottom>
        MCP Dashboard
      </Typography>

      <Grid container spacing={3}>
        <StatCard
          title="Total Balance"
          mainValue={`₹ ${totalBalance.toLocaleString()}`}
        />
        <StatCard
          title="Total Partners"
          mainValue={totalPartners}
          breakdown={[
            { label: 'Active', value: activePartners },
            { label: 'Inactive', value: inactivePartners },
          ]}
        />
        <StatCard
          title="Total Orders"
          mainValue={totalOrders}
          breakdown={[
            { label: 'Completed', value: completedOrders },
            { label: 'Pending', value: pendingOrders },
          ]}
        />
      </Grid>
    </div>
  );
};

export default McpDashboard;
