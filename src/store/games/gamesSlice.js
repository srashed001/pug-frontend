import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import PugApi from "../../api/api";


const gamesAdapter = createEntityAdapter()

const initialState = gamesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchGames = createAsyncThunk("games/fetchGames", async () => {
  const resp = await PugApi.getGames();
  return resp;
});

export const fetchGame = createAsyncThunk("games/fetchGame", async (gameId) => {
  const resp = await PugApi.getGame(gameId);
  return resp;
});

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGames.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = "succeeded";
        gamesAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchGame.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchGame.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities[action.payload.id] = {...state.entities,...action.payload}
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default gamesSlice.reducer;

