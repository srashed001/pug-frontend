import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUserById } from "../store/users/usersSlice";
import { formatDistanceToNowStrict } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";

function MessageTo({ message, deleteMessage, openDelete }) {
  const user = useSelector((state) =>
    selectUserById(state, message.messageFrom)
  );

  return (
    <Stack>
      <Box sx={{ display: "inline-flex", paddingX: 1 }}>
        {openDelete && (
          <Box>
            <IconButton
              onClick={deleteMessage}
              color="error"
              sx={{ alignSelf: "end" }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
        <Box sx={{ marginX: 1 }}>
          <Avatar src={user.profileImg} />
        </Box>
        <Box
          sx={{
            maxWidth: "50%",
            padding: 1,
            paddingX: 3,
            borderRadius: 5,
            boxShadow: 3,
          }}
        >
          <Typography
            component={"pre"}
            sx={{ fontSize: { xs: 14 }, textAlign: "left" }}
          >
            {message.message}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{ fontSize: 10, color: "#B1A7A6", marginLeft: 10, marginTop: 1 }}
      >
        {formatDistanceToNowStrict(new Date(message.createdOn), "Pp")}
      </Typography>
    </Stack>
  );
}

export default MessageTo;
