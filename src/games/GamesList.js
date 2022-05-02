import { useEffect, useState } from "react";
import PugApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import GameCard from "./GameCard";


function GamesList(){
    console.debug(`GameList`);

    const [games, setGames] = useState(null)

    async function search(data = {}){
        const games = await PugApi.getGames(data);
        setGames(games)
    }

    useEffect(()=> {
        console.log(`GamesList useEffect`)
        search();
    }, [])

    if(!games) return <LoadingSpinner /> 

    console.log(games)
    return (
        <div> 
        <h1>GamesList</h1>
        {games.map(g => (
            <GameCard
                key={g.id}
                id={g.id}
                address={g.address}
                city={g.city}
                createdBy={g.createdBy}
                date={g.date}
                daysDiff={g.daysDiff}
                isActive={g.isActive}
                players={g.players}
                state={g.state}
                time={g.time}
                title={g.title}

            />
        ))}
        
        </div>
       
        
    )
}

export default GamesList