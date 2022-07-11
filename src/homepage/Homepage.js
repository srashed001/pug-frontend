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
import { useNavigate } from "react-router-dom";
import GeoLocationApi from "../api/GeoLocationApi";
import { Stack, Tab, Tabs } from "@mui/material";
import { AirlineSeatIndividualSuite } from "@mui/icons-material";
import { Box } from "@mui/system";
import HomepageGames from "./HomepageGames";
import EditProfile from "../forms/EditProfile";
import InvitesList from "../invites/InvitesList";
import ThreadsList from "../threads/ThreadsList";
import HomepageActivity from "./HomepageActivity";

function Homepage() {
  const token = PugApi.token;
  const [fetched, setFetched] = useState(false);
  const myStatus = useSelector((state) => state.my.status);
  const my = useSelector((state) => state.my);
  const user = useSelector((state) => state.users);
  const games = useSelector((state) => state.games.entities);
  const users = useSelector((state) => state.users.entities);
  const error = useSelector((state) => state.my.error);
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.threads.entities);
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const navigation = {
    0: <HomepageActivity username={my.username} />, 
    1: <HomepageGames />,
    2: <InvitesList />,
    3: <EditProfile />,
  }

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  function getThreads() {
    navigate("/threads/inbox");
  }

  function getInvites() {
    navigate("/invites");
  }

  function editProfile() {
    navigate("/editProfile");
  }

  function getFollowers() {
    navigate(`/relationships/f/${my.username}`);
  }

  function createMessage() {
    navigate(`/threads/new`);
  }

  function createGame() {
    navigate(`/games/new`);
  }

  function getInactiveGames() {
    navigate(`inactive/g`);
  }

  function testGooglePlaces() {
    navigate(`/courts`);
  }

  async function testGetCurrentLocation() {
    const res = await GeoLocationApi.get();
    console.log(res);
  }

  useEffect(() => {
  
      dispatch(resetMyStatus());
  }, []);

  // useEffect(
  //   function loadUserInfo() {
  //     console.log(`loadUserInfo useEffect`);
  //     if (token) {
  //       try {
  //         let { username } = jwt.verify(token, SECRET_KEY);
  //         PugApi.token = token;
  //         if (myStatus === "idle") {
  //           dispatch(fetchInitialMy(username));
  //           setFetched(true);
  //         }
  //       } catch (err) {
  //         console.error("App loadUserInfo: problem loading", err);
  //       }
  //     }
  //   },
  //   [dispatch, myStatus, token]
  // );

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
  } else if (myStatus === "succeeded") {
    console.log(my);

    return (
      <Stack mt={3}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs value={tab} onChange={handleChangeTab} centered>
            <Tab label="Activity" />
            <Tab label="Games" />
            <Tab label="Invites"/>
            <Tab label="Profile" />
          </Tabs>
        </Box>
        {navigation[tab]}
        {/* <h1>Homepage</h1>
        <button onClick={getThreads}>get threads</button>
        <button onClick={createMessage}>create message</button>
        <button onClick={getInvites}>get invites</button>
        <button onClick={editProfile}>edit profile</button>
        <button onClick={getFollowers}>get followers</button>
        <button onClick={createGame}>create game</button>
        <button onClick={getInactiveGames}>inactive games</button>
        <button onClick={testGetCurrentLocation}>get current location</button>
        <button onClick={testGooglePlaces}>google</button>
        <h3>current user: {my.username}</h3>
        <UserCard user={my.user} />
        <ul>
          Games hosted pending:
          {my.gamesHostedPending.ids.map((id) => (
            <li key={id}>{games[id].title}</li>
          ))}
        </ul>
        <ul>
          Games hosted resolved:
          {my.gamesHostedResolved.ids.map((id) => (
            <li key={id}>{games[id].title}</li>
          ))}
        </ul>
        <ul>
          Games joined pending:
          {my.gamesJoinedPending.ids.map((id) => (
            <li key={id}>{games[id].title}</li>
          ))}
        </ul>
        <ul>
          Games joined resolved:
          {my.gamesJoinedResolved.ids.map((id) => (
            <li key={id}>{games[id].title}</li>
          ))}
        </ul> */}
      </Stack>
    );
  }
}

export default Homepage;
