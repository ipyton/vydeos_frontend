import { configureStore } from '@reduxjs/toolkit'
import searchResult from './searchResult'
import  userDetails from './UserDetails'
import Search from './Search'

export default configureStore({
  reducer: {
    searchResult: searchResult,
    userDetails:userDetails,
    search:Search
  },
})