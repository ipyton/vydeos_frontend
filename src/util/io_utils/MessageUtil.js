import localforage from "localforage"
import qs from 'qs'
import axios from "axios"
import { update, clear, updateFollowState } from "../../components/redux/UserDetails"
import { resolve } from "babel-standalone"
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
            //MessageUtil.updateMessage(response)
            console.log(response)

        }).catch(error => {
            console.log("get message by Id error")
        }).then(() => {
            console.log("success!")
        })
    }

    static getNewestMessages(userId, timestamp) {

        localforage.getItem("chatLastUpdate").then(timestamp => {
            if (timestamp === undefined || timestamp === null) {
                return
            }

            axios(
                {
                    url: MessageUtil.getUrlBase() + "/getNewestMessage",
                    method: "post",
                    data: { "userId": userId, "timstamp": timestamp },
                    transformRequest: [function (data) {
                        return qs.stringify(data)
                    }],
                    //synchronous: true,
                    header: {
                        token: localStorage.getItem("token"),
                    }
                }
            ).catch(err => {
                console.log("requestNewMessageError")
            }).then(
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
                    let maxTimestamp = -1
                    for (let i = 0; i < messages.size(); i++) {
                        let userId = messages[i].userId;
                        if (records_map[userId]) {
                            records_map[userId].push(messages[i])
                        } else {
                            records_map[userId] = [messages[i]]
                        }

                        maxTimestamp = Math.max(messages[i].timestamp, maxTimestamp)
                    }

                    await localforage.setItem("chatLastUpdate", maxTimestamp)


                    //write to the database
                    for (let [key, value] of records_map) {
                        let result = await localforage.getItem(key + "_records")
                        if (!result) {
                            result = { count: value.size(), chats: value }
                        }
                        else {
                            result.count++
                            result.chats = [result.chats, ...value]
                        }
                        await localforage.setItem(key + "_records")
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
            ).catch(err => {
                console.log("parse Error")
            }).then(
                () => {
                    navigator("chat")
                }
            )



        })
    }

    static sendMessage(userId, sendTo, content, type, chatRecords, setChatRecords) {
        axios(
            {
                url: MessageUtil.getUrlBase() + "/sendMessage",
                method: "post",
                data: { userId: userId, receiverId: sendTo, content: content, type: type },
                transformRequest: [function (data) {
                    return qs.stringify(data)
                }],
                //synchronous: true,
                header: {
                    token: localStorage.getItem("token"),
                }
            }
        ).catch(err => {
            console.log("requestNewMessageError")
        }).then(
            response => {
                if (!response) {
                    if (response.data.code === 1) {
                        let time = response.data.timestamp
                        console.log(time)
                        setChatRecords([...chatRecords, { position: "right", type: type, content: content, timestamp: time }])
                    }


                }
            }
        ).catch(err => {
            console.log("parse Error")
        }).then(
            () => {

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