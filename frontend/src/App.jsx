import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MCPRoutes from './routes/MCPRoutes.jsx';
import PartnerRoutes from './routes/PartnerRoutes.jsx';
import Header from './shared/components/Header.jsx';
import SignIn from './shared/components/SignInPage.jsx';

const App = () => {
  return (
    <Router>
      <div style={{ paddingTop: '80px' }}>
         <Header />
          <Routes>
           <Route path="/" element={<SignIn />} />
           <Route path="/mcp/*" element={<MCPRoutes />} />
           <Route path="/partner/*" element={<PartnerRoutes />} />

           <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;
