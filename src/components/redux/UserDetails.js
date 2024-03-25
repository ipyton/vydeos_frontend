import { createSlice } from '@reduxjs/toolkit'

export const userInfo = createSlice({
    name: 'userDetails',
    initialState: {
        value: { "intro":"", "name":"", "pic":"", "gender":"", "birthdate":"", "location":"", "nickname":"", "imageData":[]},
    },
    reducers: {
        update: (state, intro, name, pic, gender, birthdate, location, nickname, imageData) => {
            state.value["intro"] = intro
            state.value["name"] = name
            state.value["pic"] = pic
            state.value["gender"] = gender
            state.value["birthdate"] = birthdate
            state.value["location"] = location
            state.value["nickname"] = nickname
            state.value["imageData"] = imageData
        },
        clear: (state) => {
            state.value = { "intro": "", "name": "", "pic": "", "gender": "", "birthdate": "", "location": "", "nickname": "", imageData: [] }
        },
    },
})

// Action creators are generated for each case reducer function
export const { update, clear } = userInfo.actions

export default userInfo.reducer