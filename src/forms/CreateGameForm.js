import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGame } from "../store/games/gamesSlice";

function CreateGameForm(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const my = useSelector(state => state.my)

    // eslint-disable-next-line no-extend-native
    Date.prototype.addDays = function (days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        date.setHours(date.getHours() - 7);
        return date;
      };
  
      let date = new Date();
      date = date.addDays(4).toJSON().slice(0, 10);

    const data = {
        title: 'test game 002',
        description: 'testing the description',
        date,
        time: "12:00:00",
        address: `3400 avenue of the arts`,
        city: "Irvine",
        state: 'CA',
        createdBy: my.username
         
    }

    function testCreateGame(){
        dispatch(createGame(data)).unwrap().then(data => {
            navigate(`/invites/${data.id}`)

        })
        
    }

    return (
        <div>
            <h1>create game form</h1>
            <button onClick={testCreateGame}>create game</button>
        </div>
    )

}

export default CreateGameForm