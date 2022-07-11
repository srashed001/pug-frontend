import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
  } from "@reduxjs/toolkit";
  import _ from "lodash";
  
  import PugApi from "../../api/api";

  
  const courtsAdapter = createEntityAdapter({
    selectId: court => court.place_id
  });
  

  
  const initialState = courtsAdapter.getInitialState({
    status: 'idle',
    nextPageToken: null,
    error: null,
  });


  


  const courtsSlice = createSlice({
    name: "courts",
    initialState,
    reducers: {

        updateCourts: (state, action) => {
            const {results, next_page_token} = action.payload
            console.log(results)
            state.status = 'succeeded';
            state.nextPageToken = next_page_token
            courtsAdapter.setAll(state, results)
        }
    },
    // extraReducers(builder) {
    //   builder
    //     .addCase(fetchUsers.pending, (state, action) => {
    //       state.status.users = "loading";
    //     })
    //     .addCase(fetchUsers.fulfilled, (state, action) => {
    //       state.status.users = "succeeded";
    //       usersAdapter.setAll(state, action.payload);
    //     })
    //     .addCase(fetchUsers.rejected, (state, action) => {
    //       state.status.users = "failed";
    //       state.error = action.error.message;
    //     })
    //     .addCase(fetchUser.pending, (state, action) => {
    //       state.status.user = "loading";
    //     })
    //     .addCase(fetchUser.fulfilled, (state, action) => {
          
    //       const { followers, follows } = action.payload;
    //       console.log(followers, follows, action.payload)
    //       if(followers.length) followAdapter.upsertMany(state.entities[action.meta.arg].followers, followers)
    //       if(follows.length) followAdapter.upsertMany(state.entities[action.meta.arg].follows, follows)
    //       state.status.user = "succeeded";
    //     })
    //     .addCase(fetchUser.rejected, (state, action) => {
    //       state.status.user = "failed";
    //       state.error = action.error.message;
    //     })
    //     .addCase(fetchRelationships.pending, (state, action) => {
    //       state.followStatus = "loading";
    //     })
    //     .addCase(fetchRelationships.fulfilled, (state, action) => {
    //       state.followStatus = "succeeded";
    //       console.log(`fetchRElationships.fullfilled`);
    //       console.log(action.payload)
    //       const {follows, followers} = action.payload
    //       const userEntry = state.entities[action.meta.arg]
    //       if(follows.length) followAdapter.upsertMany(userEntry.follows, follows)
    //       if(followers.length) followAdapter.upsertMany(userEntry.followers, followers)
    //     })
    //     .addCase(fetchRelationships.rejected, (state, action) => {
    //       state.followStatus = "failed";
    //       state.error = action.error.message;
    //     });
    // },
  });
  
  export const {
      getCourts,
      updateCourts
  } = courtsSlice.actions;
  
  export default courtsSlice.reducer;
  
  export const {
    selectAll: selectAllCourts,
    selectById: selectCourtById,
    selectIds: selectCourtIds,
  } = courtsAdapter.getSelectors((state) => state.courts);
  