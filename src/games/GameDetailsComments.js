import {Typography, Paper, Stack, Divider} from '@mui/material'
import GameComment from './GameComment';
import GameCommentInput from './GameCommentInput';

function GameDetailsComment({comments, game, users}){
    return (
        <>
          <Typography
            component={Paper}
            sx={{
              marginY: 1,
              padding: 1,
              fontSize: { xs: "20px", sm: "24px" },
              borderRadius: 0,
            }}
          >
            Comments: 
          </Typography>
            <GameCommentInput gameId={game.id} />
          <Stack  spacing={2} divider={<Divider />} sx={{marginTop: 2}}>
          {comments.map((comment) => {
            return (<GameComment key={comment.id} comment={comment} user={users[comment.username]}/>);
          })}
          </Stack>
        </>
    )

}

export default GameDetailsComment