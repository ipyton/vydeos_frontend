import { useDispatch, useSelector } from "react-redux"
import { UseDispatch } from "react-redux"
import { updateFollowState } from "../../components/redux/UserDetails"
import qs from 'qs'
import localforage from "localforage"
import { SettingsSystemDaydreamTwoTone } from "@mui/icons-material"
import { apiClient, downloadClient } from "./ApiClient";
import MessageUtil from "./MessageUtil"
export default class SocialMediaUtil {

    static follow(sender, receiver, details, setDetails) {
        return apiClient({
            url: "/friends/follow",
            method: "post",
            data: { "sender": sender, "receiver": receiver },
            transformRequest: [function (data) {
                return qs.stringify(data)
            }],
        }).then(response => {
            if (response.data.code === 0) {
                details.relationship = details.relationship % 10 + 10
                setDetails({ ...details })
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
        return downloadClient({
            url: "/friends/unfollow",
            method: "post",
            data: { sender: sender, receiver: receiver, },
            transformRequest: [function (data) {
                return qs.stringify(data)
            }],
        }).catch(error => {
            console.log(error)
        }).then(response => {
            if (response.data.code === 0) {
                details.relationship = details.relationship % 10
                setDetails({ ...details })
            }
            else {
                console.log("state set error!!!")
            }
        }).then(() => {
            console.log("success!")
        })
    }

    static getFollowState(sender, receiver, setDetails) {
        return apiClient({
            url: "/friends/getFollowState",
            method: "post",
            data: { "sender": sender, "receiver": receiver },
            transformRequest: [function (data) {
                return qs.stringify(data)
            }],
        }).catch(() => {
            console.log("follow error")
        }).then((response) => {
            this.dispath(updateFollowState(response.data))
        }).catch(() => {

        })
    }

    static getRelationships(idx) {
        let requestName = null;
        let domain = "/friends/";
        
        if (0 === idx) {
            requestName = "get_friends";
            return MessageUtil.getFriends()
        } else if (1 === idx) {
            requestName = "get_idols";
            return MessageUtil.getIdols()
        } else if (2 === idx) {
            requestName = "get_followers";
            return MessageUtil.getFollowers()

        } else if (3 === idx) {
            requestName = "get";
            domain = "/group_chat/";
            return MessageUtil.getGroups()
        } else if (4 === idx) {
            requestName = "get_invitations";
        } else if (5 === idx) {
            requestName = "get_black_list";
        }
        
        
    
    }
}