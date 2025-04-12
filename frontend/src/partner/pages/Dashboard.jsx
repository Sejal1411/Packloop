import { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    completedOrders: 0,
  });
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  useEffect(() => {
    const getStats = async () => {
      try {
        const token = await getToken();

        const res = await axios.get('/api/partner/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      }
    };

    getStats();
  }, [getToken]);

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <DashboardCard title="Available Orders" value={stats.totalOrders || 0} type="orders" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <DashboardCard title="Earnings" value={`₹${stats.totalEarnings || 0}`} type="earnings" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <DashboardCard title="Completed Tasks" value={stats.completedOrders || 0} type="completed" />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
