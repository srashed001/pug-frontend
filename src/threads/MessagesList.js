import { useEffect, useRef, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchMessages,
  resetThreadStatus,
  selectThreadById,
} from "../store/threads/threadsSlice";
import Message from "./Message";
import MessagesListNav from "./MessageListNav";
import { Stack, Box, Typography } from "@mui/material";
import MessageBottomNav from "./MessageBottomNav";

function MessagesList() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const thread = useSelector((state) => selectThreadById(state, threadId));
  const myStatus = useSelector((state) => state.my.status);
  const myUsername = useSelector((state) => state.my.username);
  const [resource, setResource] = useState({
    id: threadId,
    lastMessage: { message: "", timestamp: "2022-01-01T00:00:00" },
    messages: { ids: [], entities: {} },
    party: [],
  });
  const [isPending, setTransition] = useTransition();
  const [openDelete, setOpenDelete] = useState(false);

  const toggleOpenDelete = () => {
    setOpenDelete((state) => !state);
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  useEffect(() => {
    if (myStatus === "succeeded") {
      dispatch(fetchMessages({ username: myUsername, threadId }));
    }

    return () => dispatch(resetThreadStatus());
  }, [dispatch, myStatus, myUsername, threadId]);

  useEffect(() => {
    setTransition(() => setResource((state) => ({ ...state, ...thread })));
  }, [thread]);

  return (
    <Stack>
      <MessagesListNav
        thread={thread}
        handleOpenDelete={toggleOpenDelete}
        openDelete={openDelete}
      />
      <Stack
        sx={{ marginTop: 16, marginBottom: 6, display: "flex" }}
        spacing={1}
      >
        {Object.values(resource.messages.entities).length ? (
          Object.values(resource.messages.entities).map((message) => (
            <Message
              key={message.id}
              message={message}
              threadId={threadId}
              openDelete={openDelete}
            />
          ))
        ) : (
          <Typography sx={{ fontSize: 20, textAlign: "center" }}>
            No messages
          </Typography>
        )}
        <Box ref={scrollRef}></Box>
      </Stack>
      <MessageBottomNav />
    </Stack>
  );
}

export default MessagesList;
