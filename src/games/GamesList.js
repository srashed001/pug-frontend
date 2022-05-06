import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../common/LoadingSpinner";
import { fetchGames, resetGameStatus } from "../store/games/gamesSlice";
import GameCard from "./GameCard";

function GamesList() {
  console.debug(`GameList`);

  const dispatch = useDispatch();
  const allIds = useSelector((state) => state.games.ids);
  const byId = useSelector((state) => state.games.entities);

  const gameStatus = useSelector((state) => state.games.status);
  const error = useSelector((state) => state.games.error);

  useEffect(() => {
    console.log(`GamesList useEffect`);
    if (gameStatus === "idle") {
      dispatch(fetchGames());
    }
  }, [dispatch, gameStatus]);

  useEffect(() => {
    return () => {
      console.log('GamesList cleanup prior', gameStatus)
      if(gameStatus === 'succeeded') dispatch(resetGameStatus())
      console.log('GamesList cleanup after', gameStatus)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content;

  if (gameStatus === "loading") {
    content = <LoadingSpinner />;
  } else if (gameStatus === "succeeded") {
    content = allIds.map((id) => <GameCard key={id} game={byId[id]} />);
  } else if (gameStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <h1>GamesList</h1>
      {content}
    </div>
  );
}

export default GamesList;
