import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MCPRoutes from './routes/MCPRoutes.jsx';
import Header from './shared/components/Header.jsx';

const App = () => {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: '80px' }}> {/* Adjust this based on your Header height */}
        <Routes>
          <Route path="/mcp/*" element={<MCPRoutes />} />
          <Route path="*" element={<Navigate to="/mcp/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
