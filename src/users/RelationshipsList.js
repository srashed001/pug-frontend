import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import LoadingSpinner from "../common/LoadingSpinner"
import { fetchRelationships, fetchUser, resetFollowStatus, resetUserStatus, selectUserById } from "../store/users/usersSlice"
import RelationshipCard from "./RelationshipCard"

function RelationshipsList(){
    const {username} = useParams()
    const user = useSelector(state => selectUserById(state, username))
    const userStatus = useSelector(state => state.users.status)
    const followStatus = useSelector(state => state.users.followStatus)
    const my = useSelector(state => state.my)
    const error = useSelector(state => state.users.error)
    const dispatch = useDispatch()
    const [fetched, setFetched] = useState(false)
    const [state, setState] = useState('followers')

    useEffect(()=>{
        if(userStatus === 'idle' && my.status === 'succeeded') dispatch(fetchUser(username))
    }, [dispatch, my.status, userStatus, username])


    if(userStatus === 'loading') return <LoadingSpinner />
    else if(userStatus === 'failed') return <div>{error}</div>
    else if(userStatus === 'succeeded'  ){
        console.log(user, followStatus)
        const relationships = state === 'followers' ? user.followers.entities : user.follows.entities

        return (
            <div>
                <div>
                    <button onClick={()=>setState('followers')}>followers</button>
                    <button onClick={()=>setState('follows')}>follows</button>
                </div>
                <div>
                       {Object.values(relationships).map(user => (
                    <RelationshipCard user={user} />
                ))}
                </div>
             
            </div>
        )
    }

}

export default RelationshipsList