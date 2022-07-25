import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreads, selectAllThreads } from "../store/threads/threadsSlice";
import Thread from "./Thread";
import { Divider, Stack, Typography } from "@mui/material";
import ThreadsListNav from "./ThreadsListNav";
import { setTab } from "../store/my/mySlice";

function ThreadsList() {
  const myUsername = useSelector((state) => state.my.username);
  const threads = useSelector(selectAllThreads);
  const threadStatus = useSelector((state) => state.threads.status);
  const error = useSelector((state) => state.threads.error);

  const [openDelete, setOpenDelete] = useState(false);
  const [resource, setResource] = useState([]);
  const [isPending, setTransition] = useTransition();

  const dispatch = useDispatch();

  const toggleOpenDelete = () => {
    setOpenDelete((state) => !state);
  };

  useEffect(() => {
    dispatch(setTab(0));
  });

  useEffect(() => {
    if (myUsername && threadStatus === "idle") {
      dispatch(fetchThreads(myUsername));
    }
  }, [dispatch, myUsername, threadStatus]);

  useEffect(() => {
    setTransition(() => setResource(threads));
  }, [threads]);

  return (
    <Stack mt={12}>
      <ThreadsListNav
        handleOpenDelete={toggleOpenDelete}
        openDelete={openDelete}
      />

      <Stack
        sx={{ padding: 1 }}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        {resource.length ? (
          resource.map((thread) => (
            <Thread key={thread.id} thread={thread} openDelete={openDelete} />
          ))
        ) : (
          <Typography sx={{ fontSize: 20, textAlign: "center" }}>
            No messages
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

export default ThreadsList;
