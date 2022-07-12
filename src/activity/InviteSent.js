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

function InviteSent({ activity }) {
  const {
    primaryuser: primaryUsername,
    secondaryuser: secondaryUsername,
    game: gameId,
    stamp,
  } = activity;
  const game = useSelector((state) => selectGameById(state, gameId));
  const primaryUser = useSelector((state) =>
    selectUserById(state, primaryUsername)
  );
  const secondaryUser = useSelector((state) =>
    selectUserById(state, secondaryUsername)
  );

  return (
    <Card elevation={3}>
      <CardHeader
        sx={{ backgroundColor: "#f48c06", color: "#FFFFFF" }}
        avatar={
          <Avatar
            src={primaryUser.profileImg}
            sx={{ backgroundColor: "#FFFFFF" }}
          />
        }
        title={`${primaryUser.firstName} ${primaryUser.lastName}`}
        subheader={`${formatDistanceToNowStrict(new Date(stamp))}`}
      />
      <CardContent>
        <Typography sx={{ fontSize: { xs: 12 } }}>
          <Link
            to={`/users/u/${primaryUser.username}`}
          >{`${primaryUser.firstName} ${primaryUser.lastName}`}</Link>{" "}
          sent{" "}
          <Link
            to={`/users/u/${secondaryUser.username}`}
          >{`${secondaryUser.firstName} ${secondaryUser.lastName}`}</Link>{" "}
          an invite to join game {game.title}
        </Typography>
        <Box mt={1}>
          <ActivityGameCard game={game} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default InviteSent;
