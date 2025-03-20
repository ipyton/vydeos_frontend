import Qs from 'qs'
import axios from "axios"
import CryptoJS from "crypto-js";
import { LegendToggleTwoTone } from '@mui/icons-material';

import SparkMD5 from "spark-md5";
 
export default class VideoUtil {

    static getUrlBase() {
        return ""
    }


    static sendRequest(videoId) {
        return axios({
            url: "http://localhost:8080/movie/sendRequest",
            method: 'post',
            data: {videoId: videoId },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],
             headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch((err) => {

            console.log(err)
        })

    }

    static isRequested(videoId) {
        return axios({
            url: "http://localhost:8080/movie/isRequested?videoId=" + videoId,
            method: 'get',
            data: {  token: localStorage.getItem("token") },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],
             headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    
    static getRequests() {
        return axios({
            url: "http://localhost:8080/movie/getRequests",
            method: 'get',
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch((err) => {
            console.log(err)
        })
        return ""
    }


    static computeMD5(file) {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (event) {
            let wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(event.target.result));
            let hash = CryptoJS.MD5(wordArray).toString(); // Ensure it's MD5 like Java
            resolve(hash);
        };
        reader.onerror = function (err) {
            reject(err);
        };
        });
    }


    static async uploadVideos(resourceId, value, setUploadState, resourceName) {
        let sliceLength = 1024 * 1024 * 8
        let length = value.size

        const totalSlice = Math.floor(length / sliceLength) +  1
        async function computeChunkMD5(chunk) {
          const buffer = await chunk.arrayBuffer();
            const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(buffer));
            const md5Hash = CryptoJS.MD5(wordArray).toString();
            return md5Hash;
        }

    async function computeFileMD5(file, chunkSize = 4 * 1024 * 1024) { // Default: 4MB per chunk
    const chunks = Math.ceil(file.size / chunkSize);
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    let currentChunk = 0;

    return new Promise((resolve, reject) => {
        fileReader.onload = (event) => {
            spark.append(event.target.result);
            currentChunk++;

            if (currentChunk < chunks) {
                loadNextChunk();
            } else {
                resolve(spark.end()); // Final MD5 hash
            }
        };

        fileReader.onerror = (error) => reject(error);

        function loadNextChunk() {
            const start = currentChunk * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            fileReader.readAsArrayBuffer(file.slice(start, end));
        }

        loadNextChunk();
    });
}


        let wholeHashCode = await computeFileMD5(value)
        console.log("wholeHashCode:" + wholeHashCode)
        return axios({

            url: "http://localhost:8080/file/negotiationStep1",
            method: 'post',
            data: { userEmail: localStorage.getItem("userId"), token: localStorage.getItem("token"),  
                wholeHashCode: wholeHashCode, resourceId : resourceId, resourceType: "movie", format: value.type, 
                fileName:value.name,size:value.size,quality:1, totalSlice: totalSlice, },
            headers: {
                "token": localStorage.getItem("token"),
            },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data) 
            }],
        }).catch((err) => {
            console.log(err)
        }).then(
           async (response) => {
                console.log(response)
                if (response.data.code === 1 || response.data.code === 2) {
                    let threads = 2;
                    console.log(totalSlice)
                    let continueUpload = true;
                    for (let i = 0; i < totalSlice && continueUpload; i ++) {
                        setUploadState(i/totalSlice)
                        console.log(i + 1 + "/" + totalSlice)
                        let chunk = value.slice(i * sliceLength, (i + 1) * sliceLength);
                        console.log(chunk.size)
                        let formData = new FormData();
                        formData.append("wholeHashCode", wholeHashCode);
                        let chunkMD5 = await computeChunkMD5(chunk); // Compute MD5 correctly

                        formData.append("hashCode", chunkMD5);
                        formData.append("currentSlice", i);
                        formData.append("resourceId", resourceId);
                        formData.append("type", "movie");
                        formData.append("file", new Blob([chunk]), `chunk_${i}.bin`);
                    
                        await axios.post(VideoUtil.getUploadUrlBase() + "/file/uploadFile", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                // "Content-Length": chunk.size, // Explicitly setting Content-Length
                                "token": localStorage.getItem("token")
                            }
                        }).then(response => {
                            if (response.data.code === 0) {
                                console.log( response.data.message);
                            } else {
                                console.log(response.data.message)
                                continueUpload = false
                            }
                            console.log(`Chunk ${i} uploaded successfully`);
                        }).catch(error => {
                            console.error(`Chunk ${i} upload failed`, error);
                        });

                        
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
    static getUploadUrlBase() {
        return "http://localhost:8080"
    }

    static getDownloadUrlBase() {
        return "192.168.20.60:5000"
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/batch_resume",
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
            const result = []
            const newChecked = [...downloadRecords];
            movies.map((item) => {
                const currentIndex = downloadRecords.indexOf(item);
                newChecked.splice(currentIndex, 1);
            })
            setDownloadRecords(newChecked);

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
                console.log(response)
                return
            }
            if (!response.data) {
                console.log(response)
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
            url: "http://localhost:8080" + "/gallery/collect",
            method: 'post',
            data: { "videoId": videoId },
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
        return axios({
            url: "http://192.168.20.60:5000" + "/movie/get_meta",
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

    static add_download_source(movie_id, source, name, sources, setSources) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/add_source",
            method: 'post',
            data: { movieId: movie_id, source: source, name, },
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
            console.log(error)
            return
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
            return
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

    static get_file_list(meta_gid, movie_id, source_id, sources, setSources, setState, setPrevOpen, setSelectOpen, setTmpGid) {
        let retrytimes = 10
        let interval = 1000
        const intervalId = setInterval(async () => {
            try {
                console.log("trying")
                if (retrytimes === 0) clearInterval(intervalId);
                axios({
                    url: VideoUtil.getDownloadUrlBase() + "/movie/get_files",
                    method: 'post',
                    data: { gid: meta_gid, movieId: movie_id, resource: source_id },
                    transformRequest: [function (data) {
                        // 对 data 进行任意转换处理
                        return Qs.stringify(data)
                    }], headers: {
                        token: localStorage.getItem("token"),
                    }
                }).catch(error => {
                    console.log(error)
                    return
                }).then(function (response) {
                    console.log(response)
                    if (!response || !response.data) {
                        console.log("errror")
                        return
                    }
                    console.log(response)
                    if (response.data.status === "getting") {
                        return
                    }

                    clearInterval(intervalId);
                    setState([...response.data.files])
                    setTmpGid(response.data.gid)
                    setPrevOpen(false)
                    setSelectOpen(true)
                    retrytimes = 0
                    //props.setBarState({...props.barState, message:responseData.message, open:true})
                })
            } catch (error) {
                console.error('Error:', error);
                retrytimes--;
            }
        }, interval);



    }


    static select(movie_id, source_id, gid, place, setSelectOpen) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/select",
            method: 'post',
            data: { gid: gid, movieId: movie_id, resource: source_id, place: place },
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

    static start_download(movie_id, source_id, name, sources, setSources, setOpen, setSelections, setSelectOpen, setTmpGid) {
        axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/start",
            method: 'post',
            data: { movieId: movie_id, source: source_id, name: name },
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
            VideoUtil.get_file_list(response.data, movie_id, source_id, sources, setSources, setSelections, setOpen, setSelectOpen, setTmpGid)
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


    // static uploadVideos(formData, videoId) {
    //     axios.post({
    //         url:VideoUtil.getDownloadUrlBase() + "/movie/negotiateStep1",
    //         method: 'post',
    //         headers:{
    //             token: localStorage.getItem("token")
    //         }
    //     }).catch(err => {
    //         console.log(err)
    //     }).then((response) => {
    //         axios('http://localhost:8080/movie/uploadFile', {  // 假设你有一个 '/upload' 的 API
    //             method: 'POST',
    //             body: formData,
    //             headers:{
    //                 "Authorization": localStorage.getItem("token")
    //             }
    //         });
    //     })
    //     return 
    // }

    static get_and_processM3u8(location, setOption) {
        const prefix = "http://192.168.23.129:8848/videos/" + encodeURIComponent(location.videoId + "/" + location.resource + "/");
        const m3u8Url = prefix + encodeURIComponent("index.m3u8");

        console.log("Fetching M3U8 from:", m3u8Url);

        fetch(m3u8Url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(content => {
                console.log("Original M3U8 content:\n", content);

                const lines = content.split("\n");
                const processedLines = lines.map(line => {
                    if (line.endsWith('.ts')) {
                        return prefix + line;
                    }
                    return line;
                });

                const modifiedData = processedLines.join('\n');
                console.log("Modified M3U8 content:\n", modifiedData);

                const blob = new Blob([modifiedData], { type: 'application/x-mpegURL' });
                const url = URL.createObjectURL(blob);
                console.log("Generated Blob URL:", url);

                setOption({
                    autoplay: true,
                    controls: true,
                    responsive: true,
                    fluid: true,
                    fill: true,
                    sources: [{
                        src: url,
                        type: "application/x-mpegURL"
                    }],
                    playbackRates: [1, 2, 3]
                });
            })
            .catch(error => {
                console.error('Error fetching or processing M3U8:', error);
            });
    }

}