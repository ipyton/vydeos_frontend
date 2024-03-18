import Qs from 'qs'
import axios  from "axios"

export default class SearchUtil {
    static getBaseUrl() {
        return "http://localhost:8000";
    }

    static searchChatContent(keyword, setSearchResults, setPagingStatus, pagingStatus) {
        axios({
            url: SearchUtil.getUrlBase() + "/search/chatContent", 
            method:'post',
            data:{token:localStorage.getItem("token"), keyword:keyword, pageStatus: pagingStatus===null?"":pagingStatus},
            transformRequest:[function (data) {
              // 对 data 进行任意转换处理
              return Qs.stringify(data)
          }],
        }).catch(error => {
          if ("Network Error" ===  error.message) {
            //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
            // setNetworkErr(true)
            console.log("error")
          }
        }).then(function(response) {
            if (response === undefined) {
                console.log("errror")
            }
            console.log(response)
            let responseData = response.data
            if (responseData.code === -1) {
              //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            else if(responseData.code === 1) {
                setSearchResults(responseData.result)
                if (pagingStatus === null) {
                    setPagingStatus(responseData.pagingStatus)
                }
            }
            else {
              //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            //setNetworkErr(false)
          })
    }
    
    static searchContacts(keyword, setSearchResults) {
        axios({
            url:SearchUtil.getUrlBase() + "/search/contacts", 
            method:'post',
            data:{token:localStorage.getItem("token"), keyword: keyword},
            transformRequest:[function (data) {
              // 对 data 进行任意转换处理
              return Qs.stringify(data)
          }],
        }).catch(error => {
          if ("Network Error" ===  error.message) {
            //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
            // setNetworkErr(true)
            console.log("error")
          }
        }).then(function(response) {
            if (response === undefined) {
                console.log("errror")
            }
            console.log(response)
            let responseData = response.data
            if (responseData.code === -1) {
              //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            else if(responseData.code === 1) {
                if (responseData.result !== null) {
                    setSearchResults(responseData.result)
                }
            }
            else {
              //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            //setNetworkErr(false)
          })
    }

    static searchVideos(keyword) {

    }
}