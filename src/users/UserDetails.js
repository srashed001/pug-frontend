import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
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
  const games = useSelector(state => state.games.entities)
  const [fetched, setFetched] = useState(false);


  useEffect(() => {
    return () =>  dispatch(resetUserStatus());
  }, []);

  useEffect(() => {
    console.log(`userdetails useEffect`, userStatus);
    if (userStatus === "idle") {
      dispatch(fetchUser(username));
      setFetched(true);
    }
  }, [dispatch, userStatus, username]);

  if (userStatus === "loading") {
    return <LoadingSpinner />;
  } else if (userStatus === "failed") {
    return <div>{error}</div>;
  } else if (userStatus === "succeeded" && fetched) {
    const bio = user.user;
    const gamesHostedPending = user.games.hosted.pending;
    const gamesHostedResolved = user.games.hosted.resolved;
    const gamesJoinedPending = user.games.joined.pending;
    const gamesJoinedResolved = user.games.joined.resolved;

    console.log(games)


    return (
      <div>
        <h1>User Details: {username}</h1>
        <ul>
          <li>first name: {bio.firstName}</li>
          <li>last name: {bio.lastName}</li>
          <li>city: {bio.city}</li>
          <li>state: {bio.state}</li>
          <li>img: {bio.profileImg}</li>
          <li>email: {bio.email}</li>
          <li>created on: {bio.createdOn}</li>
          <li>phone number: {bio.phoneNumber}</li>
          <li>following: {bio.following.length}</li>
          <li>followed: {bio.followed.length}</li>
          <li>is private: {JSON.stringify(bio.isPrivate)}</li>
          <li>is admin: {JSON.stringify(bio.isAdmin)}</li>
           </ul>
          <ul>
            games hosted pending:{" "}
            {gamesHostedPending.map((el) => (
              <li key={el.id}>{el.id}</li>
            ))}
          </ul>
          <ul>
            games hosted resolved:{" "}
            {gamesHostedResolved.map((el) => (
              <li key={el.id}>{el.id}</li>
            ))}
          </ul>
          <ul>
            games joined pending:{" "}
            {gamesJoinedPending.map((el) => (
              <li key={el.id}>{el.id}</li>
            ))}
          </ul>
          <ul>
            games joined resolved:{" "}
            {gamesJoinedResolved.map((el) => (
              <li key={el.id}>{el.id}</li>
            ))}
          </ul>
       
      </div>
    );
  }
}

export default UserDetails;
