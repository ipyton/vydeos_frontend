import axios  from "axios"
import Qs from 'qs'

export default class IOUtil {
    static verifyTokens(token) {
        async function post(){
            let response = await axios({
                url:"http://localhost:8080/account/verifyToken", 
                method:'post',
                data:{token:localStorage.getItem("token")},
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
        return post()
    }
    
    static uploadArticle() {
        async function post(){
            let response = await axios({
                url:"http://localhost:8080/article/upload_article", 
                method:'post',
                data:{token:localStorage.getItem("token")},
                transformRequest:[function (data) {
                  return Qs.stringify(data)
              }],
              headers:{token:localStorage.getItem("token"),
                        'userEmail': '1838169994@qq.com'}
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static getArticle(articleID) {
        async function post(){
            let response = await axios({
                url:"http://localhost:8080/article/get_article", 
                method:'post',
                data:{token:localStorage.getItem("token")},
                transformRequest:[function (data) {
                  return Qs.stringify(data)
              }],
              headers:{token:localStorage.getItem("token"),
                        'userEmail': '1838169994@qq.com'}
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static getArticlesByUserID(userID, from, to) {
        async function post(){
            let response = await axios({
                url:"http://localhost:8080/article/get_articles_range", 
                method:'post',
                data:{token:localStorage.getItem("token"),
                        'userEmail': '1838169994@qq.com',
                        'from':from,
                        'to':to},
                transformRequest:[function (data) {
                  return Qs.stringify(data)
              }],
              headers:{token:localStorage.getItem("token"),
                        'userEmail': '1838169994@qq.com'}
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static getArticleByID(articleID) {
        async function post(){
            let response = await axios({
                url:"http://localhost:8080/article/get_recommend_articles", 
                method:'post',
                data:{token: localStorage.getItem("token")},
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
        return post()
    }
}



