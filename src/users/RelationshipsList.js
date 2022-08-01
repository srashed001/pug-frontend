import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUser, selectUserById } from "../store/users/usersSlice";
import { Typography, Stack } from "@mui/material";
import UserCard from "./UserCard";
import { useForm } from "react-hook-form";
import RelationshipListNav from "./RelationshipListNav";

function RelationshipsList({ state }) {
  const { username } = useParams();
  const user = useSelector((state) => selectUserById(state, username));
  const dispatch = useDispatch();
  const [isPending, setTransition] = useTransition();
  const [resource, setResource] = useState({
    followers: { entities: {} },
    follows: { entities: {} },
  });

  const { control, watch } = useForm({
    defaultValues: {
      relationshipMode: state,
    },
  });
  const { relationshipMode } = watch();

  useEffect(() => {
    dispatch(fetchUser(username));
  }, [dispatch, username]);

  useEffect(() => {
    setTransition(() => setResource((state) => ({ ...state, ...user })));
  }, [user]);

  const relationships =
    relationshipMode === "followers"
      ? resource.followers.entities
      : resource.follows.entities;

  return (
    <Stack>
      <RelationshipListNav control={control} username={username} />
      <Stack mt={14} sx={{ opactity: isPending ? 0.8 : 1 }}>
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
    </Stack>
  );
}

export default RelationshipsList;
