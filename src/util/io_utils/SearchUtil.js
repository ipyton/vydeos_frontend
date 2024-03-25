import Qs from 'qs'
import axios  from "axios"
import {add,clear, batchAdd} from "../../components/redux/searchResult"

export default class SearchUtil {
    static getBaseUrl() {
        return "http://localhost:8000";
    }


    static stateSetter(list, dispatch) {
      dispatch(batchAdd(list))
  

    }

    static searchChatContactByName(keyword, setSearchResults, setPagingStatus, pagingStatus){
      
    }


    static mockSearch(dispatch) {
      let list = [{name:"james",pics:"siehru", intro:"sus", type:"contact"}, {name:"time",pics:"zdxf", intro:"sfs", type:"movie"}]
      this.stateSetter(list, dispatch)
    }

    static searchChatContactById(keyword, dispatch) {
        axios({
            url: SearchUtil.getBaseUrl() + "/search/contactById", 
            method:'post',
            data:{token:localStorage.getItem("token"), userId:keyword},
            transformRequest:[function (data) {
              // 对 data 进行任意转换处理
              console.log(Qs.stringify(data))
              return Qs.stringify(data)
          }],
        }).catch(error => {
          if ("Network Error" ===  error.message) {
            //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
            // setNetworkErr(true)
            console.log(error)
          }
        }).then(function(response) {
            if (response === undefined) {
                console.log("did not get message")
                return
            }
            if (response.data === undefined) {          
                console.log("did not get meesage") 
                return
            }
            let responseData = response.data
            console.log(responseData)
            if (responseData.code === -1) {
              //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            else if(responseData.code === 1) {
                //setSearchResults(responseData.result)
                // if (pagingStatus === null) {
                //     setPagingStatus(responseData.pagingStatus)
                // }
                console.log(responseData)
                let result = JSON.parse(responseData.message)
                let adder = []
                result.forEach(element => {
                  adder.push({name:element.userName, intro:element.introduction, pic:element.avatar, type:"contact"})
                });
                SearchUtil.stateSetter(adder, dispatch)
            }
            else {
              //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            //setNetworkErr(false)
          })
    }
    
    static searchContactByName(keyword, setSearchResults, pagingStatus, setPagingStatus) {
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


    static accumulativeSearch(keyword,setSearchResults) {

    }

}