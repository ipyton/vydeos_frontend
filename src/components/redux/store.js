import { configureStore } from '@reduxjs/toolkit'
import searchResult from './searchResult'
import  userDetails from './UserDetails'
import Search from './Search'
import  refresh  from './refresh'

export default configureStore({
  reducer: {
    searchResult: searchResult,
    userDetails:userDetails,
    search:Search,
    refresh:refresh,
  },
})