import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toggleRelationship } from "../store/my/mySlice";
import { fetchUser, selectUserById } from "../store/users/usersSlice";

import { Stack } from "@mui/material";
import ProfileGamesList from "../games/ProfileGamesList";
import UserDetailsNav from "./UserDetailsNav";
import initialUser from "../common/initialUser";
import { getThreadId } from "../store/threads/threadsSlice";

import UserDetailsHeader from "./UserDetailsHeader";

function UserDetails() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => selectUserById(state, username));
  const my = useSelector((state) => state.my);
  const navigate = useNavigate();
  const [resource, setResource] = useState(initialUser);
  const [isPending, setTransition] = useTransition();

  const toggle = () => {
    dispatch(toggleRelationship({ username: my.username, followed: username }));
  };

  const initiateNewMessage = () => {
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
  };

  useEffect(() => {
    dispatch(fetchUser(username));
  }, [dispatch, username]);

  useEffect(() => {
    setTransition(() => setResource((state) => ({ ...state, ...user })));
  }, [user]);

  const gamesHostedPending = resource.games.hosted.pending;
  const gamesHostedResolved = resource.games.hosted.resolved;
  const gamesJoinedPending = resource.games.joined.pending;
  const gamesJoinedResolved = resource.games.joined.resolved;

  return (
    <Stack
      sx={{
        marginTop: 2,
        width: "100%",
        marginBottom: 5,
        opacity: isPending ? 0.8 : 1,
      }}
      spacing={1}
    >
      <UserDetailsHeader user={user} />
      <UserDetailsNav
        state={my.follows.entities[resource.username] ? `unfollow` : "follow"}
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
  );
}

export default UserDetails;
