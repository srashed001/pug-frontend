import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import PugApi from "../../api/api";
import _ from "lodash";
import { updateGames } from "../games/gamesSlice";
import { updateInvites } from "../invites/invitesSlice";
import { updateUsers } from "../users/usersSlice";
import { updateThreads } from "../threads/threadsSlice";

export const myAdapter = createEntityAdapter({
  selectId: (user) => user.username || user.details.id,
});

// const initialState = myAdapter.getInitialState({
//   status: "idle",
//   error: null,
// });
const initialState = {
  status: "idle", 
  error: null, 
}


export const fetchInitialMy = createAsyncThunk(
  "my/fetchInitialMy",
  async (username, { dispatch }) => {
    const userAndGames = PugApi.getCurrentUser(username);
    const invites = PugApi.getInvites(username);
    const threads = PugApi.getThreads(username)

    threads.then(data => dispatch(updateThreads(data)))

    userAndGames.then((data) => {
      const allGames = _.union(
        data.games.hosted.resolved,
        data.games.hosted.pending,
        data.games.joined.resolved,
        data.games.joined.pending
      );
      dispatch(updateUsers([data]))
      dispatch(updateGames(allGames));
    })


    invites.then(data => {
      const allInvites = _.union(data.received, data.sent);
      dispatch(updateInvites(allInvites))
    })

    return Promise.all([userAndGames, invites])
  }
);


export const mySlice = createSlice({
  name: "my",
  initialState,
  reducers: {
    resetMyStatus(state, action) {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInitialMy.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchInitialMy.fulfilled, (state, action) => {
        state.status = "succeeded";
        const [userAndGames, invites] = action.payload
        state.username = action.meta.arg
        state.gamesHostedPending = userAndGames.games.hosted.pending.map(game => game.id)
        state.gamesHostedResolved = userAndGames.games.hosted.resolved.map(game => game.id)
        state.gamesJoinedPending = userAndGames.games.joined.pending.map(game => game.id)
        state.gamesJoinedResolved = userAndGames.games.joined.resolved.map(game => game.id)
        state.invitesReceived = invites.received.map(invite => invite.id)
        state.invitesSent = invites.sent.map(invite => invite.id)


      })
      .addCase(fetchInitialMy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetMyStatus } = mySlice.actions;

export default mySlice.reducer;

//   export const {
//     selectAll: selectAllGames,
//     selectById: selectGameById,
//     selectIds: selectGameIds,
//   } = myAdapter.getSelectors((state) => state.games);
