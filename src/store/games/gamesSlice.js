import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import PugApi from "../../api/api";
import { updateComments } from "../comments/commentsSlice";
import { updateUsers } from "../users/usersSlice";

export const gamesAdapter = createEntityAdapter({
  selectId: (game) => game.id || game.details.id,
});

const initialState = gamesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchGames = createAsyncThunk("games/fetchGames", async () => {
  const resp = await PugApi.getGames();
  return resp;
});

export const fetchGame = createAsyncThunk("games/fetchGame", async (gameId, {dispatch}) => {
  const resultPromise = PugApi.getGame(gameId)
  resultPromise.then(data => dispatch(updateComments(data.comments)))
  resultPromise.then(data => dispatch(updateUsers(data.players)))

  return resultPromise
});

export const joinGame = createAsyncThunk("games/joinGame", async (data, {dispatch}) => {
  const {gameId, username} = data
  const resultPromise = PugApi.joinGame(gameId, username)
  resultPromise.then(data => dispatch(updateUsers(data)))

  return resultPromise
});

export const leaveGame = createAsyncThunk("games/leaveGame", async (data, {dispatch}) => {
  const {gameId, username} = data
  const resultPromise = PugApi.leaveGame(gameId, username)
  resultPromise.then(data => dispatch(updateUsers(data)))

  return resultPromise
});

export const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    resetGameStatus(state, action) {
      state.status = "idle";
    },
    updateGames(state, action) {
      gamesAdapter.upsertMany(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGames.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = "succeeded";
        gamesAdapter.upsertMany(state, action.payload);
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
        const game = action.payload.details
        game.players = action.payload.players.map(player => player.username)
        gamesAdapter.upsertOne(state, game);
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(leaveGame.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(leaveGame.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities[action.meta.arg.gameId].players = action.payload.map(player => player.username)
      })
      .addCase(leaveGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(joinGame.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(joinGame.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities[action.meta.arg.gameId].players = action.payload.map(player => player.username)
      })
      .addCase(joinGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetGameStatus, updateGames } = gamesSlice.actions;

export default gamesSlice.reducer;

export const {
  selectAll: selectAllGames,
  selectById: selectGameById,
  selectIds: selectGameIds,
} = gamesAdapter.getSelectors((state) => state.games);
