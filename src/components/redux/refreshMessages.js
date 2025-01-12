import { createSlice } from '@reduxjs/toolkit'

export const refreshMessages = createSlice({
    name: 'refreshMessages',
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
export const { update, clear } = refreshMessages.actions

export default refreshMessages.reducer