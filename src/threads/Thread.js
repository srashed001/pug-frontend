import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Thread({ thread }) {
  const users = useSelector((state) => state.users.entities);

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
      <hr></hr>
    </div>
  );
}

export default Thread;
