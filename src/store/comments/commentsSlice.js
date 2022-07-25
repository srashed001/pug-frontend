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
  async (data, {rejectWithValue}) => {

    try{
      const { gameId, username, comment } = data;
      const newComment = await PugApi.addComment(gameId, username, { comment })
      return newComment
    } catch (err){
      rejectWithValue(err[0])
    }
    ;
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (data, {rejectWithValue}) => {
    try{
      const { gameId, commentId } = data;
      const oldComment = await PugApi.deleteComment(gameId, commentId);
      return oldComment
    } catch (err){
      rejectWithValue(err[0])
    }
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
      try {
         commentsAdapter.upsertMany(state, action.payload);
      } catch (err){
        state.status = 'failed';
        state.error = {message: err.message}
      }
     
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
        state.error = { message: action.payload };
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
        state.error = { message: action.payload };
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
