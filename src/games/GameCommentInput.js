import { useForm, Controller } from "react-hook-form";
import { TextField, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../store/comments/commentsSlice";

function GameCommentInput({ gameId }) {
  const my = useSelector((state) => state.my);
  const dispatch = useDispatch();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  function handleAddComment(comment) {
    console.log(comment);
    const data = {
      gameId,
      username: my.username,
      comment,
    };

    dispatch(addComment(data));
  }

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
      }}
      onSubmit={handleSubmit(({ comment }, e) => {
        console.log(comment);
        handleAddComment(comment);
        reset({ comment: "" });
      })}
    >
      <Controller
        name="comment"
        control={control}
        onChange={(e) => {
          console.log(e);
        }}
        render={({ field }) => (
          <TextField
            disabled={!my.username}
            sx={{ width: "100%" }}
            size="small"
            {...field}
            label="comment"
          />
        )}
      />
    </Box>
  );
}

export default GameCommentInput;
