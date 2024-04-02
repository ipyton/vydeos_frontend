import { configureStore } from '@reduxjs/toolkit'
import searchResult from './searchResult'
import  userDetails from './UserDetails'

export default configureStore({
  reducer: {
    searchResult: searchResult,
    userDetails:userDetails,
  },
})