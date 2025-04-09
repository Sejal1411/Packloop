import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Project Name */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            Packloop
          </Link>
        </Typography>

        {/* Tabs (can be buttons or Links) */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/mcp/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/mcp/wallet">
            Wallet
          </Button>
          <Button color="inherit" component={Link} to="/mcp/orders">
            Orders
          </Button>
          <Button color="inherit" component={Link} to="/mcp/partners">
            Partners
          </Button>
          <Button color="inherit" component={Link} to="/mcp/notifications">
            Notifications
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
