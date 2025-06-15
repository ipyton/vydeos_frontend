import { createSlice } from '@reduxjs/toolkit'

//this function is deprecated.
export const userDetails = createSlice({
    name: 'userDetails',
    initialState: {
        value: {}

    },
    reducers: {
        updateFollowState: (state, follow) => {
            state.relationship = state.relationship / 10 + 10 * (!follow ? 1 : 0)
        },
        update: (state, information) => {

            state.value = information

        },
        clear: (state) => {
        }
    },
})

// Action creators are generated for each case reducer function
export const { update, clear, updateFollowState } = userDetails.actions

export default userDetails.reducer