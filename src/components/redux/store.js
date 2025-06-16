import { configureStore } from '@reduxjs/toolkit'
import searchResult from './searchResult'
import  userDetails from './UserDetails'
import Search from './Search'
import  refreshMessagesReducer  from './refreshMessages'
import authReducer from './authSlice' // Import the auth slice
import scrollCursorReducer from './scrollCursorSlice' // Import the scroll cursor slice
import refreshSideBarReducer from './refreshSideBar'
import refreshMailBoxReducer from './refreshMailBox'

export default configureStore({
  reducer: {
    searchResult: searchResult,
    userDetails:userDetails,
    search:Search,
    refreshMessages:refreshMessagesReducer,
    refreshSideBar:refreshSideBarReducer,
    refreshMailBox:refreshMailBoxReducer,
    auth: authReducer, 
    scrollCursor: scrollCursorReducer
  },
})