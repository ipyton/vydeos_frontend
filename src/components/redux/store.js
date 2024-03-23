import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './searchResult'

export default configureStore({
  reducer: {
    searchResult: counterSlice,
  },
})