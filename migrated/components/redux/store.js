import { configureStore } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import authReducer from './authSlice';
import searchReducer from './Search';

// Import other reducers
const createEmptyReducer = (name) => ({
  name,
  initialState: {},
  reducers: {}
});

// Setup mock reducers for the ones we haven't implemented yet
const createMockReducer = (initialState = {}) => {
  return (state = initialState, action) => {
    return state;
  };
};

// Define mock reducers
const searchResult = createMockReducer({});
const userDetails = createMockReducer({});
const refreshMessagesReducer = createMockReducer({});
const refreshSideBarReducer = createMockReducer({});
const refreshMailBoxReducer = createMockReducer({});
const scrollCursorReducer = createMockReducer({});

// Configure the Redux store
const createStore = () => 
  configureStore({
    reducer: {
      searchResult: searchResult,
      userDetails: userDetails,
      search: searchReducer,
      refreshMessages: refreshMessagesReducer,
      refreshSideBar: refreshSideBarReducer,
      refreshMailBox: refreshMailBoxReducer,
      auth: authReducer, 
      scrollCursor: scrollCursorReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
  });

// For Next.js with server-side rendering support
let store;

export const initializeStore = (preloadedState) => {
  let _store = store ?? createStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = createStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

// Custom hook to get the store
export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

// Export the store singleton for client-side
export default typeof window === 'undefined'
  ? createStore() // Server-side: always create a new store
  : initializeStore(); // Client-side: use the store singleton 