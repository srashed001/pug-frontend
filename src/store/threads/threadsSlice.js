import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import PugApi from "../../api/api";
import { updateUsers } from "../users/usersSlice";


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

export const fetchMessages = createAsyncThunk(
  "threads/fetchMessages",
  async (data) => {
    console.log("in thunk");
    const { username, threadId } = data;
    const res = PugApi.getMessages(username, threadId);
    return res;
  }
);

export const fetchThreads = createAsyncThunk(
  "threads/fetchThreads",
  async (username, { dispatch }) => {
    console.log(`in thunk`)
    const resp = PugApi.getThreads(username);
    resp.then((data) => {
      const users = data.map((thread) => {
        return Object.entries(thread.party).map(([k, v]) => ({
          username: k,
          profileImg: v,
        }));
      });
      dispatch(updateUsers(_.union(...users)));
    });
    return resp;
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
      const threads = action.payload.map((thread) => ({
        id: thread.threadId,
        lastMessage: thread.lastMessage,
        party: Object.keys(thread.party),
        messages: messagesAdapter.getInitialState(),
      }));
      threadsAdapter.updateMany(state, threads);
    },
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
          lastMessage: thread.lastMessage,
          party: Object.keys(thread.party),
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
        const threadId = action.meta.arg.threadId;
        const threadEntry = state.entities[threadId];
        console.log(action.payload);
        messagesAdapter.setAll(threadEntry.messages, action.payload);
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addMessageInThread.pending, (state, action) => {
        state.status = "loading";
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
        state.status = "loading";
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
        const threadEntry = state.entities[threadId]
        messagesAdapter.upsertOne(threadEntry.messages, action.payload)
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetThreadStatus, updateThreads } = threadsSlice.actions;

export default threadsSlice.reducer;

// export const {
//   selectAll: selectAllUsers,
//   selectById: selectUserById,
//   selectIds: selectUserIds,
// } = usersAdapter.getSelectors((state) => state.users);
