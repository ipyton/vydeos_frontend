import { createSlice } from '@reduxjs/toolkit'

export const refreshSideBar = createSlice({
    name: 'refreshSideBar',
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
export const { update, clear } = refreshSideBar.actions

export default refreshSideBar.reducer