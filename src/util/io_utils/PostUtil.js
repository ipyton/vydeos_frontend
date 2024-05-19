import Qs from 'qs'
import axios from "axios"

export default class PostUtil {
    static getUrlBase (){
        return "http://localhost:8000/post"
    }
    static getAnPostId() {
        axios({
            url: this.getUrlBase() + "/upload",
            method: 'post',
            data: { pics: pics, content: content, notice: notice, who_can_see: who_can_see, location: location },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }], transformResponse: [function (data) {
                return Qs.parse(data)
            }],
            headers: {
                tokens: localStorage.getItem("token"),
            }
        }).catch(exception => {

        }).then(response => {


        })
    }

    static uploadPics() {

    }

    static sendPost(content, pics, notice, who_can_see, location,setList) {
        axios({
            url: this.getUrlBase() + "/upload",
            method: 'post',
            data: { pics:pics, content:content, notice:notice, who_can_see:who_can_see, location:location },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }], transformResponse: [function (data) {
                return Qs.parse(data)
            }],
            headers: {
                tokens: localStorage.getItem("token"),
            }
        }).catch(exception=>{

        }).then(response=>{


        })
    }

    static getPosts(){
        axios({
            url: this.getUrlBase()  + "/get",
            method: 'post',
            data: {},
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }], transformResponse: [function (data) {
                return Qs.parse(data)
            }],
            headers: {
                tokens: localStorage.getItem("token"),
            }
        }).catch(exception=>{
            
        }).then(response=>{
            if (!response || !response.data) {
                console.log("connection error")
            }
        })
    }






}