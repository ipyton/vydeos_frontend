import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  searchType: -1, // -1: none, 0: users, 1: chats, 2: videos, 3: music, 4: posts
  changed: 0,
  suggestions: [],
  showSuggestions: false
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateSearch: (state, action) => {
      state.search = action.payload;
      state.changed += 1;
    },
    updateSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    updateSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    toggleSuggestions: (state, action) => {
      state.showSuggestions = action.payload !== undefined ? action.payload : !state.showSuggestions;
    },
    resetSearch: (state) => {
      state.search = '';
      state.searchType = -1;
      state.suggestions = [];
      state.showSuggestions = false;
    }
  }
});

export const {
  updateSearch,
  updateSearchType,
  updateSuggestions,
  toggleSuggestions,
  resetSearch
} = searchSlice.actions;

export default searchSlice.reducer; 