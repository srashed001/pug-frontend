import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import PugApi from "../../api/api";


const usersAdapter = createEntityAdapter({
    selectId: (user) => user.username
})

const initialState = usersAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const resp = await PugApi.getUsers();
  return resp;
});

export const fetchUser = createAsyncThunk("users/fetchUser", async (username) => {
  const resp = await PugApi.getCurrentUser(username);
  return resp;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
      resetUserStatus: (state) => {
          console.log({...state, status: initialState.status})
          return {...state, status: initialState.status}
        }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        usersAdapter.upsertMany(state, action.payload)
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
        console.log(action.payload)
        state.entities[action.payload.user.username] = {...state.entities,...action.payload.user}
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {resetUserStatus} = usersSlice.actions

export default usersSlice.reducer;

