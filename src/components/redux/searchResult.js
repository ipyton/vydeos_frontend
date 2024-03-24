import { createSlice } from '@reduxjs/toolkit'

export const searchResult = createSlice({
  name: 'searchResults',
  initialState: {
    value: [],
  },
  reducers: {
    add: (state, item) => {

      state.value.push(item)
    },
    batchAdd: (state, item) => {
      item.payload.forEach(element => {
        state.value.push(element)
      });
    },
    clear: (state) => {
      state.value = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { add, batchAdd, clear} = searchResult.actions

export default searchResult.reducer