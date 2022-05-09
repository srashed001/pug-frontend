// import { useContext } from "react"

import { useEffect, useState } from "react";
import { TOKEN_STORAGE_ID } from "../App";
import useLocalStorage from "../hooks/useLocalStorage";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../api/secretKey";
import PugApi from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialMy, resetMyStatus } from "../store/my/mySlice";
import UserCard from "../users/UserCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { fetchThreads } from "../store/threads/threadsSlice";

function Homepage() {
  const [token] = useLocalStorage(TOKEN_STORAGE_ID);
  const [fetched, setFetched] = useState(false)
  const myStatus = useSelector((state) => state.my.status);
  const my = useSelector(state => state.my)
  const games = useSelector(state => state.games.entities)
  const users = useSelector(state => state.users.entities)
  const error = useSelector(state => state.my.error)
  const dispatch = useDispatch();
  const threads = useSelector(state => state.threads.entities)


  function getThreads(){
      dispatch(fetchThreads(my.username))

  }

  function getMessages(){
      dispatch(fetch)
  }

  useEffect(()=> {
      return () => {
          dispatch(resetMyStatus())
          setFetched(false)
      }
  }, [])


  useEffect(function loadUserInfo() {
    console.log(`loadUserInfo useEffect`);
    if (token) {
      try {
        let { username } = jwt.verify(token, SECRET_KEY);
        PugApi.token = token;
        if (myStatus === "idle") {
            dispatch(fetchInitialMy(username));
            setFetched(true)
        } 
      } catch (err) {
        console.error("App loadUserInfo: problem loading", err);
      }
    }
  }, [dispatch, myStatus, token]);

  if (!token)
    return (
      <div>
        <h1>Homepage</h1>
        <h3>Not currently logged in</h3>
      </div>
    );

    if (myStatus === "loading") {
        return <LoadingSpinner />;
      } else if (myStatus === "failed") {
        return <div>{error}</div>;
      } else if (myStatus === "succeeded" && fetched) {


        console.log(threads)

  return (
      <div>
          <h1>Homepage</h1>
          <button onClick={getThreads}>get threads</button>
          <h3>current user: {my.username}</h3>
          <UserCard user={users[my.username]} />
          <ul>
              Games hosted pending:
              {my.gamesHostedPending.map(id => (
                  <li key={id}>{games[id].title}</li>
              ))}
          </ul>
          <ul>
              Games hosted resolved:
              {my.gamesHostedResolved.map(id => (
                  <li key={id}>{games[id].title}</li>
              ))}
          </ul>
          <ul>
              Games joined pending:
              {my.gamesJoinedPending.map(id => (
                  <li key={id}>{games[id].title}</li>
              ))}
          </ul>
          <ul>
              Games joined resolved:
              {my.gamesJoinedResolved.map(id => (
                  <li key={id}>{games[id].title}</li>
              ))}
          </ul>

      </div>
  );
              }
}

export default Homepage;
