import { useEffect, useRef, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchMessages, resetThreadStatus, selectThreadById } from "../store/threads/threadsSlice";
import LoadingSpinner from "../common/LoadingSpinner";
import Message from "./Message";
import MessagesListNav from "./MessageListNav";
import { Grid, Stack, Box } from "@mui/material";
import MessageBottomNav from "./MessageBottomNav";
import MessageFrom from "./MessageFrom";

function MessagesList() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const threadStatus = useSelector((state) => state.threads.status);
  const thread = useSelector((state) => selectThreadById(state, threadId));
  const my = useSelector((state) => state.my);
  const error = useSelector((state) => state.threads.error);
  const [resource, setResource] = useState({
    id: threadId,
    lastMessage: { message: "", timestamp: "2022-01-01T00:00:00" },
    messages: { ids: [], entities: {} },
    party: [],
  });
  const [isPending, setTransition] = useTransition();
  const [openDelete, setOpenDelete] = useState(false)

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
    if (my.status === "succeeded") {
      dispatch(fetchMessages({ username: my.username, threadId }));
    }

    return () => dispatch(resetThreadStatus())
  }, [dispatch, my.status, my.username, threadId]);

  useEffect(() => {
    setTransition(() => setResource((state) => ({ ...state, ...thread })));
  }, [thread]);

  if (threadStatus === "failed") {
    return <div>{error}</div>;
  } else {
    console.log(resource, openDelete);

    return (
      <Stack>
        <MessagesListNav thread={thread} handleOpenDelete={toggleOpenDelete} openDelete={openDelete} />
        <Stack
          sx={{ marginTop: 16, marginBottom: 6 }}
          spacing={1}
        >
          {Object.values(resource.messages.entities).map((message) => (
            <Message key={message.id} message={message} threadId={threadId} openDelete={openDelete} />
          ))}
          <Box ref={scrollRef}></Box>
        </Stack>
        <MessageBottomNav />
      </Stack>
    );
  }
}

export default MessagesList;
