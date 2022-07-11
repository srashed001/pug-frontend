import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./games/gamesSlice";
import usersReducer from "./users/usersSlice"
import commentsReducer from './comments/commentsSlice'
import myReducer from './my/mySlice'
import invitesReducer from './invites/invitesSlice'
import threadReducer from './threads/threadsSlice'



export default configureStore({
    reducer: {
        games: gamesReducer,
        users: usersReducer,
        comments: commentsReducer, 
        invites: invitesReducer, 
        threads: threadReducer,
        my: myReducer
    }
})
