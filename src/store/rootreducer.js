import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./games/gamesSlice";

export default configureStore({
    reducer: {
        games: gamesReducer,
    }
})
