import localforage from "localforage"
import qs from 'qs'
import axios from "axios"
import { update, clear, updateFollowState } from "../../components/redux/UserDetails"
export default class MessageUtil {

    static getUrlBase() {
        return "http://localhost:8000"
    }

    static initialize() {
        // initialize when user first start the application

    }

    static setUserIntro(information, dispatch) {
        console.log(information)
        dispatch(update(information))
    }
    static updateMessage(response) {
        // find the newest message.
        response = JSON.parse(response.data)
        for (let i = 0; i < response.size(); i++) {
            localforage.getItem(response[i]["user_id"]).then(function (value) {
                value["chatRecords"].push(response[i]["records"])
                localforage.setItem(response[i]["user_id"], value)
            })
        }
    }

    static getMessageById(userId, receiverId) {
        axios(
            {
                url: MessageUtil.getUrlBase() + "/getChatRecordsByUserId",
                method: "post",
                data: { token: localStorage.getItem("token") },
                transformRequest: [function (data) {
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
        }).catch(error => {
            console.log("get message by Id error")
        }).then(() => {
            console.log("success!")
        })
    }

    static getNewestMessages(userId, fromTimestamp, navigator) {
        axios(
            {
                url: MessageUtil.getUrlBase() + "/getNewestMessage",
                method: "post",
                data: { token: localStorage.getItem("token"), userId: userId, timstamp: fromTimestamp },
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
        ).catch(err => {
            console.log("parse Error")
        }).then(
            () => {
                navigator("chat")
            }
        )
    }

    static sendMessage(userId, sendTo, fromTimestamp) {
        axios(
            {
                url: MessageUtil.getUrlBase() + "/sendMessage",
                method: "post",
                data: { userId: userId, receiverId: sendTo, timstamp: fromTimestamp },
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
        ).catch(err => {
            console.log("parse Error")
        }).then(
            () => {
                navigator("chat")
            }
        )


    }

    static requestUserInfo(dispatch, userId, navigator) {

        //get information from search/ friend list.
        axios({
            url: MessageUtil.getUrlBase() + "/friends/getUserIntro",
            method: 'post',
            data: { token: localStorage.getItem("token"), userIdToFollow: userId },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
        }).then(function (response) {
            if (response === undefined || response.data === undefined) {
                console.log("error")
                return
            }
            let responseData = response.data
            if (responseData.code === -1) {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
                return
            }
            else if (responseData.code === 1) {
                //MessageUtil.setUserIntro(JSON.parse(responseData.message), dispatch)
                localforage.setItem("userIntro", JSON.parse(responseData.message)).then(() => {
                    navigator("/friendInfomation")
                })

            }
            else {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            //setNetworkErr(false)
        })
    }

}