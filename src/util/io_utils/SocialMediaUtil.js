import { useDispatch, useSelector } from "react-redux"
import { UseDispatch } from "react-redux"
import { updateFollowState } from "../../components/redux/UserDetails"
import qs from 'qs'
import axios from "axios"
import localforage from "localforage"
import { SettingsSystemDaydreamTwoTone } from "@mui/icons-material"
import {DOWNLOAD_BASE_URL, API_BASE_URL} from "./URL";
export default class SocialMediaUtil {




    static follow(sender, receiver, details, setDetails) {
        return axios(
            {
                url: API_BASE_URL + "/friends/follow",
                method: "post",
                data: { "sender": sender, "receiver": receiver },
                transformRequest: [function (data) {
                    return qs.stringify(data)
                }],
                //synchronous: true,
                headers: {
                    "token": localStorage.getItem("token"),
                }
            }
        ).then(response => {
            if (response.data.code === 0) {
                // localforage.getItem("userIntro").then((res) => {
                //     //res is a userIntro
                //     res.relationship = res.relationship % 10 + 10
                //     details.relationship = res.relationship % 10 + 10
                //     localforage.setItem("userIntro", res)
                    details.relationship = details.relationship % 10 + 10
                    setDetails({ ...details })
                //     if (details.relationship !== 11) return
                //     localforage.getItem("friendList").then(async res => {
                //         if (!res) res = {}
                //         res[details.userId] = { userId: details.userId, name: details.name, avatar: details.avatar }
                //         await localforage.setItem("friendList", res)
                //     })
                // })
            }
            else {
                console.log("state set error!!!")
            }
        }).catch(error => {
            console.log("get message by Id error")
        }).then(() => {
            console.log("success!")
        })
    }

    static unfollow(sender, receiver, details, setDetails) {
        return axios(
            {
                url: DOWNLOAD_BASE_URL + "/friends/unfollow",
                method: "post",
                data: { sender: sender, receiver: receiver, },
                transformRequest: [function (data) {
                    return qs.stringify(data)
                }],
                //synchronous: true,
                headers: {
                    token: localStorage.getItem("token"),

                }
            }
        ).catch(error => {
            console.log(error)
        }).then(response => {
            if (response.data.code === 0) {
                // localforage.getItem("userIntro").then((res) => {
                //     res.relationship = res.relationship % 10
                    details.relationship = details.relationship % 10
                //     localforage.setItem("userIntro", res)
                     setDetails({ ...details })
                //     if (details.relationship === 11) return
                //     localforage.getItem("friendList").then(async res => {
                //         if (!res) res = {}
                //         res[details.userId] = null
                //         await localforage.setItem("friendList", res)
                //     })
                // })
            }
            else {
                console.log("state set error!!!")
            }
        }).then(() => {
            console.log("success!")
        })


    }


    static getFollowState(sender, receiver, setDetails) {
        return axios({
            url: API_BASE_URL + "/friends/getFollowState",
            method: "post",
            data: { "sender": sender, "receiver": receiver },
            transformRequest: [function (data) {
                return qs.stringify(data)
            }],
            //synchronous: true,
            headers: {
                "token": localStorage.getItem("token"),
            }
        }).catch(() => {
            console.log("follow error")
        }).then((response) => {
            console.log(response.data)
            this.dispath(updateFollowState(response.data))
            // write to storage.
        }).catch(() => {

        })
    }


    static getRelationships(idx) {
    let requestName = null;
    let domain = "/friends/";
    
    if (0 === idx) {
        // get friends
        requestName = "get_friends";
    } else if (1 === idx) {
        // get I follow
        requestName = "get_idols";
    } else if (2 === idx) {
        // get followers
        requestName = "get_followers";
    } else if (3 === idx) {
        // get current group
        requestName = "get_groups";
        domain = "/group_chat/";
    } else if (4 === idx) {
        // get invitations
        requestName = "get_invitations";
    } else if (5 === idx) {
        requestName = "get_black_list";
    }
    
    return axios({
        url: API_BASE_URL + domain + requestName,
        method: "get",
        data: {},
        transformRequest: [function (data) {
        return qs.stringify(data);
        }],
        headers: {
        "token": localStorage.getItem("token"),
        }
    }).then((response) => {
        console.log(response);
        if (!response || !response.data) {
        console.log("Internal Error");
        throw new Error("Internal Error");
        }
        
        if (response.data && response.data.code === -1) {
        throw new Error(response.data.message || "Error with code -1");
        }
        
        try {
        const list = JSON.parse(response.data.message);
        console.log(list);
        return list;
        } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
        }
    });
    }
}