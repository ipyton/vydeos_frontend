import { useDispatch, useSelector } from "react-redux"
import { UseDispatch } from "react-redux"
import { updateFollowState } from "../../components/redux/UserDetails"
import qs from 'qs'
import axios from "axios"
import localforage from "localforage"

export default class SocialMediaUtil {

    static getUrlBase() {
        return "http://localhost:8000"
    }
    dispath = useDispatch()


    static follow(sender, receiver, details, setDetails) {
        axios(
            {
                url: SocialMediaUtil.getUrlBase() + "/friends/follow",
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
        ).catch(error => {
            console.log(error)
        }).then(response => {
            if (response.data.code === 1) {
                localforage.getItem("userIntro").then((res) => {
                    res.relationship = res.relationship % 10 + 10
                    details.relationship = res.relationship % 10 + 10
                    localforage.setItem("userIntro", res)
                    setDetails(details)
                })
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
        axios(
            {
                url: SocialMediaUtil.getUrlBase() + "/friends/unfollow",
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
            if (response.data.code === 1) {
                localforage.getItem("userIntro").then((res) => {
                    res.relationship = res.relationship % 10
                    console.log(res.relationship)
                    details.relationship = res.relationship % 10
                    console.log(details)
                    localforage.setItem("userIntro", res)
                    setDetails(details)
                })
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


    static getFollowState(sender, receiver, setDetails) {
        axios({
            url: SocialMediaUtil.getUrlBase() + "/friends/getFollowState",
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
}