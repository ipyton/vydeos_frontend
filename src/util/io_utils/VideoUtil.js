import Qs from qs

export default class VideoUtil{

    static getVideoInformation(movie_id,navigate) {
        axios({
            url: "http://localhost:5000" + "/movie/get_meta",
            method: 'post',
            data: { detail_address: movie_id },
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
            let responseData = response.data
            if (responseData.code === -1) {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            else if (responseData.code === 1) {
                if (responseData.result !== null) {
                }
            }
            else {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
        })
    }
}