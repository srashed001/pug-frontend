import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import PugApi from "../../api/api";
import _ from "lodash";
import { updateGames } from "../games/gamesSlice";
import { updateInvites } from "../invites/invitesSlice";
import { initializeRelationships, updateFollowers, updateUsers } from "../users/usersSlice";
import { updateThreads } from "../threads/threadsSlice";

export const myAdapter = createEntityAdapter({
  selectId: (user) => user.username 
});

// const initialState = myAdapter.getInitialState({
//   status: "idle",
//   error: null,
// });
const initialState = {
  status: "idle", 
  error: null, 
  username: null,
  user: null, 
  gamesHostedPending: null,
  gamesHostedResolved: null,
  gamesJoinedPending: null, 
  invitesReceived: null,
  invitesSent: null,
  follows: myAdapter.getInitialState(),
  followers: myAdapter.getInitialState()
}



export const toggleRelationship = createAsyncThunk(`my/toggleRelationship`, async({username, followed}, {dispatch}) => {
  const resp =  PugApi.toggleRelationship(username, followed)
  resp.then(data => {
    dispatch(updateFollowers(data))
  })

  return resp
})

export const fetchInitialMy = createAsyncThunk(
  "my/fetchInitialMy",
  async (username, { dispatch }) => {
    const user = PugApi.getCurrentUser(username);
    const invites = PugApi.getInvites(username);
    const threads = PugApi.getThreads(username);

    threads.then(data => dispatch(updateThreads(data)))

    user.then((data) => {
      const allGames = _.union(
        data.games.hosted.resolved,
        data.games.hosted.pending,
        data.games.joined.resolved,
        data.games.joined.pending
      );
      const allUsers = _.union(data.followers, data.follows);
      dispatch(updateGames(allGames));
      dispatch(updateUsers(allUsers));
    })

    invites.then(data => {
      const allInvites = _.union(data.received, data.sent);
      dispatch(updateInvites(allInvites))
    })

    return Promise.all([user, invites])
  }
);

export const updateProfile = createAsyncThunk(
  `users/updateProfile`,
  async ({ username, data }, { dispatch }) => {
    return PugApi.editUserProfile(username, data);
  }
);


export const mySlice = createSlice({
  name: "my",
  initialState,
  reducers: {
    resetMyStatus(state, action) {
      state.status = "idle";
    },
    updateMyUsername(state, action){
      state.username = action.payload.username
    },
    updateMyInvites(state, action){
      const invites = action.payload
      if(!_.isEqual(state.invitesReceived, invites.received)) state.invitesReceived = invites.received.map(invite => invite.id)
      if(!_.isEqual(state.invitesSent, invites.sent)) state.invitesSent = invites.sent.map(invite => invite.id)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInitialMy.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchInitialMy.fulfilled, (state, action) => {
        state.status = "succeeded";
        const [user, invites] = action.payload
        const {follows, followers, games, ...userInfo} = user
        state.username = action.meta.arg
        state.user = userInfo
        state.gamesHostedPending = games.hosted.pending
        state.gamesHostedResolved = games.hosted.resolved
        state.gamesJoinedPending = games.joined.pending
        state.gamesJoinedResolved = games.joined.resolved
        state.invitesReceived = invites.received
        state.invitesSent = invites.sent
        if(follows.length)  myAdapter.upsertMany(state.follows, [...follows])
        if(followers.length) myAdapter.upsertMany(state.followers, [...followers])

      })
      .addCase(fetchInitialMy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleRelationship.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(toggleRelationship.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload)
        const {action: status, followed} = action.payload
        if(status === 'unfollowed') myAdapter.removeOne(state.follows, followed)
        else myAdapter.upsertOne(state.follows, {username: followed})
      })
      .addCase(toggleRelationship.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

  },
});

export const { resetMyStatus, updateMyUsername, updateMyInvites } = mySlice.actions;

export default mySlice.reducer;

//   export const {
//     selectAll: selectAllGames,
//     selectById: selectGameById,
//     selectIds: selectGameIds,
//   } = myAdapter.getSelectors((state) => state.games);
