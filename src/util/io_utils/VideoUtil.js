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

    static getDownloadUrlBase() {
        return "http://192.168.23.129:5001"
    }


    static batchStop(movies, downloadRecords, setDownloadRecords) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/batch_stop",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/batch_pause",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/batch_continue",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/batch_remove",
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
            params: { userId: localStorage.getItem("userId") },
            headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
            return
        }).then(function (response) {
            if (!response) {
                console.log("error")
                return
            }
            console.log(response)
            let rows = []
            const body = response.data
            console.log(Math.floor(body.length / size) + 1)
            for (let i = 0; i < Math.floor(body.length / size) + 1; i++) {
                let row = []
                for (let col = 0; col < size && i * size + col < body.length; col++) {
                    row.push(body[i * size + col])
                }
                console.log(row)
                rows.push(row)
            }
            console.log(rows)
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
                setDetails({ ...details })
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
                setDetails({ ...details })
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
            console.log(error)
        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
                return
            }
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            let actresses = []
            data["type"] = "movie"
            data["actressList"].forEach(element => {
                actresses.push(JSON.parse(element))
                console.log(JSON.parse(element))
            });
            data["actressList"] = actresses

            setState(data)
        })
    }

    static add_download_source(movie_id, source,name, sources, setSources) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/add_source",
            method: 'post',
            data: { movieId: movie_id, source: source, name,},
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            console.log(response)
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            if (data === "success") {
                setSources([...sources, { movie_id: movie_id, source: source, status: "init" }])
            }

        })
    }

    static remove_download_source(movie_id, source, sources, setSources) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/remove_source",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/get_source",
            method: 'post',
            data: { movieId: movie_id },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
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

    static get_file_list(meta_gid,setState,setPrevOpen,setSelectOpen) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/get_files",
            method: 'post',
            data: { gid: meta_gid },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
        }).then(function (response) {
            if (!response || !response.data) {
                console.log("errror")
                return
            }
            console.log(response)
            if (response.data === "exist!") {
                return
            }
            console.log(response)

            setState([...response.data])
            setPrevOpen(false)
            setSelectOpen(true)
            //props.setBarState({...props.barState, message:responseData.message, open:true})
        })

    }


    static select(movie_id,source_id,meta_gid, place,setSelectOpen){
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/select",
            method: 'post',
            data: { gid: meta_gid,movie_id:movie_id,source_id:source_id,place:place },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
        }).then(function (response) {
            if (!response || !response.data) {
                console.log("errror")
                return
            }
            console.log(response)
            if (response.data === "exist!") {
                return
            }
            console.log(response)

            setSelectOpen(false)
            //props.setBarState({...props.barState, message:responseData.message, open:true})
        })
    }

    static start_download(movie_id, source_id,name, sources, setSources) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/start",
            method: 'post',
            data: { movieId: movie_id, source: source_id, name:name },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
        }).then(function (response) {
            if (response === undefined || !response.data) {
                console.log("errror")
                return
            }
            console.log(response)
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/resume",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/pause",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/remove",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/get_download_status",
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

    static getPlayInformation(movieId, setOption) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/getPlayInformation",
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
            setOption({
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                fill: true,
                sources: [{
                    src: data.src,
                    type: "application/x-mpegURL"
                }]
                , playbackRates: [1, 2, 3]
            })

        })
    }


}