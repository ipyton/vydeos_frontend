import { configureStore } from '@reduxjs/toolkit'
import searchResult from './searchResult'
import  userDetails from './UserDetails'
import Search from './Search'
import  refreshReducer  from './refresh'
import  refreshMessagesReducer  from './refreshMessages'
import authReducer from './authSlice' // Import the auth slice
import scrollCursorReducer from './scrollCursorSlice' // Import the scroll cursor slice

export default configureStore({
  reducer: {
    searchResult: searchResult,
    userDetails:userDetails,
    search:Search,
    refresh:refreshReducer,
    refreshMessages:refreshMessagesReducer,
    auth: authReducer, 
    scrollCursor: scrollCursorReducer
  },
})