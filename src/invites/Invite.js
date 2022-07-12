import { useDispatch, useSelector } from "react-redux";
import { selectGameById } from "../store/games/gamesSlice";
import {
  acceptInvite,
  cancelInvite,
  denyInvite,
} from "../store/invites/invitesSlice";
import { selectUserById } from "../store/users/usersSlice";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Chip,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Avatar,
  Divider,
  Typography,
} from "@mui/material";

function Invite({ invite, value }) {
  const my = useSelector((state) => state.my);
  const users = useSelector((state) => state.users.entities);
  const { id, gameId, fromUser, toUser, status, createdOn } = invite;

  const user = useSelector((state) =>
    selectUserById(state, value === "received" ? fromUser : toUser)
  );
  const game = useSelector((state) => selectGameById(state, gameId));

  const dispatch = useDispatch();

  function dispatchAcceptInvite() {
    const data = {
      username: my.username,
      id,
    };
    dispatch(acceptInvite(data));
  }

  function dispatchDenyInvite() {
    const data = {
      username: my.username,
      id,
    };
    dispatch(denyInvite(data));
  }

  function dispatchCancelInvite() {
    const data = {
      username: my.username,
      id,
    };
    dispatch(cancelInvite(data));
  }

  console.log(user);
  return (
    <Card elevation={10}>
      <CardHeader
        avatar={<Avatar src={user.profileImg} />}
        title={`${value === "received" ? "From:" : "To:"} ${user.firstName} ${
          user.lastName
        }`}
        subheader={formatDistanceToNowStrict(new Date(createdOn))}
      />
      <Divider variant="middle" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {game.title}
        </Typography>
        <Typography gutterBottom variant="subtitle1" component="div">
          Host: {users[game.createdBy.username].firstName}{" "}
          {users[game.createdBy.username].lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {game.address} {game.city}, {game.state}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {game.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {game.time}
        </Typography>
        <Chip
          sx={{ marginTop: 2 }}
          label={`${status}`}
          color={status === "pending" ? "primary" : "secondary"}
        />
      </CardContent>
      <CardActions>
        {value === "received" ? (
          status === "pending" ? (
            <>
              <Button onClick={dispatchAcceptInvite}>accept</Button>
              <Button onClick={dispatchDenyInvite}>deny</Button>
            </>
          ) : null
        ) : status === "pending" ? (
          <Button onClick={dispatchCancelInvite}>cancel</Button>
        ) : null}
      </CardActions>
    </Card>
  );
}

export default Invite;
