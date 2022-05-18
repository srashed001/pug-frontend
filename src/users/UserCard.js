
import { Link } from "react-router-dom";

function UserCard({ user }) {
  console.log(user)
  const { username, firstName, lastName, city, state, profileImg, isPrivate } =
    user;

  return (
    <div>
      <Link to={`/users/${username}`}>
        <h3>{username}</h3>
      </Link>
      <ul>
        <li>first name: {firstName}</li>
        <li>last name: {lastName}</li>
        <li>city: {city}</li>
        <li>state: {state}</li>
        <li>img: {profileImg}</li>
        <li>is private: {JSON.stringify(isPrivate)}</li>
      </ul>
    </div>
  );
}

export default UserCard;
