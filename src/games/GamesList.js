import { useEffect, useState, useTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGames, selectAllActiveGames } from "../store/games/gamesSlice";
import GameCard from "./GameCard";
import { Stack, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import GamesHostListInput from "./GamesListHostInput";
import GamesHostLocationInput from "./GamesListLocationInput";
import { matchSorter } from "match-sorter";
import GamesListSearchMode from "./GamesListSearchMode";

function GamesList() {
  const dispatch = useDispatch();
  const gameStatus = useSelector((state) => state.games.status.games);
  const error = useSelector((state) => state.games.error);
  const my = useSelector((state) => state.my);
  const [resource, setResource] = useState([]);
  const [isPending, setTransition] = useTransition();
  const activeGames = useSelector((state) => selectAllActiveGames(state));
  const { control, watch } = useForm({
    defaultValues: {
      searchMode: "host",
      hostQuery: "",
      cityQuery: "",
      stateQuery: "",
    },
  });

  useEffect(() => {
    if (gameStatus === "idle" && my.status === "succeeded") {
      dispatch(fetchGames());
    }
  }, [dispatch, gameStatus, my.status]);

  useEffect(() => {
    setTransition(() => setResource(activeGames));
  }, [activeGames]);

  const { searchMode, cityQuery, hostQuery, stateQuery } = watch();

  if (gameStatus === "failed") {
    return <div>{error}</div>;
  }

  return (
    <Stack sx={{ marginTop: { xs: 23, sm: 25 } }}>
      <Stack sx={{ position: "fixed", top: 60, zIndex: 5, width: "100%" }}>
        <Stack
          component="form"
          sx={{ width: "100%", backgroundColor: "#F24346" }}
        >
          {searchMode === "host" ? (
            <GamesHostListInput control={control} />
          ) : (
            <GamesHostLocationInput control={control} />
          )}
          <GamesListSearchMode control={control} />
        </Stack>
        <Typography
          component={Paper}
          sx={{
            boxShadow: "1px 1px 3px #D3D3D3",
            padding: 1,
            fontSize: { xs: "24px", sm: "36px" },
          }}
        >
          Games
        </Typography>
      </Stack>
      <Stack sx={{ position: "relative", zIndex: 0 }}>
        {searchMode === "host" &&
          matchSorter(resource, hostQuery, {
            keys: [
              (item) =>
                `${item.createdBy.firstName} ${item.createdBy.lastName}`,
              (item) => `${item.createdBy.username}`,
            ],
          }).map((game) => <GameCard key={game.id} game={game} />)}
        {searchMode === "location" &&
          matchSorter(resource, `${cityQuery}, ${stateQuery}`, {
            keys: [(item) => `${item.city}, ${item.state}`],
          }).map((game) => <GameCard key={game.id} game={game} />)}
      </Stack>
    </Stack>
  );
}

export default GamesList;
