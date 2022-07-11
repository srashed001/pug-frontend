import { useDispatch, useSelector } from "react-redux"
import LoadingSpinner from "../common/LoadingSpinner"
import { reactivateGame } from "../store/games/gamesSlice"
import GameCard from "./GameCard"

function InactiveGameList(){
    const my = useSelector(state => state.my)
    const dispatch = useDispatch()

    function testReactivateGame(evt){
        dispatch(reactivateGame(evt.target.id))
    }

    if(my.status === "loading" || my.status === "idle") return <LoadingSpinner />
    if(my.status === 'failed') return <div>{my.error}</div>
    if(my.status === 'succeeded') return (
        <div> 
            <h1>InactiveGameList</h1>
            {my.inactiveGames.ids.length ? my.inactiveGames.ids.map(id => (
                <div key={id}>
                    <GameCard  game={my.inactiveGames.entities[id]} />
                    <button id={id} onClick={testReactivateGame}>reactivate</button>
                </div>
            
            )) : `no inactive games`}
        </div>
    )

}

export default InactiveGameList