import { useForm, Controller } from "react-hook-form";
import { TextField, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addMessageInThread } from "../store/threads/threadsSlice";
import { useParams } from "react-router-dom";

function MessageInput() {
    const {threadId} = useParams()
    const dispatch = useDispatch()
    const my = useSelector(state => state.my)
  const {
      reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: "",
    },
  });

  return (
    <Box
      component="form"
      sx={{
        width: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: 1,
        backgroundColor: "#660708"
      }}
      onSubmit={handleSubmit(({message}, e) => {

        dispatch(addMessageInThread({username: my.username, threadId, message}))
        reset({message: ''})
        
      })}
    >
      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <TextField size='small'  sx={{fontSize: 10, width: "80%", backgroundColor: '#ffffff', borderRadius: 1 }}  {...field} label="message" />
        )}
      />
    </Box>
  );
}

export default MessageInput;
