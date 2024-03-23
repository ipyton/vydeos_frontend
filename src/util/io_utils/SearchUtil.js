import Qs from 'qs'
import axios  from "axios"
import {add,clear, batchAdd} from "../../components/redux/searchResult"
import { UseDispatch, useDispatch } from 'react-redux';

export default class SearchUtil {
    static getBaseUrl() {
        return "http://localhost:8000";
    }


    static stateSetter(list, dispatch) {
      console.log("89012q8")
      console.log(list)
      setInterval(function(){
        dispatch(batchAdd(list))
      }, 1000)

    }


    static mockSearch(dispatch) {
      let list = [{name:"james",avatar:"siehru", intro:"sus", type:"contact"}, {name:"time",avatar:"zdxf", intro:"sfs", type:"video"}]
      this.stateSetter(list, dispatch)
    }

    static searchChatContent(keyword, setSearchResults, setPagingStatus, pagingStatus) {
        axios({
            url: SearchUtil.getBaseUrl() + "/search/chatContent", 
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
                console.log("did not get message")
            }
            if (response.data === undefined) {
                console.log("did not get meesage") 
            }
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
    
    static searchContactsById(keyword, setSearchResults) {
        axios({
            url:SearchUtil.getBaseUrl() + "/search/contacts", 
            method:'post',
            data:{token:localStorage.getItem("token"), userId: keyword},
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


    static searchArticles(keyword) {

    }

}