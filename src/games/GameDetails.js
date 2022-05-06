import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { fetchGame, resetGameStatus } from "../store/games/gamesSlice";

function GameDetails() {
  const { gameId } = useParams();

  const dispatch = useDispatch();
  const gameStatus = useSelector((state) => state.games.status);
  const games = useSelector((state) => state.games.entities);
  const error = useSelector((state) => state.games.errors);

  console.debug("GameDetail", "gameId=", gameId);

  useEffect(() => {
    return () => {
      console.log('GamesDetails cleanup prior', gameStatus)
      if (gameStatus === "succeeded") dispatch(resetGameStatus());
      console.log('GamesDetails cleanup after', gameStatus)
    };
  }, []);

  useEffect(() => {
    console.log(gameStatus)
    if (gameStatus === "idle") {
      dispatch(fetchGame(gameId));
    }

  }, [dispatch, gameId, gameStatus]);

  if (gameStatus === "loading" || gameStatus === "idle") {
    return <LoadingSpinner />;
  } else if (gameStatus === "failed") {
    return <div>{error}</div>;
  } else if (gameStatus === "succeeded") {
    const details = games[gameId];
    return (
      <div>
        <h1>Game Details: {gameId}</h1>
        <ul>
          <li>id: {details.id}</li>
          <li>title: {details.title}</li>
          <li>description: {details.description}</li>
          <li>date: {details.date}</li>
          <li>time: {details.time}</li>
          <li>address: {details.address}</li>
          <li>city: {details.city}</li>
          <li>state: {details.state}</li>
          <li>created on: {details.createdOn}</li>
          <li>game host: {details.createdBy}</li>
          <li>{details.daysDiff}</li>
        </ul>
      </div>
    );
  }
}

export default GameDetails;
