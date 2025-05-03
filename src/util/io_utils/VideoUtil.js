import Qs from 'qs'
import axios from "axios"
import CryptoJS from "crypto-js";

import SparkMD5 from "spark-md5";
import xxhash from 'xxhash-wasm';
import {DOWNLOAD_BASE_URL, API_BASE_URL} from "./URL";

export default class VideoUtil {




    static sendRequest(videoIdentifier) {
        let language = JSON.parse(localStorage.getItem("userInfo")).language
        return axios({
            url: API_BASE_URL + "/movie_management/sendRequest",
            method: 'post',
            data: {resourceId: videoIdentifier.resource_id, type: videoIdentifier.type, language: language},
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


    static get_comments(movieIdentifier) {
        return axios({
            url: API_BASE_URL + "/comment/get?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
            method: 'get',
            data: {  token: localStorage.getItem("token") },
            headers: {
                "token": localStorage.getItem("token"),
            }
        })
    }
    static send_comment(comment) {
        return axios({
            url: API_BASE_URL + "/comment/send",
            method: 'post',
            data: { ...comment },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],
             headers: {
                "token": localStorage.getItem("token"),
            }
        })
    }

    static isRequested(movieIdentifier) {
        return axios({
            url: API_BASE_URL + "/movie_management/isRequested?videoId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
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
            url: API_BASE_URL + "/movie_management/getRequests",
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




    static async uploadVideos(resourceId,type, value, setUploadState, resourceName,setIndicator,seasonId, episode) {
        let sliceLength = 1024 * 1024 * 32
        let length = value.size
        console.log("value:" + value)
        async function computexxHash(file) {
            // 初始化 xxhash-wasm
            const xxhashInstance = await xxhash();
            const hasher = xxhashInstance.create64("990816");
            
            const reader = file.stream().getReader();
            let totalBytes = 0;
            
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                break;
              }
              
              hasher.update(value);
              totalBytes += value.length;
            //   console.log(`Processed: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
            }
            
            return hasher.digest().toString(16);
          }
        
          const totalSlice = Math.ceil(length / sliceLength);
          const startTime = Date.now();
        let wholeHashCode = await computexxHash(value)
        console.log("wholeHashCode:" + wholeHashCode);
        console.log("MD5 computation took " + (Date.now() - startTime) + "ms");
        
        setIndicator("-- negotiating...")
        return axios({
            url: API_BASE_URL + "/file/negotiationStep1",
            method: 'post',
            data: { userEmail: localStorage.getItem("userId"), token: localStorage.getItem("token"),  
                wholeHashCode: wholeHashCode, resourceId : resourceId, resourceType: type, format: value.type, 
                fileName:value.name,size:value.size,quality:1, totalSlice: totalSlice,seasonId:seasonId, episode:episode },
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
                if (response.data.code === 1 || response.data.code === 2) {
                    let continueUpload = true;
                    setIndicator("-- uploading...")
                    let i = 0;
                    for (; i < totalSlice && continueUpload; i ++) {
                        console.log("Uploading chunk " + (i + 1) + " of " + totalSlice);
                        setUploadState((i + 1)/totalSlice * 100)
                        let chunk = value.slice(i * sliceLength, (i + 1) * sliceLength);
                        let formData = new FormData();
                        formData.append("wholeHashCode", wholeHashCode);
                        let chunkxxHash = await computexxHash(chunk); // Compute MD5 correctly
                        formData.append("hashCode", chunkxxHash);
                        formData.append("currentSlice", i);
                        formData.append("resourceId", resourceId);
                        formData.append("type", type);
                        formData.append("file", new Blob([chunk]), `chunk_${i}.bin`);
                        formData.append("seasonId", seasonId);
                        formData.append("episode", episode);
                        await axios.post(API_BASE_URL + "/file/uploadFile", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                // "Content-Length": chunk.size, // Explicitly setting Content-Length
                                "token": localStorage.getItem("token")
                            }
                        }).then(response => {
                            if (response.data.code === 0) {
                                console.log(`Chunk ${i} uploaded successfully`);

                            } else {
                                console.log(response.data.message)
                                continueUpload = false
                            }
                        }).catch(error => {
                            console.error(`Chunk ${i} upload failed`, error);
                        });

                        
                    }
                    if (i == totalSlice) {
                        setIndicator("-- encoding and decoding...")
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





    static batchStop(movies, downloadRecords, setDownloadRecords) {
        axios({
            url: DOWNLOAD_BASE_URL + "/movie/batch_stop",
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
        axios({
            url: DOWNLOAD_BASE_URL + "/movie/batch_pause",
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
            url: DOWNLOAD_BASE_URL + "/movie/batch_resume",
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
            url: DOWNLOAD_BASE_URL+ "/movie/batch_remove",
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

    static getGallery() {
        const userId = localStorage.getItem("userId")
        return axios({
            url: API_BASE_URL + "/gallery/get",
            method: 'get',
            params: { userId: localStorage.getItem("userId")},
            headers: {
                token: localStorage.getItem("token"),
            }
        })
    }

    static star(movieIdentifier) {
        let language = JSON.parse(localStorage.getItem("userInfo")).language
        return axios({
            url: API_BASE_URL+ "/gallery/collect",
            method: 'post',
            data: { "resourceId": movieIdentifier.resource_id, "type": movieIdentifier.type,"language":language },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],
            headers: {
                "token": localStorage.getItem("token"),
            }
        })

    }

    static removeStar(videoIdentifier) {
        return axios({
            url: URL.API_BASE_URL + "/gallery/remove",
            method: 'post',
            data: { resourceId: videoIdentifier.resource_id, type: videoIdentifier.type},
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],
            headers: {
                "token": localStorage.getItem("token"),
            }
        })
    }

    static isStared(videoIdentifier) {
        return axios({
            url: URL.API_BASE_URL + "/movie_management/isStared",
            method: 'get', params: { resourceId: videoIdentifier.resource_id, type: videoIdentifier.type },
            headers: {
                "token": localStorage.getItem("token"),
            }
        })   
    }

    static get_playables(movieIdentifier, seasonId, episode){
        if (movieIdentifier ==undefined || movieIdentifier == null || episode == undefined || episode == null || seasonId === undefined || seasonId == null) {
            return
        }
        return axios({
            url: URL.API_BASE_URL + "/movie_management/getPlayable?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type + 
            "&seasonId=" + seasonId + "&episode=" + episode,
            method: 'get',
            data: {  token: localStorage.getItem("token") },
            headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    static get_season_meta(resource_id, type, season_id) {
        return axios({
            url:URL.API_BASE_URL+ "/movie_management/get_season_meta                      ",
            method: 'post',
            data: { resourceId: resource_id, type: type, seasonId:season_id},
 headers: {
                token: localStorage.getItem("token"),
                'Content-Type': 'application/json',  

            }
        })
    }

    static isPlayable(movieIdentifier) {
        return axios({
            url: URL.API_BASE_URL + "/movie_management/isPlayable?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
            method: 'get',
            headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    static getVideoInformation(movieIdentifier, setState, language) {
        if (setState) setState(null)
        if (!language) language = JSON.parse(localStorage.getItem("userInfo")).language
        let episode = 0;
        let seasonId = 0;
        if (movieIdentifier.type === "tv") {
            episode = 1
            seasonId = 1
        }
        return axios({
            url:  URL.API_BASE_URL + "/movie/get_meta",
            method: 'get',
            params: {id:movieIdentifier.resource_id, type:movieIdentifier.type, userId: localStorage.getItem("userId"), "Accept-Language": language},
            headers: {  
                token: localStorage.getItem("token") }
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
            let actresses = []
            data["type"] = movieIdentifier.type
            data["actressList"].forEach(element => {
                actresses.push(JSON.parse(element))
            });
            data["actressList"] = actresses

            if (setState) setState(data)
            return data
        })
    }

    static add_season(resourceId, type ) {
        return axios({
            url: URL.API_BASE_URL + "/movie_management/add_season",
            method: 'post',
            data:{resourceId:resourceId, type:type},
            headers: {
                token: localStorage.getItem("token"),
                'Content-Type': 'application/json',  

            }
        })
    }

    static add_episode(resourceId, type, seasonId) {
        return axios({
            url: URL.API_BASE_URL + "/movie_management/add_episode",
            method: 'post',
            data:{resourceId:resourceId, type:type, seasonId: seasonId},
            headers: {
                token: localStorage.getItem("token"),
                'Content-Type': 'application/json',  

            }
        })
    }

    static add_download_source(videoIdentifier, source) {
        return axios({
            url: URL.API_BASE_URL + "/movie/add_source",
            method: 'post',
            data: { resourceId: videoIdentifier.resourceId, type: videoIdentifier.type,  source: source, name:videoIdentifier.movieName},
 headers: {
                token: localStorage.getItem("token"),
                'Content-Type': 'application/json',  

            }
        })
    }

    static remove_download_source(detail, source) {
        return axios({
            url: URL.API_BASE_URL + "/movie/remove_source",
            method: 'post',
            data: { resourceId: detail.resourceId, source: source, type: detail.type},
             headers: {
                token: localStorage.getItem("token"),
            }
        })
    }

    static get_download_sources(resource_id, type, seasonId, episode) {
        return axios({
            url: URL.API_BASE_URL + "/movie/get_sources",
            method: 'post',
            data: { resourceId: resource_id, type: type, seasonId:seasonId, episode:episode},
            headers: {
                token: localStorage.getItem("token"),
                'Content-Type': 'application/json', // Set content type to JSON

            }
        })
    }

    static get_file_list(meta_gid, movie_id, source_id, sources, setSources, setState, setPrevOpen, setSelectOpen, setTmpGid) {
        let retrytimes = 10
        let interval = 1000
        const intervalId = setInterval(async () => {
            try {
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


    static select(movie_id,type, source_id, gid, place, setSelectOpen) {
        axios({
            url: URL.API_BASE_URL + "/movie/select",
            method: 'post',
            data: { gid: gid, movieId: movie_id, resource: source_id, place: place, type: type },
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
            if (response.data === "exist!") {
                return
            }

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
            if (response.data === "exist!") {
                return
            }

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
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = response.data
            setRecord(response.data)

        })
    }

    static get_and_processM3u8(location, setOption, seasonId, episode) {
        // 检查参数有效性
        if (location == undefined || location == null) {
            return;
        }
        if (location.type === undefined || location.resource_id === undefined) {
            return;
        }
        if (seasonId === undefined || episode === undefined) {
            return;
        }
        
        // 如果是电影类型，设置默认值
        if (location.type === "movie") {
            episode = 0;
            seasonId = 0;
        }
        
        // 构建URL
        const prefix = "/play_videos/longvideos/" + encodeURIComponent(location.type + "_" + location.resource_id + "_" + seasonId + "_" + episode + "/");
        const m3u8Url = prefix + encodeURIComponent("index.m3u8");

        // 使用axios代替fetch
        return axios.get(m3u8Url)
            .then(response => {                
                // 处理M3U8内容
                console.log("getting contents from" + m3u8Url)
                const content = response.data;
                const lines = content.split("\n");
                const processedLines = lines.map(line => {
                    if (line.endsWith('.ts')) {
                        return prefix + line;
                    }
                    return line;
                });
                
                // 创建修改后的Blob和URL
                const modifiedData = processedLines.join('\n');
                const blob = new Blob([modifiedData], { type: 'application/x-mpegURL' });
                const url = URL.createObjectURL(blob);
                
                // 设置播放器选项
                setOption({
                    autoplay: false,
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