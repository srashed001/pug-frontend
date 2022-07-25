import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUserById } from "../store/users/usersSlice";
import { formatDistanceToNowStrict } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";

function MessageFrom({ message, deleteMessage, openDelete }) {
  const user = useSelector((state) =>
    selectUserById(state, message.messageFrom)
  );

  return (
    <Stack alignItems={"flex-end"}>
      <Box
        sx={{ display: "inline-flex", paddingX: 1, justifyContent: "flex-end" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            maxWidth: "60%",
            padding: 1,
            paddingX: 3,
            borderRadius: 5,
            boxShadow: 3,
            backgroundColor: "#660708",
            color: "#ffffff",
          }}
        >
          <Typography sx={{ fontSize: { xs: 14 }, textAlign: "right" }}>
            {message.message}
          </Typography>
        </Box>
        <Box sx={{ marginX: 1 }}>
          <Avatar src={user.profileImg} />
        </Box>
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
      </Box>
      <Typography
        sx={{ fontSize: 10, color: "#B1A7A6", marginTop: 1, marginRight: 10 }}
      >
        {formatDistanceToNowStrict(new Date(message.createdOn), "Pp")}
      </Typography>
    </Stack>
  );
}

export default MessageFrom;
