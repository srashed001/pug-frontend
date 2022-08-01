import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import PugApi from "../../api/api";

const threadsAdapter = createEntityAdapter({
  selectId: (thread) => thread.id,
});

const messagesAdapter = createEntityAdapter();

const initialState = threadsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const getThreadId = createAsyncThunk(
  `threads/getThreadId`,
  async ({ username, party }, { dispatch, rejectWithValue }) => {
    try {
      const result = await PugApi.getThreadId(username, {
        party: party.map((user) => user.username),
      });
      dispatch(initializeThread({ ...result, party }));
      return result;
    } catch (err) {
      rejectWithValue(err[0]);
    }
  }
);

export const addMessageInThread = createAsyncThunk(
  `threads/addMessageInThread`,
  async ({ username, threadId, message }, { rejectWithValue }) => {
    try {
      const result = await PugApi.respondThread(username, threadId, {
        message,
      });
      return result;
    } catch (err) {
      rejectWithValue(err[0]);
    }
  }
);

export const createMessage = createAsyncThunk(
  `threads/createMessage`,
  async ({ username, users, message }, { rejectWithValue }) => {
    try {
      const result = await PugApi.createMessage(username, {
        message,
        party: users,
      });
      return result;
    } catch (err) {
      rejectWithValue(err[0]);
    }
  }
);

export const deleteMessageInThread = createAsyncThunk(
  `threads/deleteMessageInThread`,
  async ({ username, id }, { rejectWithValue }) => {
    try {
      const result = await PugApi.deleteMessage(username, id);
      return result;
    } catch (err) {
      rejectWithValue(err[0]);
    }
  }
);

export const deleteThread = createAsyncThunk(
  `threads/deleteThread`,
  async ({ username, threadId }, { rejectWithValue }) => {
    try {
      const result = await PugApi.deleteThread(username, threadId);
      return result;
    } catch (err) {
      rejectWithValue(err[0]);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "threads/fetchMessages",
  async ({ username, threadId }, { dispatch, rejectWithValue }) => {
    try {
      const result = await PugApi.getMessages(username, threadId);
      dispatch(initializeThread(result));
      return result;
    } catch (err) {
      rejectWithValue(err[0]);
    }
  }
);

export const fetchThreads = createAsyncThunk(
  "threads/fetchThreads",
  async (username, { rejectWithValue }) => {
    try {
      const result = await PugApi.getThreads(username);
      return result;
    } catch (err) {
      rejectWithValue(err[0]);
    }
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
      try {
        const threads = action.payload.map((thread) => ({
          id: thread.threadId,
          lastMessage: thread.lastMessage,
          party: thread.party,
          messages: messagesAdapter.getInitialState(),
        }));
        threadsAdapter.setAll(state, threads);
      } catch (err) {
        state.status = "failed";
        state.error = { message: err.message };
      }
    },
    initializeThread: (state, action) => {
      try {
        const { id, party } = action.payload;
        if (state.entities[id]) return;
        const thread = {
          id,
          party,
          lastMessage: null,
          messages: messagesAdapter.getInitialState(),
        };
        threadsAdapter.upsertOne(state, thread);
      } catch (err) {
        state.status = "failed";
        state.error = { message: err.message };
      }
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
          party: thread.party,
          messages: messagesAdapter.getInitialState(),
        }));
        threadsAdapter.setAll(state, threads);
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(fetchMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, messages } = action.payload;
        const threadEntry = state.entities[id];
        messagesAdapter.setAll(threadEntry.messages, messages);
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(addMessageInThread.pending, (state, action) => {})
      .addCase(addMessageInThread.fulfilled, (state, action) => {
        state.status = "succeeded";
        const threadId = action.meta.arg.threadId;
        const threadEntry = state.entities[threadId];
        messagesAdapter.upsertOne(threadEntry.messages, action.payload);
      })
      .addCase(addMessageInThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(deleteMessageInThread.pending, (state, action) => {})
      .addCase(deleteMessageInThread.fulfilled, (state, action) => {
        state.status = "succeeded";
        const threadId = action.meta.arg.threadId;
        const threadEntry = state.entities[threadId];
        messagesAdapter.removeOne(
          threadEntry.messages,
          action.payload.message.id
        );
      })
      .addCase(deleteMessageInThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(createMessage.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { threadId, messageFrom, createdOn } = action.payload;
        const thread = {
          id: threadId,
          lastMessage: { [messageFrom]: createdOn },
          party: action.meta.arg.users,
          messages: messagesAdapter.getInitialState(),
        };
        threadsAdapter.upsertOne(state, thread);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(deleteThread.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.status = "succeeded";
        threadsAdapter.removeOne(state, action.meta.arg.threadId);
      })
      .addCase(deleteThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      })
      .addCase(getThreadId.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getThreadId.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(getThreadId.rejected, (state, action) => {
        state.status = "failed";
        state.error = { message: action.payload };
      });
  },
});

export const { resetThreadStatus, updateThreads, initializeThread } =
  threadsSlice.actions;

export default threadsSlice.reducer;

export const {
  selectAll: selectAllThreads,
  selectById: selectThreadById,
  selectIds: selectThreadIds,
} = threadsAdapter.getSelectors((state) => state.threads);

export const selectMessagesByThreadId = createSelector(
  [(state, threadId) => selectThreadById(state, threadId)],
  (thread) => Object.values(thread.messages.entities)
);
