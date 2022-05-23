import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { fetchGame, resetGameStatus, selectGameById, updateGame } from "../store/games/gamesSlice";

function UpdateGameForm(){
    const {gameId} = useParams()
    const game = useSelector(state => selectGameById(state, gameId))
    const status = useSelector(state => state.games.status.game)
    const dispatch = useDispatch()



    useEffect(()=> {
        if(status === 'idle') 
        dispatch(fetchGame(gameId))
    }, [dispatch, gameId, status])


    useEffect(()=> {
        if(status === 'succeeded')
        dispatch(resetGameStatus())
    }, [])
   
        // eslint-disable-next-line no-extend-native
        Date.prototype.addDays = function (days) {
            const date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            date.setHours(date.getHours() - 7);
            return date;
          };
      
          let date = new Date();
          date = date.addDays(4).toJSON().slice(0, 10);

    const data = {
        title: 'crazy game 5',
        description: 'updated description',
        date,
        time: '12:00:00',
        city: 'Fresno',
        state: 'CA',
    }

    function testUpdateGame(){
        dispatch(updateGame({id:gameId, data}))

    }

    if (status === 'loading') return <LoadingSpinner />
    if(status === 'failed') return <div>failed</div>
    if (status === 'succeeded') return (
        <div>
        <h1>Edit Game: {gameId}</h1>
        <div>
          <button onClick={testUpdateGame}>update game</button>
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

    )
}

export default UpdateGameForm