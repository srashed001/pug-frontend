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
    game: 'idle',
    games: 'idle'
  },
  error: null,
});



export const fetchGames = createAsyncThunk("games/fetchGames", async () => {
  const resp = await PugApi.getGames();
  return resp;
});

export const fetchGame = createAsyncThunk("games/fetchGame", async (gameId, {dispatch}) => {
  const resultPromise = PugApi.getGame(gameId)
  resultPromise.then(data => {
    dispatch(updateComments(data.comments))
    dispatch(updateUsers(data.players))
  })

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

export const createGame = createAsyncThunk(`games/createGane`, async({data, createdBy}) => {
  const game = await PugApi.createGame(data)
  return {game , createdBy}
})

export const updateGame = createAsyncThunk(`games/updateGame`, async({id, data}) => {
  return PugApi.updateGame(id, data)
})

export const deactivateGame = createAsyncThunk(`games/deactivateGame`, async(gameId, {dispatch, getState}) => {
  const rootState = getState()
  const res = PugApi.deactivateGame(gameId)
  res.then(data => {
    const game = {...rootState.games.entities[data.game.id], ...data.game}
    game.isActive = false
    dispatch(updateInactiveGames({...data, game}))
  })
  return res

})
export const reactivateGame = createAsyncThunk(`games/reactivateGame`, async(gameId, {dispatch, getState}) => {
  const rootState = getState()
  const res = PugApi.reactivateGame(gameId)
  res.then(data => {
    const game = {...rootState.games.entities[data.game.id], ...data.game}
    console.log(game, rootState)
    dispatch(updateInactiveGames({...data, game}))
  })
  return res

})

export const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    resetGamesStatus(state, action) {
      state.status.games = "idle"
    },
    resetGameStatus(state, action) {
      state.status.game = "idle";
    },
    updateGames(state, action) {
      gamesAdapter.upsertMany(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGames.pending, (state, action) => {
        state.status.games = "loading";
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status.games = "succeeded";
        console.log(action.payload)
        gamesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status.games = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(fetchGame.fulfilled, (state, action) => {
       
        const game = action.payload.details
        console.log(action.payload)
        const players = action.payload.players.map(player => player.username)
        game.players = [...players]
        console.log(game)
        gamesAdapter.upsertOne(state, game);
        state.status.game = "succeeded";
       
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = action.error.message;
      })
      .addCase(leaveGame.pending, (state, action) => {
      })
      .addCase(leaveGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        state.entities[action.meta.arg.gameId].players = action.payload.map(player => player.username)
      })
      .addCase(leaveGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = action.error.message;
      })
      .addCase(joinGame.pending, (state, action) => {
      })
      .addCase(joinGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        state.entities[action.meta.arg.gameId].players = action.payload.map(player => player.username)
      })
      .addCase(joinGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = action.error.message;
      })
      .addCase(createGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        console.log(action.payload)
        const {game, createdBy} = action.payload
        const formattedGame = {...game, players: [], createdBy}
        console.log(formattedGame)
        gamesAdapter.upsertOne(state, formattedGame)
      })
      .addCase(createGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = action.error.message;
      })
      .addCase(updateGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        gamesAdapter.upsertOne(state, action.payload)
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = action.error.message;
      })
      .addCase(deactivateGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(deactivateGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        const game = {...state.entities[action.payload.game.id], ...action.payload.game}
        gamesAdapter.upsertOne(state, game)

      })
      .addCase(deactivateGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = action.error.message;
      })
      .addCase(reactivateGame.pending, (state, action) => {
        state.status.game = "loading";
      })
      .addCase(reactivateGame.fulfilled, (state, action) => {
        state.status.game = "succeeded";
        const oldGame = state.entities[action.payload.game.id]
        const game = {...state.entities[action.payload.game.id], ...action.payload.game}
        console.log(game, oldGame)
        gamesAdapter.upsertOne(state, game)

      })
      .addCase(reactivateGame.rejected, (state, action) => {
        state.status.game = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetGamesStatus, resetGameStatus, updateGames } = gamesSlice.actions;

export default gamesSlice.reducer;

export const {
  selectAll: selectAllGames,
  selectById: selectGameById,
  selectIds: selectGameIds,
} = gamesAdapter.getSelectors((state) => state.games);

export const selectAllActiveGames = createSelector(
  [selectAllGames],
  (games) => games.filter(game => game.isActive === true)
)
