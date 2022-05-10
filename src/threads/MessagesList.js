import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { addMessageInThread, fetchMessages, resetThreadStatus } from "../store/threads/threadsSlice"
import LoadingSpinner from "../common/LoadingSpinner"
import Message from "./Message"


function MessagesList(){

    const {threadId} = useParams()
    const dispatch = useDispatch()
    const threadStatus = useSelector(state => state.threads.status)
    const messageIds = useSelector(state => state.threads.entities[threadId]?.messages.ids)
    const messages = useSelector(state => state.threads.entities[threadId]?.messages.entities)
    const thread = useSelector(state => state.threads.entities[threadId])
    const my = useSelector(state => state.my)
    const error = useSelector(state => state.threads.error)
    const [fetched, setFetched] = useState(false)


    function addMessage(){
        const data = {
            username: 'test1',
            threadId, 
            message: 'testing 123'
        }

        dispatch(addMessageInThread(data))

    }

    useEffect(()=> {
             return () => {
            dispatch(resetThreadStatus())
            setFetched(false)
        }
    }, [])


    useEffect(()=> {
        console.log(threadStatus)
        if(threadStatus === 'idle' && my.status === 'succeeded'){
            console.log(`dispatch`)
            dispatch(fetchMessages({username: my.username, threadId}))
            setFetched(true)

        }
    }, [dispatch, my.status, my.username, threadId, threadStatus])

    if (threadStatus === "loading") {
        return <LoadingSpinner />;
      } else if (threadStatus === "failed") {
        return <div>{error}</div>;
      } else if (threadStatus === "succeeded" && fetched ) {


    
        return (
          <div>
            <h1>messages</h1>
            <button onClick={addMessage}>add message</button>
            {messageIds.map(id => (
                <Message key={id} message={messages[id]} threadId={threadId} />
            ))}

          </div>
        );
      }



}

export default MessagesList