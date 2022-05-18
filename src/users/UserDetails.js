import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { toggleRelationship } from "../store/my/mySlice";
import {
  fetchUser,
  resetUserStatus,
  selectUserById,
} from "../store/users/usersSlice";

function UserDetails() {
  const { username } = useParams();
  console.debug("UserDetails", "username=", username);

  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const user = useSelector((state) => selectUserById(state, username));
  const games = useSelector((state) => state.games.entities);
  const [fetched, setFetched] = useState(false);
  const my = useSelector(state => state.my)
  const users = useSelector(state => state.users)
  const navigate = useNavigate()

  function getFollowers(){
    navigate(`/relationships/${username}`)
  }

  function toggle() {
    dispatch(toggleRelationship({ username: my.username, followed: username }));
  }

  useEffect(() => {
    return () => dispatch(resetUserStatus());
  }, []);

  useEffect(() => {
    console.log(`userdetails useEffect`, userStatus);
    if (userStatus === "idle" && my.status === 'succeeded') {
      dispatch(fetchUser(username));
      console.log(`dispatch fetchuser`)
      setFetched(true);
    }
  }, [dispatch, my.status, userStatus, username]);

  if (userStatus === "loading") {
    return <LoadingSpinner />;
  } else if (userStatus === "failed") {
    return <div>{error}</div>;
  } else if (userStatus === "succeeded" && fetched) {
    const bio = user;
    const gamesHostedPending = user.games.hosted.pending;
    const gamesHostedResolved = user.games.hosted.resolved;
    const gamesJoinedPending = user.games.joined.pending;
    const gamesJoinedResolved = user.games.joined.resolved;

    console.log(user)
    // console.log(my)
    // console.log(users)

    return (
      <div>
        <h1>User Details: {username}</h1>
        <button onClick={toggle}>{my.follows.entities[user.username] ? `unfollow` : 'follow'}</button>
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
          <li>follows: {bio.follows.ids.length}</li>
          <li>followers: {bio.followers.ids.length}</li>
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
