import { Link } from "react-router-dom";

function RelationshipCard({ user }) {
  return (
    <div>
      <Link to={`/users/${user.username}`}>
        <p>{user.username}</p>
      </Link>

      <p>{user.city}</p>
      <p>{user.state}</p>
      <br></br>
    </div>
  );
}

export default RelationshipCard;
