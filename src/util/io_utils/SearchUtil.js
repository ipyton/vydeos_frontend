import Qs from 'qs'
import { add, clear, batchAdd } from "../../components/redux/searchResult"
import { Language } from '@mui/icons-material';
import { apiClient, flaskClient } from "./ApiClient";

export default class SearchUtil {

  static stateSetter(list, dispatch) {
    dispatch(clear())
    dispatch(batchAdd(list))
  }

  static mockSearch(dispatch) {
    let list = [{ name: "james", pics: "siehru", intro: "sus", type: "contact" }, { name: "time", pics: "zdxf", intro: "sfs", type: "movie" }]
    this.stateSetter(list, dispatch)
  }

  static searchChatContactById(keyword, setList) {
    return flaskClient({
      url: "/search/contactById",
      method: 'post',
      data: { userId: keyword },
      transformRequest: [function (data) {
        console.log(Qs.stringify(data))
        return Qs.stringify(data)
      }],
    }).catch(error => {
      if ("Network Error" === error.message) {
        console.log(error)
      }
    }).then(function (response) {
      if (response === undefined) {
        console.log("did not get message")
        return
      }
      if (response.data === undefined) {
        console.log("did not get meesage")
        return
      }
      let responseData = response.data
      if (responseData.code === -1) {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
      else if (responseData.code === 0) {
        let result = JSON.parse(responseData.message)
        console.log(result)
        let adder = []
        result.forEach(element => {
          adder.push({ name: element.userName, intro: element.introduction, pic: element.avatar, type: "contact", userId: element.userId, })
        });
        setList(adder)
      }
      else {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
    })
  }

  static searchContactByName(keyword, setSearchResults, pagingStatus, setPagingStatus) {
    return apiClient({
      url: "/search/contacts",
      method: 'post',
      data: { userId: keyword },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    }).catch(error => {
      if ("Network Error" === error.message) {
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
      else if (responseData.code === 0) {
        if (responseData.result !== null) {
          setSearchResults(responseData.result)
        }
      }
      else {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
    })
  }

  static searchVideos(keyword, setList) {
    setList([])
    
    let userInfo = localStorage.getItem("userInfo")
    let language = null
    if (userInfo === null) { 
      language = "en-US"
    }
    language = JSON.parse(userInfo).language
    console.log(language)
    return flaskClient({
      url: "/movie/search",
      method: 'get',
      params: { "keyword": keyword, page_number:1, "Accept-Language": language},
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    }).then(function (response) {
      console.log(response)
      if (response === undefined) {
        console.log("errror")
      }
      setList(response.data)
    })
  }

  static searchPosts(keyword, setList) {
    return new Promise((resolve, reject) => {
      setList([{type:"posttesttest"}])
    });
  }

  static getSuggestions(keyword, setList) {
    return new Promise((resolve, reject) => {
      setList([{ type: "testtest" }])
    });
  }

  static searchMusics(keyword, setList) {
    return new Promise((resolve, reject) => {
      setList([{ type: "musictesttest" }]) 
    });
  }
  
  static searchLocalResult(keyword, setList) {
    return new Promise((resolve, reject) => {
      setList([{ type: "chatrecord testtest" }])
    });
  } 
}