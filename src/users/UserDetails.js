import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { fetchUser, resetUserStatus } from "../store/users/usersSlice";

function UserDetails() {
  const { username } = useParams();
  console.debug("UserDetails", "username=", username);

  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.users.status);
  const users = useSelector((state) => state.users.entities);
  const error = useSelector((state) => state.users.errors);


  useLayoutEffect(()=>{
     return () => {
      dispatch(resetUserStatus());
    };
  }, [])

  useEffect(() => {
    console.log(`userdetails useEffect`, userStatus);
    dispatch(fetchUser(username));
  }, []);

  if (userStatus === "loading") {
    return <LoadingSpinner />;
  } else if (userStatus === "failed") {
    return <div>{error}</div>;
  } else if (userStatus === "succeeded") {
    const bio = users[username];

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
          { bio.following && <li>following: {bio.following.length}</li>}
          {bio.followed && <li>followed: {bio.followed.length}</li>}
          <li>is private: {JSON.stringify(bio.isPrivate)}</li>
          <li>is admin: {JSON.stringify(bio.isAdmin)}</li>
        </ul>
      </div>
    );
  }
}

export default UserDetails;
