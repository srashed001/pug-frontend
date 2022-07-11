import {Grid, Box, Typography, Stack, Divider} from '@mui/material'
import {Link} from 'react-router-dom'

function UserDetailsRelationships({getFollowers, getFollowing, user}){

    return (
        <Grid item sx={{}}>
            <Box sx={{}}>
            <Stack justifyContent='space-around' spacing={2} direction='row' divider={<Divider orientation='vertical' flexItem />}>
                <Typography>followers: <Link style={{textDecoration: 'none'}} to={`/relationships/f/${user.username}`}>{user.followers.ids.length}</Link></Typography>
                <Typography>following: <Link style={{textDecoration: 'none'}} to={`/relationships/g/${user.username}`}>{user.follows.ids.length}</Link></Typography>

            </Stack>
            </Box>

        </Grid>
    )

}

export default UserDetailsRelationships