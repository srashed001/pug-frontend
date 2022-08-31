import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import PugApi from "../../api/api";
import _ from "lodash";
import { updateGames } from "../games/gamesSlice";
import { updateInvites } from "../invites/invitesSlice";
import { updateFollowers, updateUsers } from "../users/usersSlice";
import { updateThreads } from "../threads/threadsSlice";

export const myAdapter = createEntityAdapter({
  selectId: (my) => my.username || my.id || my.primaryuser,
});

const initialState = {
  status: "idle",
  error: null,
  username: null,
  user: null,
  activity: [],
  myActivity: [],
  tab: 0,
  gamesHostedPending: myAdapter.getInitialState(),
  gamesHostedResolved: myAdapter.getInitialState(),
  gamesJoinedPending: myAdapter.getInitialState(),
  gamesJoinedResolved: myAdapter.getInitialState(),
  invitesReceived: myAdapter.getInitialState(),
  invitesSent: myAdapter.getInitialState(),
  inactiveGames: myAdapter.getInitialState(),
  follows: myAdapter.getInitialState(),
  followers: myAdapter.getInitialState(),
};

export const toggleRelationship = createAsyncThunk(
  `my/toggleRelationship`,
  async ({ username, followed }, { dispatch, rejectWithValue }) => {
    try {
      const resp = await PugApi.toggleRelationship(username, followed);
      dispatch(updateFollowers(resp));
      return resp;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const fetchMyActivity = createAsyncThunk(
  `my/fetchMyActivity`,
  async (username, { rejectWithValue }) => {
    try {
      const activity = await PugApi.getUserActivity(username);
      return activity;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const fetchInitialMy = createAsyncThunk(
  "my/fetchInitialMy",
  async (username, { dispatch, rejectWithValue }) => {
    try {
      const user = await PugApi.getCurrentUser(username);
      const invites = await PugApi.getInvites(username);
      const threads = await PugApi.getThreads(username);
      const inactiveGames = await PugApi.getInactiveGames(username);
      dispatch(updateThreads(threads));
      const allGames = _.union(
        user.games.hosted.resolved,
        user.games.hosted.pending,
        user.games.joined.resolved,
        user.games.joined.pending
      );
      const allUsers = _.union(user.followers, user.follows);
      dispatch(updateGames(allGames));
      dispatch(updateUsers(allUsers));
      const allInvites = _.union(invites.received, invites.sent);
      dispatch(updateInvites(allInvites));
      return [user, invites, inactiveGames];
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const updateProfile = createAsyncThunk(
  `my/updateProfile`,
  async ({ username, data }, { rejectWithValue, dispatch }) => {
    try {
      const update = await PugApi.editUserProfile(username, data);
      dispatch(updateUsers([update]))
      return update;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const acceptInvite = createAsyncThunk(
  `my/acceptInvite`,
  async ({ username, id }, { rejectWithValue }) => {
    try {
      const update = await PugApi.updateInvite(username, "accept", id);
      return update;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const denyInvite = createAsyncThunk(
  `my/denyInvite`,
  async ({ username, id }, { rejectWithValue }) => {
    try {
      const update = await PugApi.updateInvite(username, "deny", id);
      return update;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const cancelInvite = createAsyncThunk(
  `my/cancelInvite`,
  async ({ username, id }, { rejectWithValue }) => {
    try {
      const update = await PugApi.updateInvite(username, "cancel", id);
      return update;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const mySlice = createSlice({
  name: "my",
  initialState,
  reducers: {
    setTab(state, action) {
      try {
        return {...state, tab: action.payload}
      } catch (err) {
        state.status = "failed";
        state.error = { message: err.message };
      }
    },
    resetMyStatus(state, action) {
      return { ...state, status: "idle" };
    },
    resetMy(state, action) {
      return initialState;
    },
    updateMyInvites(state, action) {
      try {
        const invites = action.payload;
        if (!_.isEqual(state.invitesReceived, invites.received))
          state.invitesReceived = invites.received.map((invite) => invite.id);
        if (!_.isEqual(state.invitesSent, invites.sent))
          state.invitesSent = invites.sent.map((invite) => invite.id);
      } catch (err) {
        state.status = "failed";
        state.error = { message: err.message };
      }
    },
    updateInactiveGames(state, action) {
      try {
        const { action: status, game } = action.payload;
        if (status === "deactivated") {
          myAdapter.upsertOne(state.inactiveGames, game);
          game.daysDiff < 0
            ? myAdapter.removeOne(state.gamesHostedResolved, game.id)
            : myAdapter.removeOne(state.gamesHostedPending, game.id);
        } else if (status === "reactivated") {
          myAdapter.removeOne(state.inactiveGames, game.id);
          game.daysDiff < 0
            ? myAdapter.upsertOne(state.gamesHostedResolved, game)
            : myAdapter.upsertOne(state.gamesHostedPending, game);
        }
      } catch (err) {
        state.status = "failed";
        state.error = { message: err.message };
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMyActivity.pending, (state, action) => {})
      .addCase(fetchMyActivity.fulfilled, (state, action) => {
        const { activity, myActivity } = action.payload;
        state.activity = activity;
        state.myActivity = myActivity;
      })
      .addCase(fetchMyActivity.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(fetchInitialMy.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchInitialMy.fulfilled, (state, action) => {
        state.status = "succeeded";
        const [user, invites, inactiveGames] = action.payload;
        const { follows, followers, games, ...userInfo } = user;
        state.username = action.meta.arg;
        state.user = userInfo;
        myAdapter.setAll(state.inactiveGames, inactiveGames);

        myAdapter.setAll(state.gamesHostedPending, games.hosted.pending);

        myAdapter.setAll(state.gamesHostedResolved, games.hosted.resolved);

        myAdapter.setAll(state.gamesJoinedPending, games.joined.pending);

        myAdapter.setAll(state.gamesJoinedResolved, games.joined.resolved);

        myAdapter.setAll(state.invitesReceived, invites.received);

        myAdapter.setAll(state.invitesSent, invites.sent);

        myAdapter.setAll(state.follows, follows);

        myAdapter.setAll(state.followers, followers);
      })
      .addCase(fetchInitialMy.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(toggleRelationship.pending, (state, action) => {})
      .addCase(toggleRelationship.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { action: status, followed } = action.payload;
        if (status === "unfollowed")
          myAdapter.removeOne(state.follows, followed);
        else myAdapter.upsertOne(state.follows, { username: followed });
      })
      .addCase(toggleRelationship.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(updateProfile.pending, (state, action) => {})
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(acceptInvite.pending, (state, action) => {
      })
      .addCase(acceptInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        const invite = action.payload;
        myAdapter.upsertOne(state.invitesReceived, invite);
      })
      .addCase(acceptInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(denyInvite.pending, (state, action) => {
      })
      .addCase(denyInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        const invite = action.payload;
        myAdapter.upsertOne(state.invitesReceived, invite);
      })
      .addCase(denyInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(cancelInvite.pending, (state, action) => {
      })
      .addCase(cancelInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        const invite = action.payload;
        myAdapter.upsertOne(state.invitesSent, invite);
      })
      .addCase(cancelInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      });
  },
});

export const {
  resetMyStatus,
  updateMyUsername,
  updateMyInvites,
  updateInactiveGames,
  resetMy,
  setTab,
} = mySlice.actions;

export default mySlice.reducer;

export const {
  selectAll: selectMyInactiveGames,
  selectById: selectInactiveGameById,
  selectIds: selectInactiveGameIds,
} = myAdapter.getSelectors((state) => state.my.inactiveGames);

export const {
  selectAll: selectAllActivity,
  selectById: selectActivityById,
  selectIds: selectActivityIds,
} = myAdapter.getSelectors((state) => state.my.activity);
