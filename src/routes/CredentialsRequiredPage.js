import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CredentialsRequiredPage() {
  const navigate = useNavigate();

  const login = () => {
    navigate("/login");
  };
  const signup = () => {
    navigate("/signup");
  };

  return (
    <Stack className="publicHomepage" alignItems={"center"}>
      <Box sx={{width: '80%', textAlign: 'center', marginTop: 10,  paddingY: 3, backgroundColor: '#FFFFFF', borderRadius: 2, boxShadow: 3}}>
        <Typography sx={{ fontSize: 26 }}>Foul: Unathorized</Typography>
        <Typography sx={{ fontSize: 24, marginBottom: 3 }}>Please login or signup</Typography>
        <Button sx={{marginRight: 1}}  onClick={login}>
          login
        </Button>
        <Button  onClick={signup}>
          signup
        </Button>
      </Box>
    </Stack>
  );
}

export default CredentialsRequiredPage;
