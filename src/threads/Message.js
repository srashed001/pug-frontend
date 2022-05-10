import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { deleteMessageInThread } from "../store/threads/threadsSlice"


function Message({message}){
    const {threadId} = useParams()

    const dispatch = useDispatch()
  console.log(message)

    function deleteMessage(){
          const data = {
        username: 'test1',
        id: message.id, 
        threadId: threadId
    }
        dispatch(deleteMessageInThread(data))
    }

    return (
        <div>
            <p>id: {message.id}</p>
            <p>username: {message.messageFrom}</p>
            <p>message: {message.message}</p>
            <p>createdOn: {message.createdOn}</p>
            <button onClick={deleteMessage}>X</button>
            <hr></hr>
        </div>
        
    )
}

export default Message