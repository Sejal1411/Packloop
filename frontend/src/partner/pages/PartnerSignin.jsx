import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Typography, Box, Button } from "@mui/material";

const PartnerSignin = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={3}
     >
      {/* Title */}
      <Typography variant="h5">
        <SignedOut>Partner Sign In</SignedOut>
        <SignedIn>Welcome Partner!</SignedIn>
      </Typography>

      {/* Clerk Sign In Button */}
      <SignedOut>
        <SignInButton mode="modal" redirectUrl="/partner/dashboard">
          <Button variant="contained" color="primary">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>

      {/* Clerk User Profile Button */}
      <SignedIn>
        <UserButton/>
      </SignedIn>
    </Box>
  );
};

export default PartnerSignin;
