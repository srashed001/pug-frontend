import { useParams } from "react-router-dom"

function UserDetails(){

    const {username} = useParams();
    console.debug("UserDetails", "username=", username)

    return (
        <h1>User Details: {username}</h1>
    )
}

export default UserDetails