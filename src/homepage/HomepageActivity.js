import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import PugApi from "../api/api"
import { fetchMyActivity, selectAllActivity } from "../store/my/mySlice"



function HomepageActivity({username}){
    const activity = useSelector(state => state.my.activity)
    const dispatch = useDispatch()
    const my = useSelector(state => state.my)

  

    useEffect(() => {
        if(my.status === 'succeeded'){

            dispatch(fetchMyActivity(my.username))
        }
    }, [])

    console.log(activity)

    return (
        <div>Activity</div>
    )

}

export default HomepageActivity