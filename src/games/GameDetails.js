import { useParams } from "react-router-dom";

function GameDetails() {
    
  const gameId = useParams();
  console.debug("GameDetail", "gameId=", gameId);

  return <h1>Game Details: {gameId}</h1>;
}

export default GameDetails;
