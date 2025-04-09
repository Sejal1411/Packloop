import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MCPDashboard from '../mcp/pages/Dashboard';
// import PartnerPage from '../mcp/pages/Partner'; 
import Orders from '../mcp/pages/Orders';         
// import Wallet from '../mcp/pages/Wallet';          
// import Notifications from '../mcp/pages/Notifications';
// import Reports from '../mcp/pages/Reports';      

const MCPRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<MCPDashboard />} />
      {/* <Route path="/partners" element={<PartnerPage />} /> */}
      <Route path="/orders" element={<Orders />} />
      {/* <Route path="/wallet" element={<Wallet />} /> */}
      {/* <Route path="/notifications" element={<Notifications />} /> */}
      {/* <Route path="/reports" element={<Reports />} /> */}
      {/* fallback route redirects to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default MCPRoutes;
