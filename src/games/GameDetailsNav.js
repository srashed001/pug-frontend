import { Paper, Button, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { joinGame, leaveGame } from "../store/games/gamesSlice";

function ActiveNav({ game, joined }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const my = useSelector((state) => state.my);

  function handleCreateInvites() {
    navigate(`/invites/${game.id}`);
  }

  function handleUpdateGame() {
    navigate(`/games/update/${game.id}`);
  }

  function handleJoinGame() {
    const data = {
      gameId: game.id,
      username: my.username,
    };

    dispatch(joinGame(data));
  }
  function handleLeaveGame() {
    const data = {
      gameId: game.id,
      username: my.username,
    };

    dispatch(leaveGame(data));
  }
  return (
    <Paper
      sx={{
        width: "100%",
        borderRadius: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "1px 1px 3px #D3D3D3",
      }}
    >
      {my.username === game.createdBy.username && (
        <Button sx={{ color: "rgba(22, 26, 29)" }} onClick={handleUpdateGame}>
          update game
        </Button>
      )}
      <Button sx={{ color: "rgba(102, 7, 8)" }} onClick={handleCreateInvites}>
        invite players
      </Button>
      {my.username !== game.createdBy.username ? (
        joined ? (
          <Button sx={{ color: "rgba(102, 7, 8)" }} onClick={handleLeaveGame}>
            leave game
          </Button>
        ) : (
          <Button sx={{ color: "rgba(102, 7, 8)" }} onClick={handleJoinGame}>
            join game
          </Button>
        )
      ) : null}
    </Paper>
  );
}

function InactiveNav() {
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "rgba(177, 167, 166)",
        height: 50,
      }}
    >
      <Typography variant="h6">GAME DATE HAS PASSED</Typography>
    </Box>
  );
}

function GameDetailsNav({ game, joined }) {
  if (game.daysDiff < 0) return <InactiveNav />;

  return <ActiveNav game={game} joined={joined} />;
}

export default GameDetailsNav;
