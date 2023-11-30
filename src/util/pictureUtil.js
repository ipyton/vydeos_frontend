
import axios from "axios"

export default class PictureUtil {
        static uploadAvatar(data) {
            let response = axios({
                url:"http://localhost:8080/account/uploadAvatar", 
                method:'post',
                data:{avatar: data},
              headers:{token: localStorage.getItem("token")}
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }

        static uploadArticle(data) {
            let response = axios({
                url:"http://localhost:8080/article/uploadArticlePics", 
                method:'post',
                data:{pics: data},
              headers:{token: localStorage.getItem("token")}
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        
}
