import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../common/LoadingSpinner";
import { fetchUsers, resetUserStatus } from "../store/users/usersSlice";
import UserCard from "./UserCard";

function UsersList() {
  console.debug("UsersList");

  const dispatch = useDispatch();
  const allIds = useSelector(state => state.users.ids)
  const byId = useSelector(state => state.users.entities)

  const userStatus = useSelector(state => state.users.status)
  const error = useSelector(state => state.users.error)




  useEffect(() => {
    return () => {
     dispatch(resetUserStatus())
      console.log(userStatus)
    }
  }, []);

  useEffect(() => {
    console.log("UserList useEffect");
    if(userStatus === 'idle'){
      dispatch(fetchUsers())
    }
  }, [dispatch, userStatus]);

  let content; 

  if (userStatus === 'loading') content = <LoadingSpinner />
  else if (userStatus === 'failed') content = <div>{error}</div>
  else if (userStatus === 'succeeded') {
    console.log(byId)
    content = allIds.map(id => <UserCard key={id} user={byId[id]} />);
  }
  


  return (
    <div>
      <h1>UsersList</h1>
      {content}
    </div>
  );
}

export default UsersList;
