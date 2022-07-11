import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../common/LoadingSpinner";
import { toggleRelationship } from "../store/my/mySlice";
import { fetchUsers, resetUserStatus, selectAllUsers } from "../store/users/usersSlice";
import UserCard from "./UserCard";

function UsersList() {
  console.debug("UsersList");

  const dispatch = useDispatch();
  const allIds = useSelector(state => state.users.ids)
  const byId = useSelector(state => state.users.entities)
  const users = useSelector(selectAllUsers)
  const my = useSelector(state => state.my)

  const usersStatus = useSelector(state => state.users.status.users)
  const userStatus = useSelector(state => state.users.status.user)
  const error = useSelector(state => state.users.error)


  // useEffect(() => {
  //   return () => {
  //   console.log(`in userlist useeffect dispatch reset user`)
  //    dispatch(resetUserStatus())
  //     console.log(userStatus)
  //   }
  // }, []);

  useEffect(() => {
    console.log("UserList useEffect", usersStatus);
    if(usersStatus === 'idle' && my.status === 'succeeded'){
      console.log('running useEffect')
      dispatch(fetchUsers())
    }
  }, [dispatch, my.status, usersStatus]);

  let content; 

  if (usersStatus === 'loading') content = <LoadingSpinner />
  else if (usersStatus === 'failed') content = <div>{error}</div>
  else if (usersStatus === 'succeeded') {
    console.log(users)
    content = users.map(user => (
      <div key={user.username}>

        <UserCard  user={user} />        
        <hr></hr>
      </div>
    
    ));
  }
  


  return (
    <div>
      <h1>UsersList</h1>
      {content}
    </div>
  );
}

export default UsersList;
