import { createSlice } from '@reduxjs/toolkit'

export const refreshMailBox = createSlice({
    name: 'refreshMailBox',
    initialState: {
        value: { refresh: false }
    },
    reducers: {
        update: (state) => {
            state.value["refresh"] = !state.value["refresh"]

        },
        clear: (state) => {
        },
    },
})

// Action creators are generated for each case reducer function
export const { update, clear } = refreshMailBox.actions

export default refreshMailBox.reducer