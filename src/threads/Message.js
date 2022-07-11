import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteMessageInThread } from "../store/threads/threadsSlice";
import { format } from "date-fns";
import {
  Grid,
  Box,
  Badge,
  Avatar,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageFrom from "./MessageFrom";
import MessageTo from "./MessageTo";
import { useState } from "react";

function Message({ message, openDelete }) {
  const { threadId } = useParams();
  const { id, messageFrom, message: msg, createdOn } = message;
  const my = useSelector((state) => state.my);
  const users = useSelector((state) => state.users.entities);

  const dispatch = useDispatch();
  console.log(message);

  function deleteMessage() {
    const data = {
      username: my.username,
      id: message.id,
      threadId: threadId,
    };
    dispatch(deleteMessageInThread(data));
  }

  return messageFrom === my.username ? <MessageFrom openDelete={openDelete} deleteMessage={deleteMessage} message={message} /> : <MessageTo openDelete={openDelete}  deleteMessage={deleteMessage} message={message} />

  // return (
  //   <Grid container>
  //     <Grid item xs={10}>
  //       {my.username ? (
  //         <MessageFrom message={message} />
  //       ) : (
  //         <MessageTo message={message} />
  //       )}
  //     </Grid>
  //     <Grid item xs>
  //               <IconButton
  //         onClick={deleteMessage}
  //         color="error"
  //         sx={{ alignSelf: "end" }}
  //       >
  //         <DeleteIcon />
  //       </IconButton>
  //     </Grid>
  //   </Grid>

  // );

  // return (
  //   <Box
  //     sx={{
  //       alignSelf: my.username === messageFrom ? "end" : "start",
  //       maxWidth: "70%",
  //       margin: 4, display: "relative", zIndex: -2
  //     }}
  //   >

  //       <Card
  //       elevation={12}
  //         sx={{
  //           margin: 4,
  //           padding: 1,
  //           borderRadius: "rounded",
  //           backgroundColor: messageFrom === my.username ? "#264653" : "white",
  //           color: messageFrom === my.username ? "white" : "#264653",
  //         }}
  //       >
  //         <CardContent>
  //           <Typography>{msg}</Typography>
  //           <Typography
  //             sx={{ fontSize: "12px", textAlign: "end", marginTop: 3 }}
  //           >
  //             {/* - {format(new Date(createdOn), 'MM-dd-YYYY hh:mm')} */}
  //             - {format(new Date(createdOn), 'Pp')}
  //           </Typography>
  //         </CardContent>
  //       </Card>

  //     <IconButton onClick={deleteMessage} color='error' sx={{alignSelf: 'end'}}>
  //         <DeleteIcon/>
  //     </IconButton>
  //   </Box>

  //   // <div>
  //   //     <p>id: {message.id}</p>
  //   //     <p>username: {message.messageFrom}</p>
  //   //     <p>message: {message.message}</p>
  //   //     <p>createdOn: {message.createdOn}</p>
  //   //     <button onClick={deleteMessage}>X</button>
  //   //     <hr></hr>
  //   // </div>
  // );
}

export default Message;
