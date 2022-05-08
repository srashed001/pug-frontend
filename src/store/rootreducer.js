import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./games/gamesSlice";
import usersReducer from "./users/usersSlice"
import commentsReducer from './comments/commentsSlice'

export default configureStore({
    reducer: {
        games: gamesReducer,
        users: usersReducer,
        comments: commentsReducer
    }
})
