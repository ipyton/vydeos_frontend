import { configureStore } from '@reduxjs/toolkit'
import searchResult from './searchResult'
import { userInfo } from './UserDetails'

export default configureStore({
  reducer: {
    searchResult: searchResult,
    userInfo:userInfo,
  },
})