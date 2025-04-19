import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Stack } from "@mui/material";

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <SignedOut>
        <Typography variant="h4" gutterBottom>
          Welcome to Packloop
        </Typography>
        <Typography variant="h6" gutterBottom>
          Click on a role to proceed
        </Typography>
        <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
          <Button variant="contained" onClick={() => navigate("/mcp")}>
            Register as MCP
          </Button>
          <Button variant="outlined" onClick={() => navigate("/partner")}>
            Register as Partner
          </Button>
        </Stack>
      </SignedOut>

      <SignedIn>
        <UserButton />
        <Typography sx={{ mt: 3 }}>You're signed in!</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/mcp/dashboard")}>
          Go to Dashboard
        </Button>
      </SignedIn>
    </div>
  );
}
