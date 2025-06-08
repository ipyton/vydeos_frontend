import localforage from "localforage"
import Qs from 'qs'
import { update, clear, updateFollowState } from "../../components/redux/UserDetails"
import { apiClient } from "./ApiClient";
import DatabaseManipulator from "./DatabaseManipulator"

export default class MessageUtil {

    static initialize() {
        // initialize when user first start the application
    }

    static setUserIntro(information, dispatch) {
        console.log(information);
        dispatch(update(information));
    }

    static updateMessage(response) {
        // find the newest message.
        response = JSON.parse(response.data);
        for (let i = 0; i < response.size(); i++) {
            localforage.getItem(response[i]["user_id"]).then(function (value) {
                value["chatRecords"].push(response[i]["records"]);
                localforage.setItem(response[i]["user_id"], value);
            });
        }
    }

    // static getMessageById(type, receiverId) {
    //     return DatabaseManipulator.getRecentContactByTypeAndId(type, receiverId).then((res) => {
    //         return DatabaseManipulator.getTimestamp().then((timestamp) => {
    //             if (!timestamp) {
    //                 timestamp = 0;
    //             }
                
    //             const requestData = Qs.stringify({
    //                 type: type,
    //                 ...(type === "group" ? { groupId: receiverId } : { receiverId: receiverId }),
    //                 timestamp: timestamp
    //             });

    //             return apiClient.post("/chat/get_messages", requestData, {
    //                 headers: {
    //                     'Content-Type': 'application/x-www-form-urlencoded'
    //                 }
    //             }).catch(error => {
    //                 console.log(error);
    //             });
    //         }).then((response) => {
    //             return DatabaseManipulator.batchAddContactHistory(response.data);
    //         });
    //     });
    // }

    static setCheckTime(key) {
        localforage.setItem("chatLastUpdate");
    }

    static searchLocalRecords(keywords, dispatch) {
        // Implementation needed
    }

    static registerEndPoint(endpoint, p256dh, auth) {
        p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(p256dh)));
        auth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));
        
        apiClient.post("/chat/registerWebPushEndpoints", {
            endpoint: endpoint,
            p256dh: p256dh,
            auth: auth
        })
        .then(response => {
            console.log('Response:', response);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    static getNewestMessages(type,friendId, limit, lastSessionMessageId) {
        let checkKey = "chatLastUpdate";
        localforage.getItem(checkKey).then(async timestamp => {
            if (!timestamp) {
                timestamp = 0;
            }
            
            const requestData = Qs.stringify({
                "userId": friendId, 
                "timestamp": timestamp,
                "limit":limit,
                "lastSessionMessageId":lastSessionMessageId
            });

            apiClient.post("/chat/getNewestMessages", requestData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(async (response) => {
                // All the commented code remains the same
                //MessageUtil.updateMessage(response)

                // if (!response) {
                //     return
                // }
                // if (!response.data) {
                //     console.log("error")
                //     return
                // }

                // if (response.data.code !== 1) {
                //     console.log("logic error")
                //     return
                // }
                // const messages = JSON.parse(response.data.message)
                // let records_map = {}

                // //dispatch messages to their sender in a map. 
                // let maxTimestamp = timestamp
                // for (let i = 0; i < messages.length; i++) {
                //     let userId = messages[i].userId;
                //     if (records_map[userId]) {
                //         records_map[userId].push(messages[i])
                //     } else {
                //         records_map[userId] = [messages[i]]
                //     }
                //     maxTimestamp = Math.max(messages[i].sendTime, maxTimestamp)
                // }
                // await localforage.setItem(checkKey, maxTimestamp)

                // //write to the database
                // for (let key in records_map) {
                //     let value = records_map[key]
                //     let result = await localforage.getItem(key + "_records")
                //     if (!result) {
                //         result = { count: value.size, chats: value }
                //     }
                //     else {
                //         result.count++
                //         result.chats = [result.chats, ...value]
                //     }
                //     await localforage.setItem("send_from_" + friendId, result.chats)
                // }

                // get chat record contacts lists
                // await localforage.getItem("contactCursor").then((userId) => {
                //     if (!userId) {
                //         localforage.getItem("contactRecordList").then((result) => {

                //         })
                //         return
                //     }
                //     localforage.getItem("contactRecordList").catch(() => {
                //     }).then(async (result) => {
                //         if (!result) {
                //             return
                //         }
                //         let contains = -1
                //         for (let i = 0; i < result.length; i++) {
                //             if (result[i].userId === userId) {
                //                 contains = i;
                //             }
                //         }
                //         // contactDetails
                //         // contactRecordList [{userId:userId, avatar:avatar, userName}, xxx, xxx]
                //         let detail = await localforage.getItem(userId + "_detail")
                //         if (contains === -1) {//query from localforage and set information
                //             if (!detail) {
                //                 console.log("he is not your friend!!!!")
                //                 return
                //             }
                //             result = [...result, { userName: detail.userName, avatar: detail.avatar, userId: detail.userId }]
                //             localforage.setItem("contactRecordList", result)
                //         }
                //         else {
                //             result = [...result, { userName: detail.userName, avatar: detail.avatar, userId: detail.userId }]
                //             localforage.setItem("contactRecordList", result)
                //         }
                //     }
                //     )
                // })
            }).then(() => {
                //setSelect(friendId)
            });
        });
    }

    static sendMessage(userId, sendTo, content, messageType) {
        let data = { userId: userId, content: content, messageType: messageType };
        console.log(sendTo);
        
        if (sendTo.type === "single") {
            data.receiverId = sendTo.userId;
            data.type = "single";
        }
        else if (sendTo.type === "group") {
            data.groupId = sendTo.userId;
            data.type = "group";
        }
        else {
            return;
        }
        
        console.log(data);
        return apiClient.post("/chat/sendMessage", Qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    // this is used for show friend details.
    static requestUserInfo(userId, setDetails) {
        //get information from search/ friend list.
        const requestData = Qs.stringify({
            token: localStorage.getItem("token"), 
            userIdToFollow: userId
        });

        apiClient.post("/friends/getUserIntro", requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).catch(error => {
            console.log(error);
        }).then(function (response) {
            if (!response) {
                console.log("error");
                return;
            }
            let responseData = response.data;
            if (responseData.code === -1) {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
                return;
            }
            else if (responseData.code === 1) {
                console.log(JSON.parse(responseData.message));
                //MessageUtil.setUserIntro(JSON.parse(responseData.message), dispatch)
                setDetails({ ...JSON.parse(responseData.message) });
                // localforage.setItem("userIntro", JSON.parse(responseData.message)).then(() => {
                //     navigator("/friendInfomation",{state:{position:"mid"}})
                // })
            }
            else {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            //setNetworkErr(false)
        });
    }

    static markAsRead(type, userId ) {
        return apiClient.post("/chat/markUnread", {type: type, senderId: userId})
    }

    static getUnreadMessages(){
        return apiClient.post("/chat/getUnreadFromAllUsers")
    }
}