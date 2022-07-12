import { Box, Typography, Stack, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
function ThreadsListNav({ handleOpenDelete, openDelete }) {
  const navigate = useNavigate();
  function goHome() {
    navigate(`/`);
  }

  const createMessage = useCallback(() => navigate(`/threads/new`), [navigate]);

  return (
    <Stack sx={{ width: "100%", position: "fixed", top: 60, zIndex: 5 }}>
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
            onClick={goHome}
          >
            Home
          </Button>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 20, padding: 1, color: "#FFFFFF" }}>
            Inbox
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: "right", color: `#E6464C` }}>
        <Button
          color={"primary"}
          onClick={createMessage}
          sx={{ fontSize: 12 }}
          endIcon={<SendIcon />}
        >
          New
        </Button>

        {openDelete ? (
          <Button
            onClick={handleOpenDelete}
            sx={{ fontSize: 12, color: `#E6464C` }}
            endIcon={<CancelIcon />}
          >
            Cancel
          </Button>
        ) : (
          <Button
            onClick={handleOpenDelete}
            sx={{ fontSize: 12, color: `#E6464C` }}
            endIcon={<RemoveCircleIcon />}
          >
            Delete
          </Button>
        )}
      </Box>
    </Stack>
  );
}

export default ThreadsListNav;
