import axios from "axios"
import Qs from "qs"
import CryptoJS from "crypto-js";

const MAX_RETRY = 10


// function sendWithRetry(config, title, introduction) {
//     axios({
//         url:"http://localhost:8080/video/negotiation", 
//         method:'post',
//         data:{userEmail: localStorage.get("userEmail"), title: title, introduction: introduction, token:localStorage.getItem("token")},
//         transformRequest:[function (data) {
//           // 对 data 进行任意转换处理
//           return Qs.stringify(data)
//       }],
//     }).catch(errorHandler(config))
// }

// function errorHandler(err) {
//     let internal = () => {
//         if(err.request.tries < MAX_RETRY) {
//             err.request.tries --
//             sendWithRetry(err,err.request.title, err.request.introduction)
//         }
//     }
//     return internal
// }


export default class VideoUtil {
    static uploadVideos(title, introduction, value, setUploadState) {

        let sliceLength = 1024 * 1024 * 128
        let start = 0;
        let length = value.length
        let failed_count = 0;

        axios.interceptors.response.use(null, (err)=>{
            if (err.data) {
                console.log("error")
            }
            if (err.request) {
                if (err.request.tries > 0) {
                    err.request.tries --
                    axios(err.request)
                }
                else {
                    console.log("error")
                }
            }
        })

        let wholeHashCode = CryptoJS.SHA256(value)
        axios({
            url:"http://localhost:8080/video/negotiation", 
            method:'post',
            data:{userEmail: localStorage.get("userEmail"), title: title, introduction: introduction, token:localStorage.getItem("token"),tires:10,wholeHashCode: wholeHashCode},
            transformRequest:[function (data) {
              // 对 data 进行任意转换处理
              return Qs.stringify(data)
          }],
        }).err((err)=>{
            console.log(err)
        }).then(
          (response)=>{
            console.log("response");
            if(response.code === 1)
            {
                let threads = 2;
                console.log("uploading")
                for (let i = 0; i < length/sliceLength - 1; i ++) {
                    let chunk =  value.slice(i * sliceLength, (i + 1) * sliceLength);
                    if (threads != 0) {

                        axios({
                            url:"http://localhost:8080/video/upload", 
                            method:'post',
                            data:{
                            wholeHashCode: wholeHashCode,
                            hashCode: CryptoJS.SHA256(chunk),
                            data:chunk,
                            tries:10,
                            token: localStorage.getItem("token"),
                            index:i
                        },transformRequest:[function (data) {
                            // 对 data 进行任意转换处理
                            return Qs.stringify(data)
                        }]}).catch(err=>{
                            console.log("upload error")
                            
                        }).then(response=>{
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
        ).catch((err)=>{
          console.log("check your input")
        })
    

    }
}