import { createSlice } from '@reduxjs/toolkit'

export const refresh = createSlice({
    name: 'refresh',
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
export const { update, clear } = refresh.actions

export default refresh.reducer