import Qs from 'qs'
import axios from "axios"
import {DOWNLOAD_BASE_URL, API_BASE_URL} from "./URL";

export default class PostUtil {



    static uploadPicture(pic, picurl, setPicurl) {
        axios({
            url: API_BASE_URL + "/file/uploadPostPic",
            method: 'post',
            data: { file: pic },
            headers: {
                token: localStorage.getItem("token"),
                'Content-Type': 'multipart/form-data'

            }
        }).catch(exception => {

        }).then(response => {
            setPicurl([...picurl, response.data])
            console.log(picurl)

        })

    }

    static sendPost(content, pics, notice, who_can_see, location, list, setList) {
        let data = { images: pics, content: content, authorName: "author", notice: [], users: who_can_see, location: location, voices: [], videos: [], comments: [] }
        
        console.log(data)
        axios({
            url: API_BASE_URL + "/post/upload",
            method: 'post',
            data: data,
            headers: {
                token: localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }).catch(exception => {
            console.log(exception)
        }).then(response => {
            setList([data, ...list])
            console.log(response)

        })
    }


    
    static getPostsById(id, list,setList) {
        axios({
            url: API_BASE_URL + "/post/get_by_user_id",
            method: 'post',
            data: {userID: localStorage.getItem("userId")},
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
            headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(exception => {
            console.log(exception)
        }).then(response => {
            console.log(response)
            if (!response || !response.data || ! response.data.posts) {
                console.log("connection error")
                return 
            }
            setList([...list, ...response.data.posts])
        })
    }

    static getFriendPosts(list, setList) {
        axios({
            url: API_BASE_URL + "/post/get_friends_posts",
            method: 'post',
            data: {},
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
            headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(exception => {
            console.log(exception)
        }).then(response => {
            console.log(response)
            if (!response || !response.data || !response.data.posts) {
                console.log("connection error")
                return 
            }
            setList([...list, ...response.data.posts])
        })
    }

    static getRecommendPosts() {
        
    }





}