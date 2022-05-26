import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { toggleRelationship } from "../store/my/mySlice";
import {
  fetchUser,
  resetUserStatus,
  selectUserById,
} from "../store/users/usersSlice";
function UserDetails() {

  const initialUser = {
    birthDate: "",
    city: "",
    createdOn: "",
    email: "",
    firstName: "",
    followers: {entities: {}, ids: []},
    follows: {entities: {}, ids: []},
    games: {
      hosted: { resolved: [], pending: [] },
      joined: { resolved: [], pending: [] },
    },
    isAdmin: false,
    isPrivate: false,
    lastName: "",
    phoneNumber: null,
    profileImg: "",
    state: "",
    username: "",
  };

  const { username } = useParams();

  console.debug("UserDetails", "username=", username);

  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.users.status.user);
  const error = useSelector((state) => state.users.error);
  const user = useSelector((state) => selectUserById(state, username));
  const my = useSelector((state) => state.my);
  const navigate = useNavigate();
  const [resource, setResource] = useState(initialUser);
  const [isPending, startTransition] = useTransition();

  function getFollowers() {
    navigate(`/relationships/${username}`);
  }

  function toggle() {
    dispatch(toggleRelationship({ username: my.username, followed: username }));
  }

  useEffect(() => {
    dispatch(resetUserStatus());
    dispatch(fetchUser(username));
    
  }, [dispatch, username]);

  useEffect(()=>{
    startTransition(() => setResource(user));
  }, [user])

  if (userStatus === "failed") {
    return <div>{error}</div>;
  } else if (userStatus === "succeeded") {
    console.log(resource)
    const bio = resource;
    const gamesHostedPending = resource.games.hosted.pending;
    const gamesHostedResolved = resource.games.hosted.resolved;
    const gamesJoinedPending = resource.games.joined.pending;
    const gamesJoinedResolved = resource.games.joined.resolved;



    return (
      <div style={{opacity: userStatus === "loading" || isPending ? 0.5 : 1.0}}>
        <h1>User Details: {username}</h1>
        <button onClick={toggle}>
          {my.follows.entities[user.username] ? `unfollow` : "follow"}
        </button>
        <button onClick={getFollowers}>get followers</button>
        <ul>
          <li>first name: {bio.firstName}</li>
          <li>last name: {bio.lastName}</li>
          <li>city: {bio.city}</li>
          <li>state: {bio.state}</li>
          <li>img: {bio.profileImg}</li>
          <li>email: {bio.email}</li>
          <li>created on: {bio.createdOn}</li>
          <li>phone number: {bio.phoneNumber}</li>
          <li>
            follows:
            {bio.follows.ids.map((id) => (
              <Link to={`/users/u/${id}`}>{id}</Link>
            ))}
          </li>
          <li>
            followers:
            {bio.followers.ids.map((id) => (
              <Link to={`/users/u/${id}`}>{id}</Link>
            ))}
          </li>
          <li>is private: {JSON.stringify(bio.isPrivate)}</li>
          <li>is admin: {JSON.stringify(bio.isAdmin)}</li>
        </ul>
        <ul>
          games hosted pending:
          {gamesHostedPending.map((el) => (
            <li key={el.id}>{el.id}</li>
          ))}
        </ul>
        <ul>
          games hosted resolved:
          {gamesHostedResolved.map((el) => (
            <li key={el.id}>{el.id}</li>
          ))}
        </ul>
        <ul>
          games joined pending:
          {gamesJoinedPending.map((el) => (
            <li key={el.id}>{el.id}</li>
          ))}
        </ul>
        <ul>
          games joined resolved:
          {gamesJoinedResolved.map((el) => (
            <li key={el.id}>{el.id}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default UserDetails;
