import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ActivityGameCard from "../homepage/ActivityGameCard";
import { selectGameById } from "../store/games/gamesSlice";
import { selectUserById } from "../store/users/usersSlice";

function ActivateGame({ activity }) {
  const { primaryuser, game: gameId, stamp } = activity;
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
          >{`${user.firstName} ${user.lastName}`}</Link>
          {` has created a new game ${game.title}`}
        </Typography>
        <Box mt={1}>
          <ActivityGameCard game={game} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default ActivateGame;
