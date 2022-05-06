import { Link } from "react-router-dom"

function GameCard({ game }){
    const {id, address, city, createdBy, date, daysDiff, isActive, players, state, time, title } = game

    return (
        <div>
            <Link to={`/games/${id}`}>
              <h3>{title}</h3>   
            </Link>
            <ul>
                <li>id: {id}</li>
                <li>time: {time}</li>
                <li>date: {date}</li>
                <li>address: {address}</li>
                <li>city: {city}</li>
                <li>state: {state}</li>
                <li>days unil: {daysDiff}</li>
                <li>players: {players}</li>
                <li>game host: {createdBy}</li>
                <li>is active: {JSON.stringify(isActive)}</li>
            </ul>
        </div>
    )
}

export default GameCard