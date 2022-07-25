import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
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
  status: {
    user: "idle",
    users: "idle",
  },
  error: null,
});

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (data, { rejectWithValue }) => {
    try {
      const users = await PugApi.getUsers();
      return users;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);
export const fetchRelationships = createAsyncThunk(
  "users/fetchRelationships",
  async (username, { rejectWithValue }) => {
    try {
      const relationships = await PugApi.getRelationships(username);
      return relationships;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (username, { dispatch, rejectWithValue }) => {
    try {
      const result = await PugApi.getCurrentUser(username);
      const allGames = _.union(
        result.games.hosted.resolved,
        result.games.hosted.pending,
        result.games.joined.resolved,
        result.games.joined.pending
      );
      const allUsers = _.union(result.followers, result.follows);
      dispatch(initializeRelationships(username));
      dispatch(updateGames(allGames));
      dispatch(updateUsers(allUsers));

      return result;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserStatus: (state) => ({
      ...state,
      status: { ...state.status, user: "idle" },
    }),
    resetUsersStatus: (state) => ({
      ...state,
      status: { ...state.status, users: "idle" },
    }),
    initializeRelationships: (state, action) => {
      try {
        const initialUser = {
          username: action.payload,
          followers: followAdapter.getInitialState(),
          follows: followAdapter.getInitialState(),
        };
        usersAdapter.upsertOne(state, initialUser);
      } catch (err) {
        state.status.user = "failed";
        state.error = { message: err.message };
      }
    },
    updateUsers: (state, action) => {
      try {
        usersAdapter.upsertMany(state, action.payload);
      } catch (err) {
        state.status.users = "failed";
        state.error = { message: err.message };
      }
    },
    updateFollowers: (state, action) => {
      try {
        const { action: status, follower, followed } = action.payload;
        if (status === "followed")
          followAdapter.upsertOne(state.entities[followed].followers, {
            username: follower,
          });
        else
          followAdapter.removeOne(state.entities[followed].followers, follower);
      } catch (err) {
        state.status.user = "failed";
        state.error = { message: err.message };
      }
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
        state.error = { message: action.payload };
      })
      .addCase(fetchUser.pending, (state, action) => {
        state.status.user = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status.user = "succeeded";
        const { followers, follows, ...user } = action.payload;
        usersAdapter.upsertOne(state, user);
        followAdapter.upsertMany(
          state.entities[user.username].followers,
          followers
        );
        followAdapter.upsertMany(
          state.entities[user.username].follows,
          follows
        );
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status.user = "failed";
        state.error = { message: action.payload };
      })
      .addCase(fetchRelationships.pending, (state, action) => {
        state.followStatus = "loading";
      })
      .addCase(fetchRelationships.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        const { follows, followers } = action.payload;
        const userEntry = state.entities[action.meta.arg];
        if (follows.length)
          followAdapter.upsertMany(userEntry.follows, follows);
        if (followers.length)
          followAdapter.upsertMany(userEntry.followers, followers);
      })
      .addCase(fetchRelationships.rejected, (state, action) => {
        state.followStatus = "failed";
        state.error = { message: action.payload };
      });
  },
});

export const {
  resetUserStatus,
  resetUsersStatus,
  updateUsers,
  updateFollowers,
  initializeRelationships,
  resetUserError,
} = usersSlice.actions;

export default usersSlice.reducer;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);

export const selectAllActiveUsers = createSelector(
  [selectAllUsers, (state, username) => username],
  (users, username) => users.filter((user) => user.username !== username)
);
