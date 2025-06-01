import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    showLoginModal: false,
    user: null,
    token: null,
    isLoading: false,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.showLoginModal = false;
      state.isLoading = false;
      
      // Update localStorage when login succeeds
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', action.payload.token);
      if (action.payload.user?.userId) {
        localStorage.setItem('userId', action.payload.user.userId);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.showLoginModal = false;
      state.isLoading = false;
      
      // Clear localStorage when logout
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
    showLoginModal: (state) => {
      state.showLoginModal = true;
      state.isAuthenticated = false;
    },
    hideLoginModal: (state) => {
      state.showLoginModal = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { 
  login, 
  logout, 
  showLoginModal, 
  hideLoginModal, 
  setLoading, 
  updateUser 
} = authSlice.actions;

export default authSlice.reducer;