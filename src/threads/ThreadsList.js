import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreads, resetThreadStatus } from "../store/threads/threadsSlice";
import LoadingSpinner from "../common/LoadingSpinner";
import Thread from "./Thread";

function ThreadsList() {
  const my = useSelector((state) => state.my);
  const threads = useSelector((state) => state.threads.entities);
  const threadIds = useSelector((state) => state.threads.ids);
  const threadStatus = useSelector((state) => state.threads.status);
  const error = useSelector((state) => state.threads.error);
  const [fetched, setFetched] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetThreadStatus());
      setFetched(false)
    };
  }, []);

  useEffect(() => {
    if (threadStatus === "idle" && my.status === 'succeeded') {
      dispatch(fetchThreads(my.username));
      setFetched(true)
    }
  }, [dispatch, my.status, my.username, threadStatus]);

  if (threadStatus === "loading") {
    return <LoadingSpinner />;
  } else if (threadStatus === "failed") {
    return <div>{error}</div>;
  } else if (threadStatus === "succeeded" && fetched) {
    console.log(threads);

    return (
      <div>
        <h1>threads</h1>
        {threadIds.map((id) => (
          <Thread key={id} thread={threads[id]} />
        ))}
      </div>
    );
  }
}

export default ThreadsList;
