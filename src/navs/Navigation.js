import { useContext } from "react";
import LoggedInNav from "./LoggedInNav"
import PublicNav from "./PublicNav"
import UserContext from "../auth/UserContext"

/** Navigation bar component
 * 
 * when user logged, renders nav bar with additional resources
 * 
 * rendered by app
 */

function Navigation({logout}){
    const { currentUser } = useContext(UserContext)
    if(currentUser) return <LoggedInNav />
    
    return <PublicNav />

}

export default Navigation