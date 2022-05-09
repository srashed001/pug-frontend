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

const initialState = usersAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const resp = await PugApi.getUsers();
  return resp;
});

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (username, { dispatch }) => {
    const resultPromise = PugApi.getCurrentUser(username);
    resultPromise.then((data) => {
      const allGames = _.union(
        data.games.hosted.resolved,
        data.games.hosted.pending,
        data.games.joined.resolved,
        data.games.joined.pending
      );
      dispatch(updateGames(allGames));
    });

    return resultPromise;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserStatus: (state) => {
      return { ...state, status: initialState.status };
    },
    updateUsers: (state, action) => {
      usersAdapter.upsertMany(state, action.payload);
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
        usersAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetUserStatus, updateUsers } = usersSlice.actions;

export default usersSlice.reducer;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);
