import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import _, { result } from "lodash";

import PugApi from "../../api/api";
import { updateGames } from "../games/gamesSlice";

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.username || user.user.username,
});

const followAdapter = createEntityAdapter({
  selectId: (user) => user.username,



});


const initialState = usersAdapter.getInitialState({
  status: {
    user: 'idle',
    users: 'idle'
  },
  error: null,
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const resp = await PugApi.getUsers();
  return resp;
});
export const fetchRelationships = createAsyncThunk(
  "users/fetchRelationships",
  async (username) => {
    const resp = await PugApi.getRelationships(username);
    return resp;
  }
);



export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (username, { dispatch, getState }) => {
    console.log(`fetch User`)

    dispatch(initializeRelationships(username))

    const resultPromise = PugApi.getCurrentUser(username);
    resultPromise.then((data) => {
      const allGames = _.union(
        data.games.hosted.resolved,
        data.games.hosted.pending,
        data.games.joined.resolved,
        data.games.joined.pending
      );
      const allUsers = _.union(data.followers, data.follows);
      dispatch(updateGames(allGames));
      dispatch(updateUsers(allUsers))
    })

    return resultPromise
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserStatus: (state) => {
      console.log(state)
      state.status.user = 'idle'},
    resetUsersStatus: (state) => state.status.users = 'idle',
    initializeRelationships: (state, action) => {
      const initialUser = {username: action.payload, followers: followAdapter.getInitialState(), follows: followAdapter.getInitialState()}
      console.log(action.payload)
      usersAdapter.upsertOne(state, initialUser)
    },
    resetFollowStatus: (state) => {
      return { ...state, followStatus: initialState.followStatus };
    },
    updateUsers: (state, action) => {
      console.log(action.payload)
      usersAdapter.upsertMany(state, action.payload);
    },
    updateFollowers: (state, action) => {
      const { action: status, follower, followed } = action.payload;
      if (status === "followed") followAdapter.upsertOne( state.entities[followed].followers, {username: follower} )
      else followAdapter.removeOne( state.entities[followed].followers, follower )
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status.users = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status.users = "succeeded";
        usersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status.users = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUser.pending, (state, action) => {
        state.status.user = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        
        state.status.user = "succeeded";
        const { followers, follows, ...user } = action.payload;
        console.log(followers, follows, action.payload)
        usersAdapter.upsertOne(state, user)
        followAdapter.upsertMany(state.entities[user.username].followers, followers)
        followAdapter.upsertMany(state.entities[user.username].follows, follows)
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status.user = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRelationships.pending, (state, action) => {
        state.followStatus = "loading";
      })
      .addCase(fetchRelationships.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        console.log(`fetchRElationships.fullfilled`);
        console.log(action.payload)
        const {follows, followers} = action.payload
        const userEntry = state.entities[action.meta.arg]
        if(follows.length) followAdapter.upsertMany(userEntry.follows, follows)
        if(followers.length) followAdapter.upsertMany(userEntry.followers, followers)
      })
      .addCase(fetchRelationships.rejected, (state, action) => {
        state.followStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  resetUserStatus,
  resetUsersStatus,
  updateUsers,
  updateFollowers,
  resetFollowStatus,
  initializeRelationships
} = usersSlice.actions;

export default usersSlice.reducer;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);
