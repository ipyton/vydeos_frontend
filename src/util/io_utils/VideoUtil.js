import Qs from 'qs'
import CryptoJS from "crypto-js";
import SparkMD5 from "spark-md5";
import xxhash from 'xxhash-wasm';
import { apiClient, flaskClient, downloadClient } from "./ApiClient";

export default class VideoUtil {

    static sendRequest(videoIdentifier) {
        let language = JSON.parse(localStorage.getItem("userInfo")).language
        return apiClient({
            url: "/movie_management/sendRequest",
            method: 'post',
            data: {resourceId: videoIdentifier.resource_id, type: videoIdentifier.type, language: language},
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        }).catch((err) => {
            console.log(err)
        })
    }

    static get_comments(movieIdentifier) {
        return apiClient({
            url: "/comment/get?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
            method: 'get',
        })
    }

    static send_comment(comment) {
        return apiClient({
            url: "/comment/send",
            method: 'post',
            data: { ...comment },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        })
    }

    static isRequested(movieIdentifier) {
        return apiClient({
            url: "/movie_management/isRequested?videoId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
            method: 'get',
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        }).catch((err) => {
            console.log(err)
        })
    }

    static getRequests() {
        return apiClient({
            url: "/movie_management/getRequests",
            method: 'get',
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
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
            let hash = CryptoJS.MD5(wordArray).toString();
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
            }
            
            return hasher.digest().toString(16);
          }
        
          const totalSlice = Math.ceil(length / sliceLength);
          const startTime = Date.now();
        let wholeHashCode = await computexxHash(value)
        console.log("wholeHashCode:" + wholeHashCode);
        console.log("MD5 computation took " + (Date.now() - startTime) + "ms");
        
        setIndicator("-- negotiating...")
        return apiClient({
            url: "/file/negotiationStep1",
            method: 'post',
            data: { userEmail: localStorage.getItem("userId"), token: localStorage.getItem("token"),  
                wholeHashCode: wholeHashCode, resourceId : resourceId, resourceType: type, format: value.type, 
                fileName:value.name,size:value.size,quality:1, totalSlice: totalSlice,seasonId:seasonId, episode:episode },
            transformRequest: [function (data) {
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
                        let chunkxxHash = await computexxHash(chunk);
                        formData.append("hashCode", chunkxxHash);
                        formData.append("currentSlice", i);
                        formData.append("resourceId", resourceId);
                        formData.append("type", type);
                        formData.append("file", new Blob([chunk]), `chunk_${i}.bin`);
                        formData.append("seasonId", seasonId);
                        formData.append("episode", episode);
                        await apiClient.post("/file/uploadFile", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            }
                        }).then(response => {
                            if (response.data.code === 0) {
                                console.log(`Chunk ${i} uploaded successfully`);
                            } else {
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
        return downloadClient({
            url: "/movie/batch_stop",
            method: 'post',
            data: { movies: movies },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        })
    }

    static batchPause(movies, downloadRecords, setDownloadRecords) {
        return downloadClient({
            url: "/movie/batch_pause",
            method: 'post',
            data: { downloads: movies },
        })
    }

    static batchContinue(movies, downloadRecords, setDownloadRecords) {
        return downloadClient({
            url: "/movie/batch_resume",
            method: 'post',
            data: { downloads: movies },
        })
    }

    static batchRemove(movies, downloadRecords, setDownloadRecords) {
        return downloadClient({
            url: "/movie/batch_remove",
            method: 'post',
            data: { downloads: movies },
        })
    }

    static getGallery() {
        return apiClient({
            url: "/gallery/get",
            method: 'get',
            params: { userId: localStorage.getItem("userId")},
        })
    }

    static star(movieIdentifier) {
        let language = JSON.parse(localStorage.getItem("userInfo")).language
        return apiClient({
            url: "/gallery/collect",
            method: 'post',
            data: { "resourceId": movieIdentifier.resource_id, "type": movieIdentifier.type,"language":language },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        })
    }

    static removeStar(videoIdentifier) {
        return apiClient({
            url: "/gallery/remove",
            method: 'post',
            data: { resourceId: videoIdentifier.resource_id, type: videoIdentifier.type},
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        })
    }

    static isStared(videoIdentifier) {
        return apiClient({
            url: "/movie_management/isStared",
            method: 'get', 
            params: { resourceId: videoIdentifier.resource_id, type: videoIdentifier.type },
        })   
    }

    static get_playables(movieIdentifier, seasonId, episode){
        if (movieIdentifier ==undefined || movieIdentifier == null || episode == undefined || episode == null || seasonId === undefined || seasonId == null) {
            return
        }
        return apiClient({
            url: "/movie_management/getPlayable?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type + 
            "&seasonId=" + seasonId + "&episode=" + episode,
            method: 'get',
        }).catch((err) => {
            console.log(err)
        })
    }

    static get_season_meta(resource_id, type, season_id) {
        return apiClient({
            url: "/movie_management/get_season_meta",
            method: 'post',
            data: { resourceId: resource_id, type: type, seasonId:season_id},
            headers: {
                'Content-Type': 'application/json',  
            }
        })
    }

    static isPlayable(movieIdentifier) {
        return apiClient({
            url: "/movie_management/isPlayable?resourceId=" + movieIdentifier.resource_id + "&type=" + movieIdentifier.type,
            method: 'get',
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
        return flaskClient({
            url: "/movie/get_meta",
            method: 'get',
            params: {id:movieIdentifier.resource_id, type:movieIdentifier.type, userId: localStorage.getItem("userId"), "Accept-Language": language},
        }).catch(error => {
            console.log(error)
        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
                return
            }
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
        return apiClient({
            url: "/movie_management/add_season",
            method: 'post',
            data:{resourceId:resourceId, type:type},
            headers: {
                'Content-Type': 'application/json',  
            }
        })
    }

    static add_episode(resourceId, type, seasonId) {
        return apiClient({
            url: "/movie_management/add_episode",
            method: 'post',
            data:{resourceId:resourceId, type:type, seasonId: seasonId},
            headers: {
                'Content-Type': 'application/json',  
            }
        })
    }

    static add_download_source(videoIdentifier, source) {
        return flaskClient({
            url: "/movie/add_source",
            method: 'post',
            data: { resourceId: videoIdentifier.resourceId, type: videoIdentifier.type,  source: source, name:videoIdentifier.movieName},
            headers: {
                'Content-Type': 'application/json',  
            }
        })
    }

    static remove_download_source(detail, source) {
        return flaskClient({
            url: "/movie/remove_source",
            method: 'post',
            data: { resourceId: detail.resourceId, source: source, type: detail.type},
        })
    }

    static get_download_sources(resource_id, type, seasonId, episode) {
        return flaskClient({
            url: "/movie/get_sources",
            method: 'post',
            data: { resourceId: resource_id, type: type, seasonId:seasonId, episode:episode},
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    static get_file_list(meta_gid, movie_id, source_id, sources, setSources, setState, setPrevOpen, setSelectOpen, setTmpGid) {
        let retrytimes = 10
        let interval = 1000
        const intervalId = setInterval(async () => {
            try {
                if (retrytimes === 0) clearInterval(intervalId);
                downloadClient({
                    url: "/movie/get_files",
                    method: 'post',
                    data: { gid: meta_gid, movieId: movie_id, resource: source_id },
                    transformRequest: [function (data) {
                        return Qs.stringify(data)
                    }],
                }).catch(error => {
                    console.log(error)
                    return
                }).then(function (response) {
                    if (!response || !response.data) {
                        console.log("errror")
                        return
                    }
                    if (response.data.status === "getting") {
                        return
                    }

                    clearInterval(intervalId);
                    setState([...response.data.files])
                    setTmpGid(response.data.gid)
                    setPrevOpen(false)
                    setSelectOpen(true)
                    retrytimes = 0
                })
            } catch (error) {
                console.error('Error:', error);
                retrytimes--;
            }
        }, interval);
    }

    static select(movie_id,type, source_id, gid, place, setSelectOpen) {
        apiClient({
            url: "/movie/select",
            method: 'post',
            data: { gid: gid, movieId: movie_id, resource: source_id, place: place, type: type },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
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
        })
    }

    static start_download(movie_id, source_id, name, sources, setSources, setOpen, setSelections, setSelectOpen, setTmpGid) {
        downloadClient({
            url: "/movie/start",
            method: 'post',
            data: { movieId: movie_id, source: source_id, name: name },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
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
        })
    }

    static resume_download(movie_id, gid, setRecords) {
        downloadClient({
            url: "/movie/resume",
            method: 'post',
            data: { gid: gid, movie_id: movie_id },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            let data = response.data
            data["type"] = "movie"
        })
    }

    static pause_download(movie_id, gid, setRecord) {
        downloadClient({
            url: "/movie/pause",
            method: 'post',
            data: { movie_id: movie_id, gid: gid },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            let data = response.data
            data["type"] = "movie"
        })
    }

    static remove_download(movie_id, gid, setRecord) {
        downloadClient({
            url: "/movie/remove",
            method: 'post',
            data: { movie_id: movie_id, gid: gid },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        }).catch(error => {

        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            let data = response.data
            data["type"] = "movie"
        })
    }

    static check_current_download_status(setRecord) {
        return downloadClient({
            url: "/movie/get_download_status",
            method: 'get',
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
        }).then(function (response) {
            if (response === undefined || !response.data) {
                console.log("errror")
                return
            }
            let data = response.data
            setRecord(response.data)
        })
    }

    static get_and_processM3u8(location, setOption, seasonId, episode) {
        if (location == undefined || location == null) {
            return;
        }
        if (location.type === undefined || location.resource_id === undefined) {
            return;
        }
        if (seasonId === undefined || episode === undefined) {
            return;
        }
        
        if (location.type === "movie") {
            episode = 0;
            seasonId = 0;
        }
        
        const prefix = downloadClient.defaults.baseURL + "/play_videos/longvideos/" + encodeURIComponent(location.type + "_" + location.resource_id + "_" + seasonId + "_" + episode + "/");
        const m3u8Url = prefix + encodeURIComponent("index.m3u8");

        return downloadClient.get("/play_videos/longvideos/" + encodeURIComponent(location.type + "_" + location.resource_id + "_" + seasonId + "_" + episode + "/") + encodeURIComponent("index.m3u8"))
            .then(response => {                
                console.log("getting contents from" + m3u8Url)
                const content = response.data;
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