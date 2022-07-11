import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams  } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  fetchGame,
  resetGameStatus,
  selectGameById,
  joinGame, 
  leaveGame,
  deactivateGame
} from "../store/games/gamesSlice";

import { selectCommentsByGame, addComment, deleteComment } from "../store/comments/commentsSlice";
import { resetUserStatus } from "../store/users/usersSlice";


function GameDetails() {
  const { gameId } = useParams();

  const dispatch = useDispatch();
  const gameStatus = useSelector((state) => state.games.status.game);
  const game = useSelector((state) => selectGameById(state, gameId));
  const error = useSelector((state) => state.games.errors);
  const gameComments = useSelector(state => selectCommentsByGame(state, gameId))
  const users = useSelector(state => state.users.entities)
  const my = useSelector(state => state.my)
  const [fetched, setFetched] = useState(false)
  const navigate = useNavigate()
  
  console.debug("GameDetail", "gameId=", gameId);

  function testAddPlayer(){
    const data = {
      gameId,
      username: 'test1'
    }

    dispatch(joinGame(data))
  }
  
  function testRemovePlayer(evt){
    const data = {
      gameId,
      username: evt.target.id
    }

    dispatch(leaveGame(data))
  }

  function testAddComment() {
    const data = {
      gameId,
      username: "test2",
      comment: "testComment",
    };

    dispatch(addComment(data))
  }

  function testDeleteComment(evt){
    const data = {
      gameId, 
      commentId: evt.target.id
    }
    dispatch(deleteComment(data))
  }

  function testCreateInvites(){
    navigate(`/invites/${gameId}`)
    
  }

  function testUpdateGame(){
    navigate(`/games/update/${gameId}`)
  }

  function testDeactivateGame(){
    dispatch(deactivateGame(gameId))
    navigate(`/inactive/g`)
  }

  // useEffect(() => {
  //   return () => {
  //     dispatch(resetGameStatus())
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log(`gamedetails useEffect`, gameStatus);
  //   if(gameStatus === 'idle' && my.status === 'succeeded')
  //     dispatch(fetchGame(gameId));
  //     // setFetched(true)
  //   }, [dispatch, gameId, gameStatus, my.status]);

  useEffect(()=> {
    dispatch(resetUserStatus())
    dispatch(fetchGame(gameId))
  }, [dispatch, gameId])

  if (gameStatus === "loading"  ) {
    return <LoadingSpinner />;
  } else if (gameStatus === "failed") {
    return <div>{error}</div>;
  } else if (gameStatus === "succeeded" && my.status === 'succeeded'  ) {

    console.log(game)


    return (
      <div>
        <div>
          <h1>Game Details: {gameId}</h1>
          <button onClick={testUpdateGame}>update game</button>
          {game.createdBy === my.username ? <button onClick={testDeactivateGame}>deactivate</button> : <div></div>}
          <div>
            <button onClick={testCreateInvites}>invite players</button>
          </div>
          <ul>
            <li>id: {game.id}</li>
            <li>title: {game.title}</li>
            <li>description: {game.description}</li>
            <li>date: {game.date}</li>
            <li>time: {game.time}</li>
            <li>address: {game.address}</li>
            <li>city: {game.city}</li>
            <li>state: {game.state}</li>
            <li>created on: {game.createdOn}</li>
            <li>game host: {game.createdBy}</li>
            <li>daysDiff: {game.daysDiff}</li>
          </ul>
        </div>
        <div>
          Players 
          <button onClick={testAddPlayer}>add player</button>
          <ul>
            {game.players.map(player => (
              <li key={users[player].username} >{users[player].username}<button id={player} onClick={testRemovePlayer}>X</button></li>
            )) }
          </ul>
        </div>
        <button onClick={testAddComment}>add comment</button>
        <div>
          {gameComments.map(comment => {
            return (
            <div key={comment.id}>
              <li >{comment.comment}</li>
              <button id={comment.id} onClick={testDeleteComment}>remove</button>
            </div>)
          })}
        </div>
      </div>
    );
  }
}

export default GameDetails;
