import axios from "axios"
import Qs from 'qs'

export default class IOUtil {
    static url_base = "http://localhost:8000"

    static getSearchResult(keyword) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/search/search",
                method: 'post',
                data: { tokens: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }], transformResponse: [function (data) {
                    return Qs.parse(data)
                }],
                headers: {
                    tokens: localStorage.getItem("token"),
                    userEmail: '1838169994@qq.com',
                    keyword: keyword
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static setSearch(config) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/search/set",
                method: 'post',
                data: { tokens: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }], transformResponse: [function (data) {
                    return Qs.parse(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    userEmail: '1838169994@qq.com',
                    config: config
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()

    }

    static verifyTokens(setState) {
        async function post() {
            if (localStorage.getItem("token") === null) {
                return
            }
            console.log("veryfying tokens")
            let response = await axios({
                url: this.url_base + "/account/verifyToken",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                }
            })
            let responseData = response.data
            setState(responseData.code === 1)
        }
        return post()
    }

    static uploadInformation(data, token) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/account/setinfo",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    'userEmail': '1838169994@qq.com'
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static downloadInformation(data, token) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/account/getinfo",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static uploadArticle(articleid, article) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/article/upload_article",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    'userEmail': '1838169994@qq.com'
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static getRecommendArticles(userID) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/article/get_recommend_articles",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    'userEmail': '1838169994@qq.com'
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static getArticlesByUserID(userID, from, to) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/article/get_articles_range",
                method: 'post',
                data: {
                    token: localStorage.getItem("token"),
                    'userEmail': '1838169994@qq.com',
                    'from': from,
                    'to': to
                },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    'userEmail': '1838169994@qq.com'
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static getArticleByID(articleID) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/article/get_article",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    'userEmail': '1838169994@qq.com'
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static getCommentByObjectID(objectID, from, to) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/comment/get",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }], transformResponse: [function (data) {
                    return Qs.parse(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    'userEmail': '1838169994@qq.com',
                    object: objectID
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()

    }

    static setCommentByObjectID(objectID, commentID) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/comment/set",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                transformResponse: [function (data) {
                    return Qs.parse(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    userEmail: '1838169994@qq.com',
                    object: objectID,
                    comment: commentID
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static getMessages(token) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/message/get_messages",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                transformResponse: [function (data) {
                    return Qs.parse(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    userEmail: '1838169994@qq.com',
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }

    static sendMessages(token) {
        async function post() {
            let response = await axios({
                url: this.url_base + "/message/send_message",
                method: 'post',
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                transformResponse: [function (data) {
                    return Qs.parse(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                    userEmail: '1838169994@qq.com',
                }
            })
            let responseData = response.data
            console.log(response)
            return responseData.code === 1
        }
        return post()
    }


}



