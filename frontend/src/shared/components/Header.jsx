import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Header = () => {
  const location = useLocation();
  const hideNavItems = location.pathname === '/' || location.pathname === '/mcp' || location.pathname === '/partner';

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Project Name */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            Packloop
          </Link>
        </Typography>

        {/* Navigation Items & UserButton - shown only if NOT on '/' or '/mcp' */}
        {!hideNavItems && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {['dashboard', 'wallet', 'orders', 'partners', 'notifications'].map((item) => (
              <Button
                key={item}
                color="inherit"
                component={Link}
                to={`/mcp/${item}`}
                sx={{ textTransform: 'capitalize' }}
              >
                {item}
              </Button>
            ))}
            <UserButton />
          </Box>
        )}

        {/* Hide SignOut content too if needed */}
        {!hideNavItems && (
          <SignedOut>
            <Box sx={{ marginLeft: 'auto' }}>
              <SignInButton />
            </Box>
          </SignedOut>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
