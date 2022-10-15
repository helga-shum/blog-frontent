import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
  const { data } = await axios.get('/comments');
  return data;
});
export const fetchPostComments = createAsyncThunk('comments/fetchPostComments', async (id) => {
  const { data } = await axios.get(`/posts/${id}`);
  return data;
});
const initialState = {
  comments: {
    items: [],
    status: 'loading',
  },
};
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducer: {},
  extraReducers: {
    //Getting comments
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = 'loading';
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },
    //Getting post comments
    [fetchPostComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = 'loading';
    },
    [fetchPostComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [fetchPostComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },
  },
});

export const commentsReducer = commentsSlice.reducer;
