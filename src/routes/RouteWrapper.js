import { useSelector } from "react-redux"
import { useErrorHandler } from "react-error-boundary";
import MemberRoutes from "./MemberRoutes";
import PublicRoutes from "./PublicRoutes";


function RouteWrapper({token, login, signup}){
    const myStatus = useSelector(state => state.my.status) === 'failed'
    const commentsStatus = useSelector(state => state.comments.status) === 'failed'
    const courtsStatus = useSelector(state => state.courts.status) === 'failed'
    const gameStatus = useSelector(state => state.games.status.game) === 'failed'
    const gamesStatus = useSelector(state => state.games.status.games) === 'failed'
    const invitesStatus = useSelector(state => state.invites.status) === 'failed'
    const threadsStatus = useSelector(state => state.threads.status) === 'failed'
    const userStatus = useSelector(state => state.users.status.user) === 'failed'
    const usersStatus = useSelector(state => state.users.status.users) === 'failed'
  
    const myError = useSelector(state => state.my.error)
    const commentsError = useSelector(state => state.comments.error)
    const courtsError = useSelector(state => state.courts.error)
    const gamesError = useSelector(state => state.games.error)
    const invitesError = useSelector(state => state.invites.error)
    const threadsError = useSelector(state => state.threads.error)
    const usersError = useSelector(state => state.users.error)
    const handleError = useErrorHandler();

    if(myStatus){
        handleError(myError)

    }
    if(commentsStatus){
        handleError(commentsError)

    }
    if(courtsStatus){
        handleError(courtsError)

    }
    if(gameStatus){
        handleError(gamesError)

    }
    if(gamesStatus){
        handleError(gamesError)

    }
    if(invitesStatus){
        handleError(invitesError)

    }
    if(threadsStatus){
        handleError(threadsError)

    }
    if(usersStatus){
        handleError(usersError)

    }
    if(userStatus){
        handleError(usersError)

    }

    return token ? <MemberRoutes login={login} signup={signup} /> : <PublicRoutes login={login} signup={signup} />



}

export default RouteWrapper
