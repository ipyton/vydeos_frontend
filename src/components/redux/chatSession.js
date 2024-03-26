import { createSlice } from '@reduxjs/toolkit'

export const chatSession = createSlice({
    name: 'chatSession',
    initialState: {
        value: {userId:"", userName:"", userAvatar:""}},
    reducers: {
        update: (userId,userName, userAvatar) => {
            state.value["userId"] = userId
            state.value["userName"] = userName
            state.value["userAvatar"] = userAvatar
        },
        clear: (state) => {
            state.value = { userId: "", userName: "", userAvatar: "" }
        },
    },
})

// Action creators are generated for each case reducer function
export const { update, clear } = userInfo.actions

export default chatSession.reducer