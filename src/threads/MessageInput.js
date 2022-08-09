import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Stack, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addMessageInThread } from "../store/threads/threadsSlice";
import { useParams } from "react-router-dom";

function MessageInput() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const myUsername = useSelector((state) => state.my.username);
  const { reset, control, handleSubmit, formState } = useForm({
    defaultValues: {
      message: "",
    },
    mode: "onChange",
  });

  return (
    <Stack
      sx={{
        position: "fixed",
        bottom: "4.5rem",
        width: "100%",
        zIndex: "tooltip",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        component="form"
        sx={{
          width: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 1,
        }}
        onSubmit={handleSubmit(({ message }, e) => {
          dispatch(
            addMessageInThread({ username: myUsername, threadId, message })
          );
          reset({ message: "" });
        })}
      >
        <Controller
          name="message"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              size="small"
              sx={{
                fontSize: 10,
                width: "80%",
                backgroundColor: "#ffffff",
                borderRadius: 1,
              }}
              {...field}
            />
          )}
        />
        <Button type="submit" disabled={!formState.isValid}>
          send
        </Button>
      </Box>
    </Stack>
  );
}

export default MessageInput;
