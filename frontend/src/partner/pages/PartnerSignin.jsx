import React, { useState } from "react";
import { SignIn, SignedIn } from "@clerk/clerk-react";
import { Typography, Box, TextField } from "@mui/material";
import PartnerRedirector from "./PartnerRedirector";

const PartnerSignin = () => {
  const [name, setName] = useState("");

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={3}
    >
      <Typography variant="h5">Please sign in to continue</Typography>

      {/* Optional name field */}
      <TextField
        label="Your Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ width: 300 }}
      />

      {/* Clerk Sign-in component */}
      <SignIn path="/partner/signin" redirectUrl="/partner/dashboard" />

      {/* Handles redirect after sign-in */}
      <PartnerRedirector />
    </Box>
  );
};

export default PartnerSignin;
