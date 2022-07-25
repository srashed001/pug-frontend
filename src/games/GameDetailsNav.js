import { Paper, Button, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deactivateGame, joinGame, leaveGame } from "../store/games/gamesSlice";
import GameDetailsDeactivateButton from "./GameDetailsDeactivateButton";

function ActiveNav({ game, joined }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myUsername = useSelector((state) => state.my.username);

  function handleCreateInvites() {
    navigate(`/invites/${game.id}`);
  }

  function handleUpdateGame() {
    navigate(`/games/update/${game.id}`);
  }

  function handleJoinGame() {
    const data = {
      gameId: game.id,
      username: myUsername,
    };

    dispatch(joinGame(data));
  }
  function handleLeaveGame() {
    const data = {
      gameId: game.id,
      username: myUsername,
    };

    dispatch(leaveGame(data));
  }



  if (!myUsername) {
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
        <Typography>
          <Link to={"/login"}>Login</Link> or <Link to={`/signup`}>Signup</Link>
        </Typography>
      </Paper>
    );
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
      {myUsername === game.createdBy.username && (
        <>
        <Button sx={{ color: "rgba(22, 26, 29)" }} onClick={handleUpdateGame}>
          update game
        </Button>
        <GameDetailsDeactivateButton gameId={game.id} />
        </>
      )}
      <Button sx={{ color: "rgba(102, 7, 8)" }} onClick={handleCreateInvites}>
        invite players
      </Button>
      {myUsername !== game.createdBy.username ? (
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
