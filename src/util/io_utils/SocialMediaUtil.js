import { useDispatch, useSelector } from "react-redux"
import { UseDispatch } from "react-redux"
import { updateFollowState } from "../../components/redux/UserDetails"
export default class SocialMediaUtil {

    static getUrlBase(){
        return "localhost:8080"
    }
    dispath = useDispatch()


    static follow(sender, receiver, setFollowState) {
        axios(
            {
                url: SocialMediaUtil.getUrlBase() + "/follow",
                method: "post",
                data: { token: localStorage.getItem("token"), sender:sender, receiver:receiver},
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
            setFollowState=true
        }).catch(error => {
            console.log("get message by Id error")
        }).then(() => {
            console.log("success!")
        })
    }

    static getFollowState(sender,receiver, setFollowState) {
        axios({
            url: SocialMediaUtil.getUrlBase() + "/getFollowState",
            method: "post",
            data: { token: localStorage.getItem("token"), sender: sender, receiver: receiver },
            transformRequest: [function (data) {
                return qs.stringify(data)
            }],
            //synchronous: true,
            header: {
                tokenL: localStorage.getItem("token"),
            }

        }).catch(()=>{
            console.log("follow error")
        }).then((response)=> {
            this.dispath(updateFollowState(response.data))
            // write to storage.
        }).catch(()=>{

        })
    }
}