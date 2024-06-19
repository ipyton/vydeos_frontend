import Qs from 'qs'
import axios from "axios"
import CryptoJS from "crypto-js";
export default class VideoUtil {
    static uploadVideos(title, introduction, value, setUploadState) {

        let sliceLength = 1024 * 1024 * 128
        let start = 0;
        let length = value.length
        let failed_count = 0;

        axios.interceptors.response.use(null, (err) => {
            if (err.data) {
                console.log("error")
            }
            if (err.request) {
                if (err.request.tries > 0) {
                    err.request.tries--
                    axios(err.request)
                }
                else {
                    console.log("error")
                }
            }
        })

        let wholeHashCode = CryptoJS.SHA256(value)
        axios({
            url: "http://localhost:8080/video/negotiation",
            method: 'post',
            data: { userEmail: localStorage.get("userEmail"), title: title, introduction: introduction, token: localStorage.getItem("token"), tires: 10, wholeHashCode: wholeHashCode },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],
        }).err((err) => {
            console.log(err)
        }).then(
            (response) => {
                console.log("response");
                if (response.code === 1) {
                    let threads = 2;
                    console.log("uploading")
                    for (let i = 0; i < length / sliceLength - 1; i++) {
                        let chunk = value.slice(i * sliceLength, (i + 1) * sliceLength);
                        if (threads != 0) {

                            axios({
                                url: "http://localhost:8080/video/upload",
                                method: 'post',
                                data: {
                                    wholeHashCode: wholeHashCode,
                                    hashCode: CryptoJS.SHA256(chunk),
                                    data: chunk,
                                    tries: 10,
                                    token: localStorage.getItem("token"),
                                    index: i
                                }, transformRequest: [function (data) {
                                    // 对 data 进行任意转换处理
                                    return Qs.stringify(data)
                                }]
                            }).catch(err => {
                                console.log("upload error")

                            }).then(response => {
                                if (response.code == 1) {

                                } else {
                                    console.log("upload error")
                                }
                            })
                        }
                    }
                }
                else {
                    setUploadState.state = "unknownError"
                }
            }
        ).catch((err) => {
            console.log("check your input")
        })


    }

    static getUrlBase() {
        return "http://192.168.23.129:5000"
    }


    static batchStop(movies, downloadRecords, setDownloadRecords) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/batch_stop",
            method: 'post',
            data: { movies: movies },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
                return
            }
            //props.setBarState({...props.barState, message:responseData.message, open:true})

            let list = []



        })

    }

    static batchPause(movies, downloadRecords, setDownloadRecords) {
        console.log(Qs.stringify({ downloads: movies }))
        axios({
            url: VideoUtil.getUrlBase() + "/movie/batch_pause",
            method: 'post',
            data: { downloads: movies },
            headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
                return
            }
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let list = []
        })
    }

    static batchContinue(movies, downloadRecords, setDownloadRecords) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/batch_continue",
            method: 'post',
            data: { downloads: movies }, headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
                return
            }

        })
    }


    static batchRemove(movies, downloadRecords, setDownloadRecords) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/batch_remove",
            method: 'post',
            data: { downloads: movies }, headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
                return
            }


        })
    }

    static getGallery(setState) {
        const userId = localStorage.getItem("userId")
        const size = 4
        setState([])
        axios({
            url: "http://localhost:8000" + "/gallery/get",
            method: 'get',
            params: { userId: localStorage.get("userId") },
            headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (!response) {
                console.log("error")
                return
            }
            console.log(response)
            const rows = []
            const body = JSON.parse(response.data)
            for (const i = 0; i < Math.floor(body.length / size) + 1; i++) {
                const row = []
                for (const col = 0; col < size; col++) {
                    row.push(body[i * size + col])
                }
                rows.push(row)
            }
            setState(rows)
        })
    }
    static star(videoId, details, setDetails) {
        console.log(details)
        axios({
            url: "http://localhost:8000" + "/gallery/collect",
            method: 'post',
            data: { "videoId": details.movieId },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],
            headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (!response) {
                console.log("error")
                return
            }
            console.log(response)
            if (response.data === "success") {
                details.stared = true
                setDetails({...details})
                console.log(details)
            }
        })

    }

    static removeStar(videoId, details, setDetails) {
        axios({
            url: "http://localhost:8000" + "/gallery/remove",
            method: 'post',
            data: { "videoId": details.movieId },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],
            headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (!response) {
                console.log("error")
                return
            }
            if (response.data === "success") {
                details.stared = false
                setDetails({...details})
            }

        })
    }

    static getVideoInformation(movie_id, setState) {
        setState(null)
        axios({
            url: "http://localhost:5000" + "/movie/get_meta",
            method: 'get',
            params: { detail_address: movie_id, userId: localStorage.getItem("userId") },
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

    static add_download_source(movie_id, source, sources, setSources) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/add_source",
            method: 'post',
            data: { movieId: movie_id, source: source, },
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
            if (data === "success") {
                setSources([...sources, { movie_id: movie_id, source: source, status: "init" }])
            }

        })
    }

    static remove_download_source(movie_id, source, sources, setSources) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/remove_source",
            method: 'post',
            data: { movieId: movie_id, source: source },
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
            console.log(response)
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            for (let i = 0; i < sources.length; i++) {
                if (sources[i].source === source) {
                    sources.splice(i, 1)
                    break
                }
            }
            setSources([...sources])
        })
    }

    static get_download_source(movie_id, setSources) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/get_source",
            method: 'post',
            data: { movieId: movie_id },
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
            setSources(data)
        })




    }

    static start_download(movie_id, source_id, sources, setSources) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/start",
            method: 'post',
            data: { movieId: movie_id, source: source_id },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined || !response.data) {
                console.log("errror")
                return
            }
            if (response.data === "exist!") {
                return
            }
            console.log(response)

            for (let i = 0; i < sources.length; i++) {
                if (sources[i].source === source_id) {
                    sources[i].gid = response.data
                }
            }
            setSources([...sources])
            //props.setBarState({...props.barState, message:responseData.message, open:true})
        })
    }

    static resume_download(movie_id, gid, setRecords) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/resume",
            method: 'post',
            data: { gid: gid, movie_id: movie_id },
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

    static pause_download(movie_id, gid, setRecord) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/pause",
            method: 'post',
            data: { movie_id: movie_id, gid: gid },
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

    static remove_download(movie_id, gid, setRecord) {
        axios({
            url: VideoUtil.getUrlBase() + "/movie/remove",
            method: 'post',
            data: { movie_id: movie_id, gid: gid },
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

    static check_current_download_status(setRecord) {

        axios({
            url: VideoUtil.getUrlBase() + "/movie/get_download_status",
            method: 'get',
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined || !response.data) {
                console.log("errror")
                return
            }
            console.log(response)
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            setRecord(response.data)

        })
    }


}