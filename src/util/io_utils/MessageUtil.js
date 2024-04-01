import localforage from "localforage"

export default class MessageUtil {

    static getUrlBase() {
        return ""
    }

    static initialize() {
        // initialize when user first start the application
    }

    static updateMessage(response) {
        response = JSON.parse(response.data)
        for (i = 0; i < response.size(); i++) {
            localforage.getItem(response[i]["user_id"]).then(function (value) {
                value["chatRecords"].push(response[i]["records"])
                localforage.setItem(response[i]["user_id"], value)
            })
        }
    }

    static getMessageById(userId, receiverId) {
        axios(
            {
                url: MessageUtil.getUrlBase() + "/getChatRecordsById",
                method: "post",
                data: { token: localStorage.getItem("token") },
                transformRequest:[function(data) {
                    return qs.stringify(data)
                }],
                //synchronous: true,
                header: {
                    tokenL: localStorage.getItem("token"),
                }
            }
        ).catch(error => {
            console.log()
        }).then(response => {
            MessageUtil.updateMessage(response)
        }).catch(error=>{
            console.log("get message by Id error")
        }).then(()=> {
            console.log("success!")
        }) 
    }

    static getNewestMessages(userId, fromTimestamp, navigator) {
        axios(
            {
                url: MessageUtil.getUrlBase() + "/getNewestMessage",
                method: "post",
                data: { token: localStorage.getItem("token"), userId: userId, timstamp: fromTimestamp},
                transformRequest: [function (data) {
                    return qs.stringify(data)
                }],
                //synchronous: true,
                header: {
                    tokenL: localStorage.getItem("token"),
                }
            }
        ).catch(err => {
            console.log("requestNewMessageError")
        }).then(
            response => {
                MessageUtil.updateMessage(response)
            }
        ).catch(err=> {
            console.log("parse Error")
        }).then(
            ()=>{
                navigator("chat")
            }
        ) 
    }

}