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
  async (username, { dispatch, rejectWithValue }) => {
    try {
      const invites = await PugApi.getInvites(username);
      dispatch(updateMyInvites(invites));
      return invites;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const createInvites = createAsyncThunk(
  `invites/createInvites`,
  async ({ username, gameId, toUsers }, { rejectWithValue }) => {
    try {
      const result = await PugApi.createInvites(username, gameId, { toUsers });
      return result;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const acceptInvite = createAsyncThunk(
  `invites/acceptInvite`,
  async ({ username, id }, { rejectWithValue }) => {
    try {
      const result = await PugApi.updateInvite(username, "accept", id);
      return result;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const denyInvite = createAsyncThunk(
  `invites/denyInvite`,
  async ({ username, id }, { rejectWithValue }) => {
    try {
      const result = await PugApi.updateInvite(username, "deny", id);
      return result;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const cancelInvite = createAsyncThunk(
  `invites/cancelInvite`,
  async ({ username, id }, { rejectWithValue }) => {
    try {
      const result = await PugApi.updateInvite(username, "cancel", id);
      return result;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const invitesSlice = createSlice({
  name: "invites",
  initialState,
  reducers: {
    resetInviteStatus(state, action) {
      state.status = "idle";
    },
    updateInvites(state, action) {
      try {
        invitesAdapter.upsertMany(state, action.payload);
      } catch (err) {
        state.status = "failed";
        state.error = { message: err.message };
      }
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
        invitesAdapter.upsertMany(state, [
          ...invites.received,
          ...invites.sent,
        ]);
      })
      .addCase(fetchMyInvites.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(acceptInvite.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(acceptInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        const invite = action.payload.invite;
        invitesAdapter.upsertOne(state, invite);
      })
      .addCase(acceptInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(denyInvite.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(denyInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        const invite = action.payload.invite;
        invitesAdapter.upsertOne(state, invite);
      })
      .addCase(denyInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(cancelInvite.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(cancelInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        const invite = action.payload.invite;
        invitesAdapter.upsertOne(state, invite);
      })
      .addCase(cancelInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(createInvites.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createInvites.fulfilled, (state, action) => {
        state.status = "succeeded";
        invitesAdapter.upsertMany(state, action.payload);
      })
      .addCase(createInvites.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
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
  (invites, username) => invites.filter((invite) => invite.toUser === username)
);

export const selectInvitesSent = createSelector(
  [selectAllInvites, (state, username) => username],
  (invites, username) =>
    invites.filter((invite) => invite.fromUser === username)
);
