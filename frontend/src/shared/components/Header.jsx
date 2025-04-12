import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

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

        {/* Show only when signed in */}
      
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


  <SignedOut>
    <Box sx={{ marginLeft: 'auto' }} />
  </SignedOut>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
