import { useDispatch, useSelector } from "react-redux"
import LoadingSpinner from "../common/LoadingSpinner"
import { reactivateGame } from "../store/games/gamesSlice"
import GameCard from "./GameCard"
import {Box, Button, Stack, Typography} from '@mui/material'
import { selectMyInactiveGames } from "../store/my/mySlice"

function InactiveGameList(){
    const my = useSelector(state => state.my)
    const inactiveGames = useSelector(selectMyInactiveGames)
    const dispatch = useDispatch()

    function testReactivateGame(evt){
        dispatch(reactivateGame(evt.target.id))
    }

    if(my.status === "loading" || my.status === "idle") return <LoadingSpinner />
    if(my.status === 'failed') return <div>{my.error}</div>
    if(my.status === 'succeeded') 
    
    console.log(inactiveGames)
    return (

        <Stack sx={{marginX: 2}}> 
           <Typography elevation={2} variant='h4' component='div' sx={{margin: 2, width: '80%'}} gutterBottom>inactive games</Typography>
            {inactiveGames.length ? inactiveGames.map(game => (
                <Box key={game.id} sx={{position: 'relative', boxShadow: 3, padding: 2, margin: 1, borderRadius: 1}}>
                    <GameCard  game={game} />
                    <Button variant="contained" id={game.id} sx={{
                        
                        marginTop: 2
                        }} 
                        // disabled={game.daysDiff < 0}
                        onClick={testReactivateGame}>reactivate</Button>
                </Box>
            
            )) : `no inactive games`}
        </Stack>
    )

}

export default InactiveGameList