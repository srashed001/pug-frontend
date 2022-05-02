import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PugApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";

function GameDetails() {
    
  const { gameId }= useParams();
  console.debug("GameDetail", "gameId=", gameId);

  const [game, setGame] = useState(null)
  const [details, setDetails] = useState(null)
  const [comments, setComments] = useState(null)
  const [players, setPlayers] = useState(null)

  useEffect(()=>{
    async function getGame(){
      const game = await PugApi.getGame(gameId) 
      const {details, comments, players } = game
      setGame(game)
      setDetails(details)
      setComments(comments)
      setPlayers(players)
    }

    getGame()
  }, [gameId])

  console.log(gameId, game, comments, players)

  if(!game) return <LoadingSpinner />

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
        <li>days until game: {details.daysDiff}</li>
      </ul>
    </div>
  );
}

export default GameDetails;
