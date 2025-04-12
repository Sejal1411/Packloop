import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const fetchDashboardData = async () => {
  const { getToken } = useAuth();
  const token = await getToken(); // 👈 this gives you the token

  const res = await axios.get('http://localhost:5000/api/partner/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
