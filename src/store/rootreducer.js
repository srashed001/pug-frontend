import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./games/gamesSlice";
import usersReducer from "./users/usersSlice"
import commentsReducer from './comments/commentsSlice'
import myReducer from './my/mySlice'
import invitesReducer from './invites/invitesSlice'
import threadReducer from './threads/threadsSlice'
import courtReducer from './courts/courtsSlice'



export default configureStore({
    reducer: {
        games: gamesReducer,
        users: usersReducer,
        comments: commentsReducer, 
        invites: invitesReducer, 
        threads: threadReducer,
        my: myReducer,
        courts: courtReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['courts/getCourts', 'courts/updateCourts'],
        // // Ignore these field paths in all actions
        // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // // Ignore these paths in the state
        ignoredPaths: ['courts.entities', `courts.nextPageToken`],
      },
    }),


})
