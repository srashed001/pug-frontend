import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMessage, getThreadId } from "../store/threads/threadsSlice";
import { fetchUsers, selectAllUsers } from "../store/users/usersSlice";
import { Stack, Box, TextField, Input, IconButton } from "@mui/material";
import NewThreadPartyList from "./NewThreadPartyList";
import useAutocomplete from "@mui/material/useAutocomplete";
import UserCard from "../users/UserCard";
import NewThreadUserCard from "./NewThreadUserCard";
import { matchSorter } from "match-sorter";
import { useForm, Controller } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";

function NewThread() {
  const my = useSelector((state) => state.my);
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const usersStatus = useSelector((state) => state.users.status.users);
  const [users, setUsers] = useState({});

  const navigate = useNavigate();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const searchQuery = watch("query");

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  function testCreateMessage() {
    const data = {
      username: my.username,
      party: [
        {
          username: my.username,
          firstName: my.user.firstName,
          lastName: my.user.lastName,
          profileImg: my.user.profileImg,
        },
        ...Object.values(users),
      ],
    }
    ;
    dispatch(getThreadId(data)).unwrap().then((data) => navigate(`/threads/t/${data.id}`));
  }

  if (usersStatus === "succeeded") {
    console.log(searchQuery);

    return (
      <Stack spacing={2}>
        <NewThreadPartyList users={users} />
        <Box
          component="form"
          sx={{
            width: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Controller
            name="query"
            control={control}
            render={({ field }) => (
              <TextField sx={{ width: "80%" }} {...field} label="search" />
            )}
          />
          <IconButton
            disabled={Object.values(users).length < 1}
            color="primary"
            sx={{ marginLeft: 3 }}
            component="span"
            onClick={testCreateMessage}
          >
            <SendIcon />
          </IconButton>
        </Box>
        <Box>
          <Stack>
            {matchSorter(allUsers, searchQuery, {
              keys: [
                (item) => `${item.firstName} ${item.lastName}`,
                "username",
              ],
            }).map((user) => user.username !== my.username ? (
              <NewThreadUserCard
              key={user.username}
                user={user}
                users={users}
                setUsers={setUsers}
              />
            ): null)}
          </Stack>
        </Box>
      </Stack>
    );
  }
}

export default NewThread;
