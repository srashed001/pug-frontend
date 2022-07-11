import { useCallback, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { toggleRelationship } from "../store/my/mySlice";
import {
  fetchUser,
  resetUserStatus,
  selectUserById,
} from "../store/users/usersSlice";

import { Stack, Box, Grid, Container, Divider } from "@mui/material";
import ProfileGamesList from "../games/ProfileGamesList";
import UserDetailsNav from "./UserDetailsNav";
import UserDetailsBio from "./UserDetailsBio";
import initialUser from "../common/initialUser";
import PugApi from "../api/api";
import { getThreadId } from "../store/threads/threadsSlice";
import UserDetailsRelationships from "./UserDetailsRelationships";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UserDetailsHeader from "./UserDetailsHeader";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
  },
  palette: {
    primary: {main: 'rgba(245, 243, 244, .5)'},
    secondary: {main: "#11cb5f"}
  }
});

function UserDetails() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.users.status.user);
  const error = useSelector((state) => state.users.error);
  const user = useSelector((state) => selectUserById(state, username));
  const my = useSelector((state) => state.my);
  const threads = useSelector((state) => state.threads);
  const navigate = useNavigate();
  const [resource, setResource] = useState(initialUser);
  const [isPending, setTransition] = useTransition();



  const toggle = useCallback(() => {
    dispatch(toggleRelationship({ username: my.username, followed: username }));
  }, [dispatch, my.username, username]);

  const initiateNewMessage = useCallback(() => {
    dispatch(
      getThreadId({
        username: my.username,
        party: [
          {
            username: my.username,
            firstName: my.user.firstName,
            lastName: my.user.lastName,
            profileImg: my.user.profileImg,
          },
          {
            username,
            firstName: resource.firstName,
            lastName: resource.lastName,
            profileImg: resource.profileImg,
          },
        ],
      })
    )
      .unwrap()
      .then((data) => {
        navigate(`/threads/t/${data.id}`);
      });
  }, []);

  useEffect(() => {
    if (my.status === "succeeded") {
      dispatch(fetchUser(username));
    }
  }, [dispatch, my.status, username]);

  useEffect(() => {
    setTransition(() => setResource((state) => ({ ...state, ...user })));
  }, [user]);

  if (userStatus === "failed") {
    return <div>{error}</div>;
  }
  console.log(resource, threads);
  const gamesHostedPending = resource.games.hosted.pending;
  const gamesHostedResolved = resource.games.hosted.resolved;
  const gamesJoinedPending = resource.games.joined.pending;
  const gamesJoinedResolved = resource.games.joined.resolved;

  return (
    <ThemeProvider theme={theme}>

        <Stack sx={{marginTop: 2, width: "100%", marginBottom: 5}} spacing={1} >
          <UserDetailsHeader user={user} />
          <UserDetailsNav
            state={
              my.follows.entities[resource.username] ? `unfollow` : "follow"
            }
            toggle={toggle}
            initiateNewMessage={initiateNewMessage}
            user={resource}
          />
          <Stack spacing={3}>

          <ProfileGamesList
            games={gamesHostedPending}
            set={"gamesHostedPending"}
          />
          <ProfileGamesList
            games={gamesHostedResolved}
            set={"gamesHostedResolved"}
          />
          <ProfileGamesList
            games={gamesJoinedPending}
            set={"gamesJoinedPending"}
          />
          <ProfileGamesList
            games={gamesJoinedResolved}
            set={"gamesJoinedResolved"}
          />
          </Stack>
        </Stack>
    </ThemeProvider>


  );
}

export default UserDetails;
