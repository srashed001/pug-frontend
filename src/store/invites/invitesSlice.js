import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
  } from "@reduxjs/toolkit";
  import PugApi from "../../api/api";

  
  export const invitesAdapter = createEntityAdapter();
  
  const initialState = invitesAdapter.getInitialState({
    status: "idle",
    error: null,
  });
  
//   export const fetchInitialMe = createAsyncThunk("me/fetchInitialMe", async (username) => {
//       const detailsAndGames = PugApi.getCurrentUser(username)
//       const invites = PugApi.getInvites(username)
//     return {
//         details: detailsAndGames.details.username,
//         games: detailsAndGames.games,
//         invites: invites.invites
//     };
//   });
  
//   export const fetchGame = createAsyncThunk("games/fetchGame", async (gameId, {dispatch}) => {
//     const resultPromise = PugApi.getGame(gameId)
//     resultPromise.then(data => dispatch(updateComments(data.comments)))
//     resultPromise.then(data => dispatch(updateUsers(data.players)))
  
//     return resultPromise
//   });
  
//   export const joinGame = createAsyncThunk("games/joinGame", async (data, {dispatch}) => {
//     const {gameId, username} = data
//     const resultPromise = PugApi.joinGame(gameId, username)
//     resultPromise.then(data => dispatch(updateUsers(data)))
  
//     return resultPromise
//   });
  
//   export const leaveGame = createAsyncThunk("games/leaveGame", async (data, {dispatch}) => {
//     const {gameId, username} = data
//     const resultPromise = PugApi.leaveGame(gameId, username)
//     resultPromise.then(data => dispatch(updateUsers(data)))
  
//     return resultPromise
//   });
  
  export const invitesSlice = createSlice({
    name: "me",
    initialState,
    reducers: {
      resetInviteStatus(state, action) {
        state.status = "idle";
      },
      updateInvites(state, action) {
        invitesAdapter.upsertMany(state, action.payload)
      },
    },
    // extraReducers(builder) {
    //   builder
    //     .addCase(fetchInitialMe.pending, (state, action) => {
    //       state.status = "loading";
    //     })
    //     .addCase(fetchInitialMe.fulfilled, (state, action) => {
    //       state.status = "succeeded";
    //       console.log(action.payload)
    //     })
    //     .addCase(fetchInitialMe.rejected, (state, action) => {
    //       state.status = "failed";
    //       state.error = action.error.message;
    //     });
    // },
  });
  
  export const { updateInvites } = invitesSlice.actions;
  
  export default invitesSlice.reducer;
  
//   export const {
//     selectAll: selectAllGames,
//     selectById: selectGameById,
//     selectIds: selectGameIds,
//   } = invitesAdapter.getSelectors((state) => state.games);
  