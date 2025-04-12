import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from '../partner/pages/Dashboard';
import McpForm from '../mcp/pages/McpForm';
import SignIn from '../shared/components/SignInPage';
import PartnerSignin from '../partner/pages/PartnerSignin';


const PartnerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PartnerSignin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/partner/orders" element={<Orders />} />
      <Route path="/partner/wallet" element={<Wallet />} />
      <Route path="/partner/tracking" element={<Tracking />} />
      <Route path="/partner/notifications" element={<Notifications />} />
      <Route path="/partner/performance" element={<Performance />} /> */}
      <Route path="*" element={<Navigate to="/mcp/dashboard" replace />} />
    </Routes>
  );
};

export default PartnerRoutes;
