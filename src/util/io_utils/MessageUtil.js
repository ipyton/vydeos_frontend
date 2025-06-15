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
    
    static getMessageRecords(type,friendId, limit, lastSessionMessageId, groupId) {
        if (!groupId) {
            groupId = 0
        }
        const requestData = Qs.stringify({
            "userId": friendId, 
            "limit":limit,
            "lastSessionMessageId":lastSessionMessageId,
            "type":type,
            "groupId": groupId
        });

        return apiClient.post("/chat/getMessageRecords", requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }

    static createGroup(name, introduction, memberIds, allowInvitesByToken ) {
        let data = {name, introduction,memberIds,allowInvitesByToken}
        return apiClient.post("/group_chat/create", Qs.stringify(data, { arrayFormat: 'repeat' }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

    }

    static getGroups() {
        return apiClient.get("/group_chat/get_groups")
    }

    static getMemebers(groupId) {
        return apiClient.get("/group_chat/get_members",{groupId})
    }

    static sendMessage(userId, sendTo, content, messageType) {
        let data = { userId: userId, content: content, messageType: messageType };
        console.log(sendTo);
        
        if (sendTo.type === "single") {
            data.receiverId = sendTo.userId;
            data.type = "single";
            console.log(data);
            return apiClient.post("/chat/sendMessage", Qs.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }
        else if (sendTo.type === "group") {
            data.groupId = sendTo.groupId;
            data.type = "group";
            return apiClient.post("/group_chat/sendMessage", Qs.stringify(data), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
            });

        }
        else {
            return;
        }
        

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

    static markAsRead(type, userId,groupId ) {
        return apiClient.post("/chat/markUnread", {type: type, senderId: userId, groupId})
    }

    static getUnreadMessages(){
        return apiClient.post("/chat/getUnreadFromAllUsers")
    }

    static async getFriends() {
        return apiClient.post("/friends/get_friends")
    }

    static async getFollowers() {
        return apiClient.post("/friends/get_followers")
    }

    static async getIdols(){
        return apiClient.post("/friends/get_idols")
    }
    static async getGroupDetails(groupId) {
        return apiClient.get("/group_chat/getDetails?groupId="  + groupId)

    }
    static async updateGroupDetails(groupId,name,description) {
        return apiClient.post("/group_chat/updateDetails", Qs.stringify({name, description,groupId}), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }
}