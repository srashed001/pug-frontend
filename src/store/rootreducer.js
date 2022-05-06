import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./games/gamesSlice";
import usersReducer from "./users/usersSlice"

export default configureStore({
    reducer: {
        games: gamesReducer,
        users: usersReducer
    }
})
