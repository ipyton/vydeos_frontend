
import { responsiveFontSizes } from "@mui/material"
import axios from "axios"
import Qs from 'qs'
export default class PictureUtil {
        static uploadAvatar(data) {
            async function upload() {
                let response = await axios({
                    url:"http://localhost:8080/account/uploadAvatar", 
                    method:'post',
                    data:{avatar: data},
                  headers:{token: localStorage.getItem("token"),
                           'Content-Type': 'multipart/form-data',
                           'userEmail':"1838169994@qq.com"}
                })
                let responseData = response.data
                console.log("-------------------")
                console.log(responseData)
                return responseData.code === 1
            }
            return upload()
        }
        static uploadArticlePics(data) {
            let response = axios({
                url:"http://localhost:8080/article/upload_pic", 
                method:'post',
                data:{pics: data},
                transformRequest:[function (data) {
                    return Qs.stringify(data)
                }],
              headers:{token: localStorage.getItem("token"),
                        'userEmail': '1838169994@qq.com'}
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }

        static downloadArticlePics(articleID,from, to) {
            async function download() {
                let response = await axios({
                    url:"http://localhost:8080/article/get_pic", 
                    method:'post',
                    data:{from:1, from:to, articleID: articleID},
                    headers:{token: localStorage.getItem("token"),
                           'userEmail': '1838169994@qq.com'},
                    responseType:'arraybuffer'
                })
                let responseData = response.data
                console.log("-------------------")
                console.log(responseData)
                return responseData.code === 1
            }
            return download()
        }

        static getAvatar() {
            async function download() {
                let response = await axios({
                    url:"http://localhost:8080/account/getAvatar", 
                    method:'post',
                    headers:{token: localStorage.getItem("token"),
                           'userEmail': '1838169994@qq.com'},
                           responseType:"arraybuffer"
                })
                // console.log(response)
                const blob = new Blob([response.data], { type: "image/jpg"});
                const imageUrl = URL.createObjectURL(blob);
                //let blob = new Blob([response.data],{type: "image/jpeg"});
                // response = URL.createObjectURL(blob)
                // console.log(response)
                return imageUrl
            }
            return download()
        }

        
}
