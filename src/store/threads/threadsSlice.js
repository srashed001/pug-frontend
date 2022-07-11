import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import PugApi from "../../api/api";
import { updateUsers } from "../users/usersSlice";
import history from "../../common/history";


const threadsAdapter = createEntityAdapter({
  selectId: (thread) => thread.id,
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


export const getThreadId = createAsyncThunk(
  `threads/getThreadId`, 
  async (data, {dispatch}) => {
    const {username, party} = data
    const res = PugApi.getThreadId(username, {party: party.map(user => user.username)})
    res.then(data => {
      dispatch(initializeThread({...data, party}))

    })
    return res
  }
)

export const addMessageInThread = createAsyncThunk(
  `threads/addMessageInThread`,
  async (data) => {
    const {username, threadId, message} = data
    const resp = PugApi.respondThread(username, threadId, {message})
    return resp
  }
);

export const createMessage = createAsyncThunk(`threads/createMessage`, async(data) => {
  console.log(data)
  const {username, users, message} = data 
  const resp = PugApi.createMessage(username, {message, party: users})
  return resp
})

export const deleteMessageInThread = createAsyncThunk(
  `threads/deleteMessageInThread`,
  async (data) => {
    const {username, id} = data
    const resp = PugApi.deleteMessage(username, id)
    return resp
  }
);

export const deleteThread = createAsyncThunk(`threads/deleteThread`, async({username, threadId}) => {
  const resp = PugApi.deleteThread(username, threadId)
  return resp
})

export const fetchMessages = createAsyncThunk(
  "threads/fetchMessages",
  async (data, {dispatch}) => {
    console.log("in thunk");
    const { username, threadId } = data;
    const res = PugApi.getMessages(username, threadId);
    res.then(data => {
      console.log(data)
      dispatch(initializeThread(data))

    })
    return res;
  }
);

export const fetchThreads = createAsyncThunk(
  "threads/fetchThreads",
  async (username, { dispatch }) => {
    console.log(`in thunk`)
    return PugApi.getThreads(username);
    // resp.then((data) => {
    //   const users = data.map((thread) => {
    //     return Object.entries(thread.party).map(([k, v]) => ({
    //       username: k,
    //       profileImg: v,
    //     }));
    //   });
    //   dispatch(updateUsers(_.union(...users)));
    // });

  }
);

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    resetThreadStatus: (state) => {
      return { ...state, status: initialState.status };
    },
    updateThreads: (state, action) => {
      console.log(action.payload)
      const threads = action.payload.map((thread) => ({
        id: thread.threadId,
        lastMessage: thread.lastMessage[0],
        party: thread.party,
        messages: messagesAdapter.getInitialState(),
      }));
      console.log(threads)
      threadsAdapter.setAll(state, threads);
    },
    initializeThread: (state, action) => {
      const {id, party} = action.payload
      if (state.entities[id]) return 
      const thread = {id, party, lastMessage: null, messages: messagesAdapter.getInitialState()}
      threadsAdapter.upsertOne(state, thread)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchThreads.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = "succeeded";
        const threads = action.payload.map((thread) => ({
          id: thread.threadId,
          lastMessage: thread.lastMessage[0],
          party: thread.party,
          messages: messagesAdapter.getInitialState(),
        }));
        threadsAdapter.setAll(state, threads);
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
        const {id, messages } = action.payload
        // const threadId = action.meta.arg.threadId;
        const threadEntry = state.entities[id];
        console.log(action.payload);
        console.log(threadEntry)
        messagesAdapter.setAll(threadEntry.messages, messages);
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addMessageInThread.pending, (state, action) => {
        // state.status = "loading";
      })
      .addCase(addMessageInThread.fulfilled, (state, action) => {
        state.status = "succeeded";
        const threadId = action.meta.arg.threadId;
        const threadEntry = state.entities[threadId];
        messagesAdapter.upsertOne(threadEntry.messages, action.payload);
      })
      .addCase(addMessageInThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteMessageInThread.pending, (state, action) => {
      })
      .addCase(deleteMessageInThread.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload, action.meta.arg)
        const threadId = action.meta.arg.threadId;
        const threadEntry = state.entities[threadId];
        messagesAdapter.removeOne(threadEntry.messages, action.payload.message.id);
      })
      .addCase(deleteMessageInThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createMessage.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        console.log(action.payload, action.meta.arg)
        state.status = "succeeded";
        const {threadId, messageFrom, createdOn} = action.payload
        const thread = {
          id: threadId,
          lastMessage: {[messageFrom]: createdOn},
          party: action.meta.arg.users,
          messages: messagesAdapter.getInitialState()
        }
        threadsAdapter.upsertOne(state, thread)
        
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteThread.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.status = "succeeded";
        threadsAdapter.removeOne(state, action.meta.arg.threadId)

        
      })
      .addCase(deleteThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getThreadId.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getThreadId.fulfilled, (state, action) => {
        state.status = "succeeded";
        // console.log(action.payload)
        // const {id} = action.payload
        // threadsAdapter.upsertOne(state, {id, party: action.meta.arg.party, messages: messagesAdapter.getInitialState()})
      })
      .addCase(getThreadId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetThreadStatus, updateThreads, initializeThread } = threadsSlice.actions;

export default threadsSlice.reducer;

export const {
  selectAll: selectAllThreads,
  selectById: selectThreadById,
  selectIds: selectThreadIds,
} = threadsAdapter.getSelectors((state) => state.threads);


export const selectMessagesByThreadId = createSelector(
  [(state, threadId) => selectThreadById(state, threadId)],
  (thread) => Object.values(thread.messages.entities)
)


