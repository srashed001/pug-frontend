import { Button, Stack, Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import RelationshipListSelect from "./RelationshipListSelect";
import { useNavigate } from "react-router-dom";

function RelationshipListNav({ username, control }) {
  const navigate = useNavigate();
  function returnToUser() {
    navigate(`/users/u/${username}`);
  }

  return (
    <Stack
      sx={{
        backgroundColor: "#F24346",
        position: "fixed",
        top: "3.5rem",
        zIndex: "10",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          backgroundColor: "#F24346",
          width: "100%",
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            sx={{ color: "#FFFFFF", marginX: 1 }}
            startIcon={<ArrowBackIosIcon />}
            onClick={returnToUser}
          >
            {username}
          </Button>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 20, padding: 1, color: "#FFFFFF" }}>
            Relationships
          </Typography>
        </Box>
      </Box>
      <RelationshipListSelect control={control} />
    </Stack>
  );
}

export default RelationshipListNav;
