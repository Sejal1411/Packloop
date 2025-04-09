import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';

const MCPDashboard = () => {
  const [stats, setStats] = useState({
    walletBalance: 0,
    totalEarnings: 0,
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
    walletBalance = 0,
    totalEarnings = 0,
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
      <Typography variant="h4" gutterBottom>
        MCP Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Wallet Balance & Earnings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Wallet Balance
              </Typography>
              <Typography variant="h5" gutterBottom>
                ₹ {walletBalance.toLocaleString()}
              </Typography>

              {/* <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Earnings
              </Typography> */}
              {/* <Typography variant="h6">₹ {totalEarnings.toLocaleString()}</Typography> */}
            </CardContent>
          </Card>
        </Grid>

        {/* Total Partners + Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Partners
              </Typography>
              <Typography variant="h5" gutterBottom>
                {totalPartners}
              </Typography>

              <Typography variant="body2">Active: {activePartners}</Typography>
              <Typography variant="body2">Inactive: {inactivePartners}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Orders + Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h5" gutterBottom>
                {totalOrders}
              </Typography>

              <Typography variant="body2">Completed: {completedOrders}</Typography>
              <Typography variant="body2">Pending: {pendingOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default MCPDashboard;
