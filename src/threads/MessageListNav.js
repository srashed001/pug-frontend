import {
  Box,
  Avatar,
  AvatarGroup,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CancelIcon from "@mui/icons-material/Cancel";

function MessagesListNav({ thread, openDelete, handleOpenDelete }) {
  const myUsername = useSelector((state) => state.my.username);
  const navigate = useNavigate();

  const party = thread.party.filter((user) => user.username !== myUsername);

  return (
    <Stack
      sx={{
        position: "fixed",
        top: "3.5rem",
        zIndex: 20,
        width: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{ display: "inline-flex", boxShadow: 4, padding: 1, paddingTop: 2 }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIosIcon />}
            onClick={() => navigate(`/threads/inbox`)}
          >
            inbox
          </Button>
        </Box>
        <Box sx={{ marginX: 2 }}>
          {thread.party.length > 2 ? (
            <AvatarGroup max={3} spacing={20}>
              {party.map((user) => (
                <Avatar
                key={user.username}
                  sx={{ backgroundColor: "#ffffff", boxShadow: 3 }}
                  src={user.profileImg}
                />
              ))}
            </AvatarGroup>
          ) : (
            party.map((user) => <Avatar key={user.username} src={user.profileImg} />)
          )}
        </Box>
        <Box>
          {party.map((user, i, arr) => (
            <Typography key={user.username} sx={{ fontSize: { xs: 14 } }} component="span">
              <strong>{`${user.firstName} ${user.lastName}${
                i < arr.length - 1 ? ", " : ""
              }`}</strong>
            </Typography>
          ))}
        </Box>
      </Box>
      <Box sx={{ textAlign: "right" }}>
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

export default MessagesListNav;
