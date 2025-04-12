import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const PartnerRedirector = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      // You can customize logic here if you store the role in Clerk's public metadata
      const role = user?.publicMetadata?.role;

      if (role === "partner") {
        navigate("/partner/dashboard");
      }
    }
  }, [isSignedIn, user, navigate]);

  return null; // No UI needed
};

export default PartnerRedirector;
