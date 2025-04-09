import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ size = 60, fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...(fullScreen && {
          height: '100vh',
        }),
        ...(fullScreen
          ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1300, backgroundColor: 'rgba(255,255,255,0.8)' }
          : { padding: 4 }),
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingSpinner;
