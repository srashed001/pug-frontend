import { Paper, Stack, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function GameDetailsPlayerCard({ user }) {
  return (
    <Paper
      component={Link}
      to={`/users/u/${user.username}`}
      sx={{ textDecoration: "none", borderRadius: 0 }}
    >
      <Stack
        padding={1}
        spacing={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Avatar src={user.profileImg} />
        <Stack sx={{ minWidth: 100 }}>
          <Typography sx={{ lineHeight: 1 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" component={"div"}>
            {user.city}, {user.state}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default GameDetailsPlayerCard;
