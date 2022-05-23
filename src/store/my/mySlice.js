import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import PugApi from "../../api/api";
import _ from "lodash";
import { updateGames } from "../games/gamesSlice";
import { updateInvites } from "../invites/invitesSlice";
import {
  initializeRelationships,
  updateFollowers,
  updateUsers,
} from "../users/usersSlice";
import { updateThreads } from "../threads/threadsSlice";

export const myAdapter = createEntityAdapter({
  selectId: (my) => my.username || my.id,
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
  async ({ username, followed }, { dispatch }) => {
    const resp = PugApi.toggleRelationship(username, followed);
    resp.then((data) => {
      dispatch(updateFollowers(data));
    });

    return resp;
  }
);

export const fetchInitialMy = createAsyncThunk(
  "my/fetchInitialMy",
  async (username, { dispatch }) => {
    const user = PugApi.getCurrentUser(username);
    const invites = PugApi.getInvites(username);
    const threads = PugApi.getThreads(username);
    const inactiveGames = PugApi.getInactiveGames(username);

    threads.then((data) => dispatch(updateThreads(data)));

    user.then((data) => {
      const allGames = _.union(
        data.games.hosted.resolved,
        data.games.hosted.pending,
        data.games.joined.resolved,
        data.games.joined.pending
      );
      const allUsers = _.union(data.followers, data.follows, data);
      dispatch(updateGames(allGames));
      dispatch(updateUsers(allUsers));
    });

    invites.then((data) => {
      const allInvites = _.union(data.received, data.sent);
      dispatch(updateInvites(allInvites));
    });

    return Promise.all([user, invites, inactiveGames]);
  }
);

export const updateProfile = createAsyncThunk(
  `my/updateProfile`,
  async ({ username, data }, { dispatch }) => {
    return PugApi.editUserProfile(username, data);
  }
);

export const acceptInvite = createAsyncThunk(
  `my/acceptInvite`,
  async (data) => {
    const { username, id } = data;
    return PugApi.updateInvite(username, "accept", id);
  }
);

export const denyInvite = createAsyncThunk(`my/denyInvite`, async (data) => {
  const { username, id } = data;
  return PugApi.updateInvite(username, "deny", id);
});

export const cancelInvite = createAsyncThunk(
  `my/cancelInvite`,
  async (data) => {
    const { username, id } = data;
    return PugApi.updateInvite(username, "cancel", id);
  }
);

export const mySlice = createSlice({
  name: "my",
  initialState,
  reducers: {
    resetMyStatus(state, action) {
      state.status = "idle";
    },
    updateMyUsername(state, action) {
      state.username = action.payload.username;
    },
    updateMyInvites(state, action) {
      const invites = action.payload;
      if (!_.isEqual(state.invitesReceived, invites.received))
        state.invitesReceived = invites.received.map((invite) => invite.id);
      if (!_.isEqual(state.invitesSent, invites.sent))
        state.invitesSent = invites.sent.map((invite) => invite.id);
    },
    updateInactiveGames(state, action) {
      console.log(action.payload);
      const { action: status, game } = action.payload;
      if (status === "deactivated") {
        myAdapter.upsertOne(state.inactiveGames, game);
        game.daysDiff < 0
          ? myAdapter.removeOne(state.gamesHostedResolved, game.id)
          : myAdapter.removeOne(state.gamesHostedPending, game.id);
      } else if (status === "reactivated") {
        console.log(game);
        myAdapter.removeOne(state.inactiveGames, game.id);
        game.daysDiff < 0
          ? myAdapter.upsertOne(state.gamesHostedResolved, game)
          : myAdapter.upsertOne(state.gamesHostedPending, game);
      }
    },
  },
  extraReducers(builder) {
    builder
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
        state.error = action.error.message;
      })
      .addCase(toggleRelationship.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(toggleRelationship.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        const { action: status, followed } = action.payload;
        if (status === "unfollowed")
          myAdapter.removeOne(state.follows, followed);
        else myAdapter.upsertOne(state.follows, { username: followed });
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
      })
      .addCase(acceptInvite.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(acceptInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        const invite = action.payload.invite;
        myAdapter.upsertOne(state.invitesReceived, invite);
      })
      .addCase(acceptInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(denyInvite.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(denyInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        const invite = action.payload.invite;
        myAdapter.upsertOne(state.invitesReceived, invite);
      })
      .addCase(denyInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(cancelInvite.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(cancelInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        const invite = action.payload.invite;
        myAdapter.upsertOne(state.invitesSent, invite);
      })
      .addCase(cancelInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  resetMyStatus,
  updateMyUsername,
  updateMyInvites,
  updateInactiveGames,
} = mySlice.actions;

export default mySlice.reducer;

//   export const {
//     selectAll: selectAllGames,
//     selectById: selectGameById,
//     selectIds: selectGameIds,
//   } = myAdapter.getSelectors((state) => state.games);
