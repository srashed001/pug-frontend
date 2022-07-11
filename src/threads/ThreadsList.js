import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchThreads,
  selectAllThreads,
} from "../store/threads/threadsSlice";
import Thread from "./Thread";
import { Divider, Stack } from "@mui/material";
import ThreadsListNav from "./ThreadsListNav";

function ThreadsList() {
  const my = useSelector((state) => state.my);
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
    if (threadStatus === "idle" && my.status === "succeeded") {
      dispatch(fetchThreads(my.username));
    }
  }, [dispatch, my.status, my.username, threadStatus]);

  useEffect(() => {
    setTransition(() => setResource(threads));
  }, [threads]);

  if (threadStatus === "failed") {
    return <div>{error}</div>;
  } else {
    console.log(resource)
    
    return (
      <Stack mt={12}>
        <ThreadsListNav
          handleOpenDelete={toggleOpenDelete}
          openDelete={openDelete}
        />

        <Stack
          sx={{padding: 1 }}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {resource.map((thread) => (
            <Thread key={thread.id} thread={thread} openDelete={openDelete} />
          ))}
        </Stack>
      </Stack>
    );

  }
}

export default ThreadsList;
