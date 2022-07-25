import { Button, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useNavigate } from "react-router-dom"
import "./publicHomepage.css"

function PublicHomePage(){

    const navigate = useNavigate()

    const handleLogin = () => {
        navigate(`/login`)
    }
    const handleSignup = () => {
        navigate(`/signup`)
    }

    return (
        <Stack className="publicHomepage" justifyContent={'center'} alignItems={'center'}>
            <Stack sx={{backgroundColor: '#FFFFFF', borderRadius: 2, boxShadow: 3, padding: 2, paddingTop: 4, width: {xs: 250, sm: 400}}} justifyContent={'center'} alignItems={'center'}>
                <Stack sx={{textAlign: 'center'}}>
                    <Typography sx={{fontSize: 32, fontFamily: 'Special Elite'}}>Find Courts</Typography>
                    <Typography sx={{fontSize: 32, fontFamily: 'Special Elite'}}>Start Games</Typography>
                    <Typography sx={{fontSize: 32, fontFamily: 'Special Elite'}}>Invite Players</Typography>
                </Stack>
                <Box sx={{display: 'inline-flex' }} >
                    <Button onClick={handleLogin}>login</Button>
                    <Button onClick={handleSignup}>signup</Button>
                </Box>
            </Stack>
            

        </Stack>
    )
    

}

export default PublicHomePage