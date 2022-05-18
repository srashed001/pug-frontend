import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMessage } from "../store/threads/threadsSlice";

function NewThread() {
  const my = useSelector((state) => state.my);
  const dispatch = useDispatch()
  const [users, setUsers] = useState([my.username]);
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

 function handleChangeMessage(evt){
     setMessage(evt.target.value)

 }

  function handleChangeUsers(evt) {
    if (evt.target.checked) {
      console.log(evt.target.checked, evt.target.id);
      setUsers((state) => [...state, evt.target.id]);
    } else {
      setUsers((state) => state.filter((id) => id !== evt.target.id));
    }
  }

  function testCreateMessage(){
      const data = {
          message,
          users,
          username: my.username

      }
      dispatch(createMessage(data))
      navigate(`/threads/inbox`)
      

  }
 
  if (my.status === "succeeded") {

    return (
      <div>
        <div>
          {my.follows.ids.map((id) => {
            return (
              <div key={id}>
                <label>{id}</label>
                <input type="checkbox" onChange={handleChangeUsers} id={id} />
              </div>
            );
          })}
        </div>
        <div>
            <input type='text' value={message} onChange={handleChangeMessage} />
        </div>
        <div> 
            <button onClick={testCreateMessage} >send</button>
        </div>
      </div>
    );
  }
}

export default NewThread;
