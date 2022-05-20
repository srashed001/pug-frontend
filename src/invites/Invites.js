import { useDispatch, useSelector } from "react-redux";
import { acceptInvite, cancelInvite, denyInvite } from "../store/invites/invitesSlice";


function Invite({ invite, state }) {
  const my = useSelector(state => state.my)
  const { id, gameId: game, fromUser, toUser, status, createdOn } = invite
  const dispatch = useDispatch()

  function testAcceptInvite(){
    const data = {
      username: my.username,
      id
    }
    dispatch(acceptInvite(data))
  }

  function testDenyInvite(){
    const data = {
      username: my.username,
      id
    }
    dispatch(denyInvite(data))
  }

  function testCancelInvite(){
    const data = {
      username: my.username,
      id
    }
    dispatch(cancelInvite(data))
  }
  

  return (
    <div>
      <p>id: {id}</p>
      <p>game: {game}</p>
      <p>from: {fromUser}</p>
      <p>to: {toUser}</p>
      <p>status: {status}</p>
      <p>createdOn: {createdOn}</p>
      {state === "received" ? (
        <div>
          <button onClick={testAcceptInvite}>accept</button>
          <button onClick={testDenyInvite}>deny</button>
        </div>
      ) : (
        <button onClick={testCancelInvite}>cancel</button>
      )}

      <br></br>
    </div>
  );
}

export default Invite;
