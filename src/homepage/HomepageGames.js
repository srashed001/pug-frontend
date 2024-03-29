import { Button, Stack } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import ProfileGamesList from "../games/ProfileGamesList";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";

function HomepageGames() {
  const my = useSelector((state) => state.my);
  const [resource, setResource] = useState(my);
  const [isPending, setTransition] = useTransition();
  const navigate = useNavigate();

  function createGame() {
    navigate(`/games/new`);
  }

  useEffect(() => {
    setTransition(() => setResource((state) => ({ ...state, ...my })));
  }, [my]);

  const {
    gamesHostedPending,
    gamesHostedResolved,
    gamesJoinedPending,
    gamesJoinedResolved,
    inactiveGames,
  } = resource;

  return (
    <Stack mt={5}>
      <Stack
        sx={{
          width: "100%",
          backgroundColor: "#E5383B",
          position: "fixed",
          top: "6.5rem",
          zIndex: "10",
          boxShadow: 3,
        }}
      >
        <Box marginX={1}>
          <Button
            startIcon={<SportsBasketballIcon />}
            sx={{ color: "#ffffff", fontSize: "10px" }}
            onClick={createGame}
          >
            new game
          </Button>
        </Box>
      </Stack>
      <Stack sx={{opacity: isPending ? .7 : 1}}>
        <ProfileGamesList
          games={Object.values(gamesHostedPending.entities)}
          set={"gamesHostedPending"}
        />
        <ProfileGamesList
          games={Object.values(gamesHostedResolved.entities)}
          set={"gamesHostedResolved"}
        />
        <ProfileGamesList
          games={Object.values(gamesJoinedPending.entities)}
          set={"gamesJoinedPending"}
        />
        <ProfileGamesList
          games={Object.values(gamesJoinedResolved.entities)}
          set={"gamesJoinedResolved"}
        />
        <ProfileGamesList
          games={Object.values(inactiveGames.entities)}
          set={"inactiveGames"}
        />
      </Stack>
    </Stack>
  );
}

export default HomepageGames;
