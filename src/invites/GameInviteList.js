import { useEffect,  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUsers, selectAllUsers } from "../store/users/usersSlice";
import { Stack, Box, TextField,  IconButton, Divider } from "@mui/material";
import NewThreadUserCard from "../threads/NewThreadUserCard";
import { matchSorter } from "match-sorter";
import { useForm, Controller } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";
import GameInvitePartyList from "./GameInvitePartyList";
import { createInvites } from "../store/invites/invitesSlice";



function GameInviteList(){
    const {gameId} = useParams()
    const my = useSelector(state => state.my)
    const dispatch = useDispatch()
    const allUsers = useSelector(selectAllUsers)
    const [users, setUsers] = useState({})

    const navigate = useNavigate();

    const {
      control,
      watch,
    } = useForm({
      defaultValues: {
        query: "",
      },
    });
  
    const searchQuery = watch("query");
  
    useEffect(() => {
      dispatch(fetchUsers());
    }, [dispatch]);

    function handleCreateInvite(){
        const data = {
          toUsers: Object.keys(users),
          gameId,
          username: my.username
        }
        dispatch(createInvites(data))
  
        navigate(`/games/g/${gameId}`)
        
  
    }

    return (
        <Stack spacing={1}>
          <GameInvitePartyList users={users} />
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
              onClick={handleCreateInvite}
            >
              <SendIcon />
            </IconButton>
          </Box>
      
            <Stack spacing={1} divider={<Divider />} marginTop={1}>
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
       
        </Stack>
    )

}

export default GameInviteList