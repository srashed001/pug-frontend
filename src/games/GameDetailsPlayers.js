import { Typography, Paper, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import GameDetailsPlayerCard from "./GameDetailsPlayerCard";

function GameDetailsPlayers({ game }) {
  const users = useSelector((state) => state.users.entities);

  return (
    <>
      <Typography
        component={Paper}
        sx={{
          marginY: 1,
          padding: 1,
          fontSize: { xs: "20px", sm: "24px" },
          borderRadius: 0,
          boxShadow: "1px 1px 3px #D3D3D3",
        }}
      >
        Players: {game.players.length}
      </Typography>
      <Stack
        spacing={1}
        padding={1}
        direction={"row"}
        sx={{ overflow: "auto"}}
      >
        {game.players.map((player) => (
          <GameDetailsPlayerCard key={player} user={users[player]} />
        ))}
      </Stack>
    </>
  );
}

export default GameDetailsPlayers;
