import { Grid, Avatar, Typography, Box, IconButton } from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../store/comments/commentsSlice";

function GameComment({ comment, user }) {
  const my = useSelector((state) => state.my);
  const dispatch = useDispatch();

  function handleDeleteComment() {
    const data = {
      gameId: comment.gameId,
      commentId: comment.id,
    };

    dispatch(deleteComment(data));
  }

  return (
    <Grid container>
      <Grid
        item
        xs={2}
        sm={1}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Avatar src={user.profileImg} />
      </Grid>
      <Grid item xs>
        <Box>
          <Typography variant="caption">
            {user.firstName} {user.lastName} -{" "}
            {formatDistanceToNowStrict(new Date(comment.createdOn))}
          </Typography>
          <Typography variant="body1">{comment.comment}</Typography>
        </Box>
      </Grid>
      {my.username === comment.username && (
        <Grid
          item
          xs={2}
          sm={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{ marginLeft: 3 }}
            component="span"
            onClick={handleDeleteComment}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}

export default GameComment;
