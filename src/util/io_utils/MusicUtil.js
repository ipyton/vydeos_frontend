import Qs from 'qs'
import axios from "axios"

export default class MusicUtil {
    static getMusicInformation(movie_id, setState) {
        axios({
            url: "http://localhost:5000" + "/movie/get_meta",
            method: 'get',
            params: { detail_address: movie_id },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            if ("Network Error" === error.message) {
                //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
                // setNetworkErr(true)
                console.log("error")
            }
        }).then(function (response) {
            if (response === undefined) {
                console.log("errror")
            }
            console.log(response)
            //props.setBarState({...props.barState, message:responseData.message, open:true})
            let data = JSON.parse(response)
            data["type"] = "movie"
            setState(data)
        })
    }

}