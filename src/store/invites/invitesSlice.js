import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import PugApi from "../../api/api";
import { updateMyInvites } from "../my/mySlice";

export const invitesAdapter = createEntityAdapter();

const initialState = invitesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchMyInvites = createAsyncThunk(
  `invites/fetchMyInvites`,
  async (username, { dispatch }) => {
    const invites = PugApi.getInvites(username);
    invites.then((data) => {
      dispatch(updateMyInvites(data));
    });

    return invites;
  }
);

export const createInvites = createAsyncThunk(`invites/createInvites`, async ({username, gameId, toUsers})=> {
  return PugApi.createInvites(username, gameId, {toUsers})

})

export const acceptInvite = createAsyncThunk(
  `invites/acceptInvite`, 
  async(data) => {
    const {username, id} = data
    return PugApi.updateInvite(username, 'accept', id)
  }
)

export const denyInvite = createAsyncThunk(
  `invites/denyInvite`, 
  async(data) => {
    const {username, id} = data
    return PugApi.updateInvite(username, 'deny', id)
  }
)

export const cancelInvite = createAsyncThunk(
  `invites/cancelInvite`, 
  async(data) => {
    const {username, id} = data
    return PugApi.updateInvite(username, 'cancel', id)
  }
)

export const invitesSlice = createSlice({
  name: "invites",
  initialState,
  reducers: {
    resetInviteStatus(state, action) {
      state.status = "idle";
    },
    updateInvites(state, action) {
      invitesAdapter.upsertMany(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMyInvites.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchMyInvites.fulfilled, (state, action) => {
        state.status = "succeeded";
        const invites = action.payload;
        invitesAdapter.upsertMany(state, [...invites.received, ...invites.sent])
      })
      .addCase(fetchMyInvites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(acceptInvite.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(acceptInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload)
        const invite = action.payload.invite;
        invitesAdapter.upsertOne(state, invite)
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
        console.log(action.payload)
        const invite = action.payload.invite;
        invitesAdapter.upsertOne(state, invite)
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
        console.log(action.payload)
        const invite = action.payload.invite;
        invitesAdapter.upsertOne(state, invite)
      })
      .addCase(cancelInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createInvites.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createInvites.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload)
        invitesAdapter.upsertMany(state, action.payload)
      })
      .addCase(createInvites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateInvites, resetInviteStatus } = invitesSlice.actions;

export default invitesSlice.reducer;

  export const {
    selectAll: selectAllInvites,
    selectById: selectInvitesById,
    selectIds: selectInviteIds,
  } = invitesAdapter.getSelectors((state) => state.invites);

  export const selectInvitesReceived = createSelector(
    [selectAllInvites, (state, username) => username],
    (invites, username) => invites.filter(invite => invite.toUser === username)
  )

  export const selectInvitesSent = createSelector(
    [selectAllInvites, (state, username) => username],
    (invites, username) => invites.filter(invite => invite.fromUser === username)
  )

