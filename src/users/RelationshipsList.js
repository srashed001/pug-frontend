import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  fetchRelationships,
  fetchUser,
  resetFollowStatus,
  resetUserStatus,
  selectUserById,
} from "../store/users/usersSlice";
import RelationshipCard from "./RelationshipCard";
import { Typography, Tabs, Tab, Stack } from "@mui/material";
import UserCard from "./UserCard";

function RelationshipsList({ state }) {
  const initialState = state === "followers" ? 0 : 1;
  const { username } = useParams();
  const user = useSelector((state) => selectUserById(state, username));
  const userStatus = useSelector((state) => state.users.status.user);
  const followStatus = useSelector((state) => state.users.followStatus);
  const error = useSelector((state) => state.users.error);
  const dispatch = useDispatch();
  const [isPending, setTransition] = useTransition();
  const [resource, setResource] = useState({
    followers: { entities: {} },
    follows: { entities: {} },
  });
  const [value, setValue] = useState(initialState);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(fetchUser(username));
  }, [dispatch, username]);

  useEffect(() => {
    setTransition(() => setResource(state => ({...state, ...user})));
  }, [user]);

  if (userStatus === "failed") return <div>{error}</div>;

  console.log(resource, followStatus);
  const relationships =
    value === 0 ? resource.followers.entities : resource.follows.entities;

  console.log(relationships);

  return (
    <Stack>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="followers" />
        <Tab label="following" />
      </Tabs>
      {Object.values(relationships).length ? (
        Object.values(relationships).map((user) => (
          <UserCard key={user.username} user={user} />
        ))
      ) : (
        <Typography align={"center"} component={"div"} variant="h5">
          No Users
        </Typography>
      )}
    </Stack>

    // <div>
    //     <div>
    //         <button onClick={()=>setState('followers')}>followers</button>
    //         <button onClick={()=>setState('follows')}>follows</button>
    //     </div>
    //     <div>
    //            {Object.values(relationships).length ? Object.values(relationships).map(user => (
    //         <RelationshipCard user={user} />
    //     )) : <Typography component={'div'} variant="h5">No Users</Typography>}
    //     </div>

    // </div>
  );
}

export default RelationshipsList;
