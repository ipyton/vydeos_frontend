import Qs from 'qs'
import axios from "axios"
import CryptoJS from "crypto-js";

import SparkMD5 from "spark-md5";
import xxhash from 'xxhash-wasm';

export default class VideoUtil {

    static getUrlBase() {
        return "http://127.0.0.1:8080"
    }

    static getUploadUrlBase() {
        return "http://localhost:8080"
    }

    static getDownloadUrlBase() {
        return "http://127.0.0.1:5001"
    }


    static sendRequest(videoIdentifier) {
        let language = JSON.parse(localStorage.getItem("userInfo")).language
        return axios({
            url: VideoUtil.getUrlBase() + "/movie/sendRequest",
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
            url: VideoUtil.getUrlBase() + "/comment/get?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
            method: 'get',
            data: {  token: localStorage.getItem("token") },
            headers: {
                "token": localStorage.getItem("token"),
            }
        })
    }
    static send_comment(comment) {
        return axios({
            url: VideoUtil.getUrlBase() + "/comment/send",
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
            url: VideoUtil.getUrlBase() + "/movie/isRequested?videoId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
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
            url: VideoUtil.getUrlBase() + "/movie/getRequests",
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




    static async uploadVideos(resourceId, value, setUploadState, resourceName,setIndicator) {
        setIndicator("-- preprocessing...")
        let sliceLength = 1024 * 1024 * 8
        let length = value.sizes
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
              console.log(`Processed: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
            }
            
            return hasher.digest().toString(16);
          }
        
        const totalSlice = Math.floor(length / sliceLength) +  1
        async function computeChunkMD5(chunk) {
          const buffer = await chunk.arrayBuffer();
            const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(buffer));
            const md5Hash = CryptoJS.MD5(wordArray).toString();
            return md5Hash;
        }

    // async function compute(file, chunkSize = 64 * 1024 * 1024) { // Default: 4MB per chunk
    // const chunks = Math.ceil(file.size / chunkSize);
    // const spark = new SparkMD5.ArrayBuffer();
    // const fileReader = new FileReader();
    
    // let currentChunk = 0;

    // return new Promise((resolve, reject) => {
    //     fileReader.onload = (event) => {
    //         spark.append(event.target.result);
    //         currentChunk++;

    //         if (currentChunk < chunks) {
    //             loadNextChunk();
    //         } else {
    //             resolve(spark.end()); // Final MD5 hash
    //         }
    //     };

    //     fileReader.onerror = (error) => reject(error);

    //     function loadNextChunk() {
    //         const start = currentChunk * chunkSize;
    //         const end = Math.min(start + chunkSize, file.size);
    //         fileReader.readAsArrayBuffer(file.slice(start, end));
    //     }

    //     loadNextChunk();
    // });
//}       
        const startTime = Date.now();
        let wholeHashCode = await computexxHash(value)
        console.log("wholeHashCode:" + wholeHashCode);
        console.log("MD5 computation took " + (Date.now() - startTime) + "ms");
        
        setIndicator("-- negotiating...")
        return axios({
            url: VideoUtil.getUrlBase() + "/file/negotiationStep1",
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
                if (response.data.code === 1 || response.data.code === 2) {
                    let continueUpload = true;
                    setIndicator("-- uploading...")
                    let i = 0;
                    for (; i < totalSlice && continueUpload; i ++) {
                        setUploadState(i/totalSlice * 100)
                        let chunk = value.slice(i * sliceLength, (i + 1) * sliceLength);
                        let formData = new FormData();
                        formData.append("wholeHashCode", wholeHashCode);
                        let chunkxxHash = await computexxHash(chunk); // Compute MD5 correctly

                        formData.append("hashCode", chunkxxHash);
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

    static getGallery() {
        const userId = localStorage.getItem("userId")
        return axios({
            url: VideoUtil.getUrlBase() + "/gallery/get",
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
            url: VideoUtil.getUrlBase() + "/gallery/collect",
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
            url: VideoUtil.getUrlBase() + "/gallery/remove",
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
            url: VideoUtil.getUrlBase() + "/movie/isStared",
            method: 'get', params: { resourceId: videoIdentifier.resource_id, type: videoIdentifier.type },
            headers: {
                "token": localStorage.getItem("token"),
            }
        })   
    }

    static get_playables(movieIdentifier, seasonId, episode){
        console.log(movieIdentifier)
        if (!movieIdentifier || !episode) {
            return
        }
        return axios({
            url: VideoUtil.getUrlBase() + "/movie/getPlayable?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type + 
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/get_season_meta                      ",
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
            url: VideoUtil.getUrlBase() + "/movie/isPlayable?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
            method: 'get',
            headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    static getVideoInformation(movieIdentifier, setState) {
        setState(null)

        let language = JSON.parse(localStorage.getItem("userInfo")).language
        return axios({
            url: "http://127.0.0.1:5000" + "/movie/get_meta",
            method: 'get',
            params: { id:movieIdentifier.resource_id, type:movieIdentifier.type, userId: localStorage.getItem("userId"), "Accept-Language": language},
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
            let actresses = []
            data["type"] = movieIdentifier.type
            data["actressList"].forEach(element => {
                actresses.push(JSON.parse(element))
            });
            data["actressList"] = actresses

            setState(data)
        })
    }

    static add_download_source(videoIdentifier, source) {
        return axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/add_source",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/remove_source",
            method: 'post',
            data: { resourceId: detail.resourceId, source: source, type: detail.type},
             headers: {
                token: localStorage.getItem("token"),
            }
        })
    }

    static get_download_sources(resource_id, type, seasonId, episode) {
        return axios({
            url: VideoUtil.getDownloadUrlBase() + "/movie/get_sources",
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
            url: VideoUtil.getDownloadUrlBase() + "/movie/select",
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

    static get_and_processM3u8(location, setOption) {
        const prefix = "http://127.0.0.1:8848/videos/longvideos/" + encodeURIComponent(location.type+ "_" + location.resource_id + "/" );
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

                const blob = new Blob([modifiedData], { type: 'application/x-mpegURL' });
                const url = URL.createObjectURL(blob);
//
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