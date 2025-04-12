import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import McpForm from '../mcp/pages/McpForm';
import McpDashboard from '../mcp/pages/Dashboard';
import PartnerPage from '../mcp/pages/Partner'; 
import Orders from '../mcp/pages/Orders';         
import Wallet from '../mcp/pages/Wallet';          

const MCPRoutes = () => {
  return (
    <Routes>
      {/* Show McpForm when user goes to /mcp explicitly */}
      <Route path="/" element={<McpForm />} /> 
      <Route path="dashboard" element={<McpDashboard />} />
      <Route path="partners" element={<PartnerPage />} />
      <Route path="orders" element={<Orders />} />
      <Route path="wallet" element={<Wallet />} />

      {/* fallback route */}
      <Route path="*" element={<Navigate to="/mcp/dashboard" replace />} />
    </Routes>
  );
};

export default MCPRoutes;
