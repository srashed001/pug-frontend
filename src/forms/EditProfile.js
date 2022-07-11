import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../common/LoadingSpinner";
import { resetMyStatus, updateProfile } from "../store/my/mySlice";


function EditProfile() {
  const my = useSelector((state) => state.my);
  const users = useSelector((state) => state.users.entities);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(false)

  const data = {
    city: "Irvine",
    email: "test5@test.com",
    firstName: "Sami",
    isPrivate: false,
    lastName: "Davis",
    profileImg: "http://f1.img",
    state: "CA",
  };

  useEffect(() => {
    return () => {
      dispatch(resetMyStatus());
      setFetched(true)
    };
  }, []);

  function testEditProfile() {
    dispatch(updateProfile({username: my.username, data}));
    setFetched(false)
  }

  if (my.status === "loading") {
    return <LoadingSpinner />;
  } else if (my.status === "failed") {
    return <div>{my.error}</div>;
  } else if (my.status === "succeeded") {
    const bio = my.user
    console.log(bio);
    // const gamesHostedPending = me.games.hosted.pending;
    // const gamesHostedResolved = me.games.hosted.resolved;
    // const gamesJoinedPending = me.games.joined.pending;
    // const gamesJoinedResolved = me.games.joined.resolved;

    return (
      <div>
        <h1>User Details: {my.username}</h1>
        <button onClick={testEditProfile}>update</button>
        <ul>
          <li>first name: {bio.firstName}</li>
          <li>last name: {bio.lastName}</li>
          <li>city: {bio.city}</li>
          <li>state: {bio.state}</li>
          <li>img: {bio.profileImg}</li>
          <li>email: {bio.email}</li>
          <li>created on: {bio.createdOn}</li>
          <li>phone number: {bio.phoneNumber}</li>
          <li>following: {my.follows.ids.length}</li>
          <li>followed: {my.followers.ids.length}</li>
          <li>is private: {JSON.stringify(bio.isPrivate)}</li>
          <li>is admin: {JSON.stringify(bio.isAdmin)}</li>
        </ul>
        {/* <ul>
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
        </ul> */}
      </div>
    );
  }
}

export default EditProfile;
