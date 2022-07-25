import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  const returnHome = () => {
    navigate("/");
  };

  return (
    <Stack className="publicHomepage" alignItems={"center"} >
      <Box sx={{width: '80%', textAlign: 'center', marginTop: 10,  paddingY: 3, backgroundColor: '#FFFFFF', borderRadius: 2, boxShadow: 3}}>
        <Typography sx={{ fontSize: 26,  }}>Page Not Found</Typography>
        <Button variant="outlined" onClick={returnHome}>
          Return Home
        </Button>
      </Box>
    </Stack>
  );
}

export default NotFoundPage;
