import Qs from 'qs'
import axios from "axios"

export default class VideoUtil {

    static getVideoInformation(movie_id, setState) {
        setState(null)
        axios({
            url: "http://localhost:5000" + "/movie/get_meta",
            method: 'get',
            params: { detail_address: movie_id },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
                return
            }
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            console.log(data)
            let actresses = []
            data["type"] = "movie"
            console.log(data["actressList"])
            data["actressList"].forEach(element => {
                console.log(element)
                actresses.push(JSON.parse(element))
                console.log(JSON.parse(element))
            });
            data["actressList"] = actresses

            setState(data)
        })
    }

    static add_download_source(movie_id, source) {
        axios({
            url: "http://localhost:5000" + "/movie/add_source",
            method: 'get',
            params: { detail_address: movie_id },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            data["type"] = "movie"
        })
    }

    static start_download(movie_id, source) {
        axios({
            url: "http://localhost:5000" + "/movie/download",
            method: 'get',
            params: { detail_address: movie_id },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            data["type"] = "movie"
        })
    }

    static stop_download(movie_id, source) {
        axios({
            url: "http://localhost:5000" + "/movie/stop",
            method: 'get',
            params: { detail_address: movie_id },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            data["type"] = "movie"
        })
    }

    static check_download_status() {

        axios({
            url: "http://localhost:5000" + "/movie/check_download",
            method: 'get',
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            data["type"] = "movie"
        })
    }


}