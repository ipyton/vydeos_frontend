import { createSlice } from '@reduxjs/toolkit'

export const userDetails = createSlice({
    name: 'userDetails',
    initialState: {
        value:{}

    },
    reducers: {
        updateFollowState:(state, follow)=>{
            state.relationship = state.relationship / 10 + 10*(!follow?1:0)
        },
        update: (state, information) => {

            state.value = information
            // state.intro = information["introduction"]
            // state.name = information["name"]
            // state.avatar = information["avatar"]
            // state.gender = information["gender"]
            // state.birthdate = information["dateOfBirth"]
            // state.location = information["location"]
            // state.nickname = information["nickname"]
            // state.imageData = null
            // state.relationship = information["relationship"]
            // state.userId = information["userId"]

            // console.log(state.intro)
            // console.log(information)
        },
        clear: (state) => {
        }
    },
})

// Action creators are generated for each case reducer function
export const { update, clear, updateFollowState } = userDetails.actions

export default userDetails.reducer