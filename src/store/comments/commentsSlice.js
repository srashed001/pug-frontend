import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import PugApi from "../../api/api";

const commentsAdapter = createEntityAdapter();

const initialState = commentsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (data) => {
    const { gameId, username, comment } = data;
    return PugApi.addComment(gameId, username, { comment });
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (data) => {
    const { gameId, commentId } = data;
    return PugApi.deleteComment(gameId, commentId);
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetCommentStatus: (state) => {
      return { ...state, status: initialState.status };
    },
    updateComments(state, action) {
      commentsAdapter.upsertMany(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addComment.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        commentsAdapter.upsertOne(state, action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteComment.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.action === "deactivated") {
          commentsAdapter.removeOne(state, action.payload.comment.id);
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetCommentStatus, updateComments } = commentsSlice.actions;

export default commentsSlice.reducer;

export const {
  selectAll: selectAllComments,
  selectById: selectCommentById,
  selectIds: selectCommentIds,
} = commentsAdapter.getSelectors((state) => state.comments);

export const selectCommentsByGame = createSelector(
  [selectAllComments, (state, gameId) => gameId],
  (comments, gameId) => comments.filter((comment) => comment.gameId === +gameId)
);
