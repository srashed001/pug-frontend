import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import _ from "lodash";

import PugApi from "../../api/api";
import { updateGames } from "../games/gamesSlice";

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.username || user.user.username,
});

const followAdapter = createEntityAdapter({
  selectId: (user) => user.username,
});

const initialState = usersAdapter.getInitialState({
  status: "idle",
  followStatus: "idle",
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
  async (username, { dispatch }) => {
    console.log(`fetch User`)
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
      dispatch(initializeRelationships(data))
      dispatch(updateUsers(allUsers))
    })

    return PugApi.getCurrentUser(username);
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserStatus: (state) => {
      return { ...state, status: initialState.status };
    },
    initializeRelationships: (state, action) => {
      console.log(action.payload)
      usersAdapter.upsertOne(state, action.payload)
      state.entities[action.payload.username].followers = followAdapter.getInitialState()
      state.entities[action.payload.username].follows = followAdapter.getInitialState()
    },
    resetFollowStatus: (state) => {
      return { ...state, followStatus: initialState.followStatus };
    },
    updateUsers: (state, action) => {
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
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        usersAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { followers, follows } = action.payload;
        console.log(followers, follows, action.payload)
        if(followers.length) followAdapter.upsertMany(state.entities[action.meta.arg].followers, followers)
        if(follows.length) followAdapter.upsertMany(state.entities[action.meta.arg].follows, follows)
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
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
