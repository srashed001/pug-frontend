import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteThread } from "../store/threads/threadsSlice";
import { formatDistanceToNowStrict } from "date-fns";
import {
  CardActionArea,
  AvatarGroup,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import DeleteThreadButton from "./DeleteThreadButton";

function Thread({ thread, openDelete }) {
  const my = useSelector((state) => state.my);
  const dispatch = useDispatch();

  function dispatchDeleteThread() {
    const data = {
      threadId: thread.id,
      username: my.username,
    };
    dispatch(deleteThread(data));
  }

  if (!thread.lastMessage) return null;

  return (
    <Box sx={{ display: "inline-flex", padding: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {thread.party.length > 2 ? (
          <AvatarGroup max={3} spacing={35}>
            {thread.party.map((user) => {
              if (user.username === my.username) return null;
              return (
                <Avatar
                  sx={{ backgroundColor: "white", boxShadow: 3 }}
                  key={user.username}
                  src={user.profileImg}
                />
              );
            })}
          </AvatarGroup>
        ) : (
          thread.party.map((user) =>
            user.username === my.username ? null : (
              <Avatar
                key={user.username}
                sx={{ height: 56, width: 56, boxShadow: 2 }}
                src={user.profileImg}
              />
            )
          )
        )}
      </Box>
      <CardActionArea
        disabled={openDelete}
        component={Link}
        to={`/threads/t/${thread.id}`}
      >
        <Box sx={{ width: { xs: "80%", sm: "90%" }, paddingLeft: 1 }}>
          <Box>
            {thread.party.map((user, i, arr) =>
              user.username === my.username ? null : (
                <Typography
                  key={user.username}
                  sx={{ fontSize: { xs: 14, sm: 16 } }}
                  component="span"
                >
                  <strong>{`${user.firstName} ${user.lastName}${
                    i < arr.length - 1 ? ", " : ""
                  }`}</strong>
                </Typography>
              )
            )}
          </Box>
          <Typography noWrap sx={{ fontSize: { xs: 12, sm: 14 }, width: 100 }}>
            {thread.lastMessage.message}
          </Typography>
          <Typography
            sx={{ fontSize: { xs: 12, sm: 14 }, color: "rgba(22, 26, 29, .7)" }}
          >
            {formatDistanceToNowStrict(new Date(thread.lastMessage.timestamp))}
          </Typography>
        </Box>
      </CardActionArea>
      <Box>
        {openDelete ? (
          <DeleteThreadButton
            thread={thread}
            deleteThread={dispatchDeleteThread}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export default Thread;
