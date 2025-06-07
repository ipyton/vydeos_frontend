// features/scrollCursorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const scrollCursorSlice = createSlice({
  name: 'scrollCursor',
  initialState: {
    cursors: {}  // { sessionId1: cursorValue1, sessionId2: cursorValue2, ... }
  },
  reducers: {
    setCursor: (state, action) => {
      const { sessionId, cursor } = action.payload;
      state.cursors[sessionId] = cursor;
    },
    removeCursor: (state, action) => {
      const sessionId = action.payload;
      delete state.cursors[sessionId];
    },
    clearAllCursors: (state) => {
      state.cursors = {};
    }
  }
});

export const { setCursor, removeCursor, clearAllCursors } = scrollCursorSlice.actions;
export default scrollCursorSlice.reducer;
