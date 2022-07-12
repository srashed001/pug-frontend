import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectAllUsers } from "../store/users/usersSlice";
import UserCard from "./UserCard";
import { Stack, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import UserListNameSearch from "./UserListNameSearch";
import UserListLocationSearch from "./UserListLocationSearch";
import UserListSearchMode from "./UserListSearchMode";
import { matchSorter } from "match-sorter";

function UsersList() {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const my = useSelector((state) => state.my);
  const usersStatus = useSelector((state) => state.users.status.users);
  const error = useSelector((state) => state.users.error);
  const [resource, setResource] = useState([]);
  const [isPending, setTransition] = useTransition();
  const { control, watch } = useForm({
    defaultValues: {
      searchMode: "name",
      nameQuery: "",
      cityQuery: "",
      stateQuery: "",
    },
  });

  useEffect(() => {
    if (usersStatus === "idle" && my.status === "succeeded") {
      dispatch(fetchUsers());
    }
  }, [dispatch, my.status, usersStatus]);

  useEffect(() => {
    setTransition(() => setResource(users));
  }, [users]);

  const { searchMode, nameQuery, cityQuery, stateQuery } = watch();

  if (usersStatus === "failed") return <div>{error}</div>;

  return (
    <Stack sx={{ marginTop: { xs: 23, sm: 25 } }}>
      <Stack sx={{ position: "fixed", top: 60, zIndex: 5, width: "100%" }}>
        <Stack
          component="form"
          sx={{ width: "100%", backgroundColor: "#F24346" }}
        >
          {searchMode === "name" ? (
            <UserListNameSearch control={control} />
          ) : (
            <UserListLocationSearch control={control} />
          )}
          <UserListSearchMode control={control} />
        </Stack>
        <Typography
          component={Paper}
          sx={{
            boxShadow: "1px 1px 3px #D3D3D3",
            padding: 1,
            fontSize: { xs: "24px", sm: "36px" },
          }}
        >
          Users
        </Typography>
      </Stack>
      <Stack sx={{ position: "relative", zIndex: 0 }}>
        {searchMode === "name" &&
          matchSorter(resource, nameQuery, {
            keys: [
              (item) => `${item.firstName} ${item.lastName}`,
              (item) => `${item.username}`,
            ],
          }).map((user) => <UserCard key={user.username} user={user} />)}
        {searchMode === "location" &&
          matchSorter(resource, `${cityQuery}, ${stateQuery}`, {
            keys: [(item) => `${item.city}, ${item.state}`],
          }).map((user) => <UserCard key={user.username} user={user} />)}
      </Stack>
    </Stack>
  );
}

export default UsersList;
