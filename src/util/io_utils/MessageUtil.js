import localforage from "localforage"
import Qs from 'qs'
import axios from "axios"
import { update, clear, updateFollowState } from "../../components/redux/UserDetails"
import { resolve } from "babel-standalone"
import { ReceiptRounded } from "@mui/icons-material"
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
                    return Qs.stringify(data)
                }],
                //synchronous: true,
                header: {
                    token: localStorage.getItem("token"),
                }
            }
        ).catch(error => {
            console.log()
        }).then(response => {
            //MessageUtil.updateMessage(response)
            console.log(response)

        }).catch(error => {
            console.log("get message by Id error")
        }).then(() => {
            console.log("success!")
        })
    }

    static setCheckTime(key) {
        localforage.setItem("chatLastUpdate")

    }

    static getNewestMessages(friendId, setSelect) {
        let checkKey = "chatLastUpdate_" + friendId
        localforage.getItem(checkKey).then(async timestamp => {
            if (!timestamp) {
                timestamp = 0;
            }
            axios(
                {
                    url: MessageUtil.getUrlBase() + "/chat/getNewestMessages",
                    method: "post",
                    data: { "userId": friendId, "timestamp": timestamp },
                    transformRequest: [function (data) {
                        console.log(Qs.stringify(data))
                        return Qs.stringify(data)
                    }],
                    //synchronous: true,
                    headers: {
                        token: localStorage.getItem("token"),
                    }
                }
            ).then(
                async (response) => {
                    //MessageUtil.updateMessage(response)
                    //console.log(response)

                    if (!response) {
                        return
                    }
                    if (!response.data) {
                        console.log("error")
                        return
                    }

                    if (response.data.code !== 1) {
                        console.log("logic error")
                        return
                    }
                    const messages = JSON.parse(response.data.message)
                    let records_map = {}

                    //dispatch messages to their sender in a map. 
                    let maxTimestamp = timestamp
                    for (let i = 0; i < messages.length; i++) {
                        let userId = messages[i].userId;
                        if (records_map[userId]) {
                            records_map[userId].push(messages[i])
                        } else {
                            records_map[userId] = [messages[i]]
                        }
                        maxTimestamp = Math.max(messages[i].sendTime, maxTimestamp)
                    }
                    await localforage.setItem(checkKey, maxTimestamp)

                    //write to the database
                    for (let key in records_map) {
                        let value = records_map[key]
                        let result = await localforage.getItem(key + "_records")
                        if (!result) {
                            result = { count: value.size, chats: value }
                        }
                        else {
                            result.count++
                            result.chats = [result.chats, ...value]
                        }
                        await localforage.setItem("send_from_" + friendId, result.chats)
                    }

                    // get chat record contacts lists
                    await localforage.getItem("contactCursor").then((userId) => {
                        if (!userId) {
                            localforage.getItem("contactRecordList").then((result) => {

                            })
                            return
                        }
                        localforage.getItem("contactRecordList").catch(() => {
                        }).then(async (result) => {
                            if (!result) {
                                return
                            }
                            let contains = -1
                            for (let i = 0; i < result.length; i++) {
                                if (result[i].userId === userId) {
                                    contains = i;
                                }
                            }
                            // contactDetails
                            // contactRecordList [{userId:userId, avatar:avatar, userName}, xxx, xxx]
                            let detail = await localforage.getItem(userId + "_detail")
                            if (contains === -1) {//query from localforage and set information
                                if (!detail) {
                                    console.log("he is not your friend!!!!")
                                    return
                                }
                                result = [...result, { userName: detail.userName, avatar: detail.avatar, userId: detail.userId }]
                                localforage.setItem("contactRecordList", result)
                            }
                            else {
                                result = [...result, { userName: detail.userName, avatar: detail.avatar, userId: detail.userId }]
                                localforage.setItem("contactRecordList", result)
                            }
                        }
                        )
                    })
                }
            ).then(() => {
                setSelect(friendId)


            })
        })
    }

    static sendMessage(userId, sendTo, content, messageType, chatRecords, setChatRecords, type) {
        let data = { userId: userId, receiverId: sendTo, content: content, messageType: messageType, type: type }
        axios(
            {
                url: MessageUtil.getUrlBase() + "/chat/sendMessage",
                method: "post",
                data: data,
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                //synchronous: true,
                headers: {
                    token: localStorage.getItem("token"),
                }
            }
        ).catch(err => {
            console.log("requestNewMessageError")
        }).then(
            response => {
                if (!response || response.data.code !== 1) {
                    console.log("internal errors ")
                }
                let message = JSON.parse(response.data.message)
                localforage.getItem("send_to_" + sendTo).then(res => {
                    data["messageId"] = message.messageId
                    data["sendTime"] = message.timestamp
                    localforage.setItem("send_to_" + sendTo, [...res, data]).then(
                        setChatRecords([...chatRecords, data])
                    )

                })

            }
        ).catch(err => {
            console.log("parse Error")
        })
    }

    // this is used for show friend details.
    static requestUserInfo(userId, navigator) {
        console.log(userId)
        //get information from search/ friend list.
        axios({
            url: MessageUtil.getUrlBase() + "/friends/getUserIntro",
            method: 'post',
            data: { token: localStorage.getItem("token"), userIdToFollow: userId },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
        }).then(function (response) {
            if (!response) {
                console.log("error")
                return
            }
            let responseData = response.data
            if (responseData.code === -1) {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
                return
            }
            else if (responseData.code === 1) {
                console.log(responseData.message)
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