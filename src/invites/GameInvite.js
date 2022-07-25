import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createInvites } from "../store/invites/invitesSlice";

function GameInvite() {
  const my = useSelector((state) => state.my);
  const dispatch = useDispatch()
  const [toUsers, setToUsers] = useState([]);
  const {gameId} = useParams()
  const navigate = useNavigate()

  function handleChangeUsers(evt) {
    if (evt.target.checked) {
      setToUsers((state) => [...state, evt.target.id]);
    } else {
      setToUsers((state) => state.filter((id) => id !== evt.target.id));
    }
  }

  function handleCreateInvite(){
      const data = {
        toUsers,
        gameId,
        username: my.username
      }
      dispatch(createInvites(data))

      navigate(`/games/g/${gameId}`)
      

  }
 
  if (my.status === "succeeded") {

    return (
      <div>
        <div>
          {my.follows.ids.map((id) => {
            if(id !== my.username) 
            return (
              <div key={id}>
                <label>{id}</label>
                <input type="checkbox" onChange={handleChangeUsers} id={id} />
              </div>
            );
          })}
        </div>
        <div> 
            <button onClick={handleCreateInvite} >send</button>
        </div>
      </div>
    );
  }
}

export default GameInvite