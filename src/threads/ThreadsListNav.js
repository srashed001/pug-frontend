import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
function ThreadsListNav({ handleOpenDelete, openDelete }) {
    const navigate = useNavigate()

    const createMessage= useCallback(() => navigate(`/threads/new`), [navigate])

  return (
    <Stack sx={{ width: "100%", position: "fixed", top: 60, zIndex: 5 }}>
      <Typography
        elevation={3}
        component={Paper}
        sx={{ fontSize: { xs: 16, sm: 20 }, padding: 1 }}
      >
        Messages
      </Typography>
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
