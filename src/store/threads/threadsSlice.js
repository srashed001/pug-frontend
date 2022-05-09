import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
  } from "@reduxjs/toolkit";
  import _ from "lodash";
import PugApi from "../../api/api";

  const threadsAdapter = createEntityAdapter({
    selectId: thread => thread.threadId
  });

  const messagesAdapter = createEntityAdapter();
  
  const initialState = threadsAdapter.getInitialState({
    status: "idle",
    error: null,
  });
  

  /**
   * in practice i probably wont loop through all the threadIds in the the thunk 
   * and send a shit ton of API requests all back to back to hydrates messages for every
   * threadId all at once.
   * 
   * I just wanted to test if i could next all the messages within each thread entity
   * 
   * which i can!!!!
   * 
   * Ill end up hydrating messages when a user accesses a thread 
   * 
   * that way the store is staying hydrated only with messages the user wants to look at
   * 
   * 
   */
  export const fetchMessages = createAsyncThunk("threads/fetchMessages", async (data) => {
    const {username, threadId} = data
    const res = PugApi.getMessages(username, threadId)
    return res

  });

  export const fetchThreads = createAsyncThunk("threads/fetchThreads", async (username, {dispatch}) => {
    const resp = PugApi.getThreads(username)
    resp.then(data => {
      data.forEach(element => {
        dispatch(fetchMessages({username: username, threadId: element.threadId}))
      });
    })
    return resp;
  });
  
//   export const fetchUser = createAsyncThunk(
//     "users/fetchUser",
//     async (username, { dispatch }) => {
//       const resultPromise = PugApi.getCurrentUser(username);
//       resultPromise.then((data) => {
//         const allGames = _.union(
//           data.games.hosted.resolved,
//           data.games.hosted.pending,
//           data.games.joined.resolved,
//           data.games.joined.pending
//         );
//         dispatch(updateGames(allGames));
//       });
  
//       return resultPromise;
//     }
//   );
  
  const threadsSlice = createSlice({
    name: "threads",
    initialState,
    reducers: {
      resetThreadStatus: (state) => {
        return { ...state, status: initialState.status };
      },
    },
    extraReducers(builder) {
      builder
        .addCase(fetchThreads.pending, (state, action) => {
          state.status = "loading";
        })
        .addCase(fetchThreads.fulfilled, (state, action) => {
          state.status = "succeeded";
          const threads = action.payload.map(thread => ({...thread, messages: messagesAdapter.getInitialState()}))
          threadsAdapter.upsertMany(state, threads)
          
        })
        .addCase(fetchThreads.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        })
        .addCase(fetchMessages.pending, (state, action) => {
          state.status = "loading";
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
          state.status = "succeeded";
          const threadId = action.meta.arg.threadId
          const threadEntry = state.entities[threadId]
          messagesAdapter.setAll(threadEntry.messages, action.payload)
          
        })
        .addCase(fetchMessages.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        })
    },
  });
  
  export const { resetUserStatus, updateUsers } = threadsSlice.actions;
  
  export default threadsSlice.reducer;
  
  // export const {
  //   selectAll: selectAllUsers,
  //   selectById: selectUserById,
  //   selectIds: selectUserIds,
  // } = usersAdapter.getSelectors((state) => state.users);
  