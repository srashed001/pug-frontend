import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteThread } from "../store/threads/threadsSlice";

function Thread({ thread }) {
  const users = useSelector((state) => state.users.entities);
  const my = useSelector(state => state.my)
  const dispatch = useDispatch()
  
  function testDeleteThread(){
    const data = {
      threadId: thread.id, 
      username: my.username
    }
    dispatch(deleteThread(data))
  }

  return (
    <div>
      <Link to={`/threads/t/${thread.id}`}>
        <p>id: {thread.id}</p>
      </Link>

      <p>users:</p>
      <ul>
        {thread.party.map((user) => (
          <li key={user}>{users[user].username}</li>
        ))}
      </ul>
      <p>last message: </p>
      <ul>
        <li>{Object.keys(thread.lastMessage)}</li>
        <li>{Object.values(thread.lastMessage)}</li>
      </ul>
    
      <button onClick={testDeleteThread}>X</button>  
      <hr></hr>
    </div>
  );
}

export default Thread;
