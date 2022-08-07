import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import PugApi from "../../api/api";
import { updateComments } from "../comments/commentsSlice";
import { updateInactiveGames } from "../my/mySlice";
import { updateUsers } from "../users/usersSlice";

export const gamesAdapter = createEntityAdapter({
  selectId: (game) => game.id || game.details.id,
});

const initialState = gamesAdapter.getInitialState({
  status: {
    game: "idle",
    games: "idle",
  },
  error: null,
});

export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (data, { rejectWithValue }) => {
    try {
      const games = await PugApi.getGames();
      return games;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const fetchGame = createAsyncThunk(
  "games/fetchGame",
  async (gameId, { dispatch, rejectWithValue }) => {
    try {
      const game = await PugApi.getGame(gameId);
      const { comments, players } = game;
      dispatch(updateComments(comments));
      dispatch(updateUsers(players));
      return game;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const joinGame = createAsyncThunk(
  "games/joinGame",
  async ({ gameId, username }, { dispatch, rejectWithValue }) => {
    try {
      const result = await PugApi.joinGame(gameId, username);
      dispatch(updateUsers(result));
      return result;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const leaveGame = createAsyncThunk(
  "games/leaveGame",
  async ({ gameId, username }, { dispatch, rejectWithValue }) => {
    try {
      const result = await PugApi.leaveGame(gameId, username);
      dispatch(updateUsers(result));
      return result;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const createGame = createAsyncThunk(
  `games/createGane`,
  async ({ data, createdBy }, { rejectWithValue }) => {
    try {
      const game = await PugApi.createGame(data);
      return { game, createdBy };
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const updateGame = createAsyncThunk(
  `games/updateGame`,
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await PugApi.updateGame(id, data);
      return result;
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const deactivateGame = createAsyncThunk(
  `games/deactivateGame`,
  async (gameId, { dispatch, getState, rejectWithValue }) => {
    try {
      const rootState = getState();
      const result = await PugApi.deactivateGame(gameId);
      const gameState = rootState.games.entities[result.game.id];
      const updatedGame = { ...gameState, ...result.game };
      dispatch(updateInactiveGames({ ...result, game: updatedGame }));
      return { ...result, game: updatedGame }
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const reactivateGame = createAsyncThunk(
  `games/reactivateGame`,
  async (gameId, { dispatch, getState, rejectWithValue }) => {
    try {
      const rootState = getState();
      const result = await PugApi.reactivateGame(gameId);
      const gameState = rootState.games.entities[result.game.id];
      const updatedGame = { ...gameState, ...result.game };
      dispatch(updateInactiveGames({ ...result, game: updatedGame }));
      return { ...result, game: updatedGame }
    } catch (err) {
      return rejectWithValue(err[0]);
    }
  }
);

export const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    resetGamesStatus(state, action) {
      state.status.games = "idle";
    },
    resetGameStatus(state, action) {
      state.status.game = "idle";
    },
    updateGames(state, action) {
      try {
        gamesAdapter.upsertMany(state, action.payload);
      } catch (err) {
        state.status.games = "failed";
        state.error = { message: err.message };
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGames.pending, (state, action) => {
        state.status.games = "loading";
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status.games = "succeeded";
        gamesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status.games = "failed";
        state.error = { message: action.payload };
      })
      .addCase(fetchGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(fetchGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        const game = action.payload.details;
        const players = action.payload.players.map((player) => player.username);
        game.players = [...players];
        gamesAdapter.upsertOne(state, game);
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = { message: action.payload };
      })
      .addCase(leaveGame.pending, (state, action) => {})
      .addCase(leaveGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        state.entities[action.meta.arg.gameId].players = action.payload.map(
          (player) => player.username
        );
      })
      .addCase(leaveGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = { message: action.payload };
      })
      .addCase(joinGame.pending, (state, action) => {})
      .addCase(joinGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        state.entities[action.meta.arg.gameId].players = action.payload.map(
          (player) => player.username
        );
      })
      .addCase(joinGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = { message: action.payload };
      })
      .addCase(createGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        const { game, createdBy } = action.payload;
        const formattedGame = { ...game, players: [], createdBy, isActive: true };
        gamesAdapter.upsertOne(state, formattedGame);
      })
      .addCase(createGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = { message: action.payload };
      })
      .addCase(updateGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        const {createdBy, ...game} = action.payload
        gamesAdapter.upsertOne(state, game);
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = { message: action.payload };
      })
      .addCase(deactivateGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(deactivateGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        gamesAdapter.upsertOne(state, action.payload.game);
      })
      .addCase(deactivateGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = { message: action.payload };
      })
      .addCase(reactivateGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(reactivateGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        gamesAdapter.upsertOne(state, action.payload.game);
      })
      .addCase(reactivateGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = { message: action.payload };
      });
  },
});

export const { resetGamesStatus, resetGameStatus, updateGames } =
  gamesSlice.actions;

export default gamesSlice.reducer;

export const {
  selectAll: selectAllGames,
  selectById: selectGameById,
  selectIds: selectGameIds,
} = gamesAdapter.getSelectors((state) => state.games);

export const selectAllActiveGames = createSelector([selectAllGames], (games) =>
  games.filter((game) => game.isActive === true)
);
