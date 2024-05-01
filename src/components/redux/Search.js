import { createSlice } from '@reduxjs/toolkit'

export const Search = createSlice({
    name: 'search',
    initialState: {
        search: "",
        searchType: -1
    },
    reducers: {
        set: (state, searchContent) => {
            state.search = searchContent.payload.search
            state.searchType = searchContent.payload.type
        },
        clear: (state) => {
            state.search = ""
            state.searchType = -1
        },
    },
})

// Action creators are generated for each case reducer function
export const { set, clear } = Search.actions

export default Search.reducer