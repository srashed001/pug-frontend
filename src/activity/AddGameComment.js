import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Paper,
} from "@mui/material";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectGameById } from "../store/games/gamesSlice";
import { selectUserById } from "../store/users/usersSlice";

function AddGameComment({ activity }) {
  const { primaryuser, game: gameId, stamp, data } = activity;
  const game = useSelector((state) => selectGameById(state, gameId));
  const user = useSelector((state) => selectUserById(state, primaryuser));

  return (
    <Card elevation={3}>
      <CardHeader
        sx={{ backgroundColor: "#f48c06", color: "#FFFFFF" }}
        avatar={
          <Avatar src={user.profileImg} sx={{ backgroundColor: "#FFFFFF" }} />
        }
        title={`${user.firstName} ${user.lastName}`}
        subheader={`${formatDistanceToNowStrict(new Date(stamp))}`}
      />
      <CardContent>
        <Typography sx={{ fontSize: { xs: 12 } }}>
          <Link
            to={`/users/u/${user.username}`}
          >{`${user.firstName} ${user.lastName}`}</Link>{" "}
          commented on <Link to={`/games/g/${game.id}`}>{game.title}</Link>
        </Typography>
        <Typography
          component={Paper}
          sx={{ padding: 1, textAlign: "center", marginTop: 1 }}
        >
          "{data.comment}"
        </Typography>
      </CardContent>
    </Card>
  );
}

export default AddGameComment;
