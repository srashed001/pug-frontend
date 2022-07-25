import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteMessageInThread } from "../store/threads/threadsSlice";
import MessageFrom from "./MessageFrom";
import MessageTo from "./MessageTo";

function Message({ message, openDelete }) {
  const { threadId } = useParams();
  const { messageFrom } = message;
  const myUsername = useSelector((state) => state.my.username);

  const dispatch = useDispatch();

  function handleDeleteMessage() {
    const data = {
      username: myUsername,
      id: message.id,
      threadId: threadId,
    };
    dispatch(deleteMessageInThread(data));
  }

  return messageFrom === myUsername ? (
    <MessageFrom
      openDelete={openDelete}
      deleteMessage={handleDeleteMessage}
      message={message}
    />
  ) : (
    <MessageTo
      openDelete={openDelete}
      deleteMessage={handleDeleteMessage}
      message={message}
    />
  );
}

export default Message;
