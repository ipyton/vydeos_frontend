import { configureStore } from '@reduxjs/toolkit'
import searchResult from './searchResult'
import  userDetails from './UserDetails'
import Search from './Search'
import  refreshReducer  from './refresh'
import  refreshMessagesReducer  from './refreshMessages'
import authReducer from './authSlice' // Import the auth slice


export default configureStore({
  reducer: {
    searchResult: searchResult,
    userDetails:userDetails,
    search:Search,
    refresh:refreshReducer,
    refreshMessages:refreshMessagesReducer,
    auth: authReducer, // This is the key part - make sure 'auth' is here

  },
})