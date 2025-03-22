import axios from "axios"
import Qs from 'qs'
import EncryptionUtil from "./EncryptionUtil"

import { update } from "../../components/redux/UserDetails"
import { useDispatch } from "react-redux"
import localforage from "localforage"
import { BiSolidCommentDetail } from "react-icons/bi"

export default class AccountUtil {

  static getUrlBase() {
    return "http://localhost:8080"
  }

  dispatch = useDispatch()

  static getLanguages(setLanguages) {
    axios({
      url: AccountUtil.getUrlBase() + "/i18n/getLanguages",
      method: 'get',
      headers: {
        token: localStorage.getItem("token"),
      }
    }).catch(err => {
      console.log(err)
    }).then(response => {
      if (!response || !response.data) {
        return
      }
      if (response.data.code === -1) {
        console.log(response.data.message)
        return
      }
      let content = response.data
      console.log(content)
      // localforage.setItem();
      setLanguages(content)
    })
  }


  static verifyTokens(setState) {
    if (localStorage.getItem("token") === null) {
      return
    }
    axios({
      url: AccountUtil.getUrlBase() + "/account/verifyToken",
      method: 'post',
      data: { token: localStorage.getItem("token") },
      headers: {
        token: localStorage.getItem("token"),
      }
    }).catch(err => {
      console.log(err)
    }).then(
      async response => {
        if (response === undefined || response.data === undefined) {
          console.log("login error")
          return
        }
        let responseData = response.data
        await localforage.setItem("userId", response.data.message)
        setState(responseData.code === 1)
        console.log(responseData.code === 1)
      }
    )

  }

  static login(data, setLogin) {
    axios({
      url: AccountUtil.getUrlBase() + "/account/login",
      method: 'post',
      data: { email: data.get('email'), password: EncryptionUtil.encryption(data.get('password')), remember: data.get("remember") },
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }],

    }).catch(error => {
      if ("Network Error" === error.message) {
        //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
        // setNetworkErr(true)
        console.log("error")
      }
    }).then(function (response) {
      console.log(response)
      if (response === undefined || response.data === undefined) {
        console.log("errror")
        return
      }
      let responseData = response.data
      if (responseData.code === -1) {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
      else if (responseData.code === 1) {
        localStorage.setItem("token", responseData.message)
        localStorage.setItem("userId", data.get("email"))
        localforage.setItem("userId", data.get("email")).then(
          setLogin(true)
        )

      }
      else {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
      //setNetworkErr(false)
    })
  }

  // static requestUserInfo(userId) {
  //   console.log("token" + localStorage.getItem("token"))
  //   axios({
  //     url: AccountUtil.getUrlBase() + "/account/userIntro",
  //     method: 'post',
  //     data: { token: localStorage.getItem("token"), userIdTofollow:userId},
  //     transformRequest: [function (data) {
  //       // 对 data 进行任意转换处理
  //       return Qs.stringify(data)
  //     }], headers: {
  //       token: localStorage.getItem("token"),
  //     }
  //   }).catch(error => {
  //     if ("Network Error" === error.message) {
  //       //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
  //       // setNetworkErr(true)
  //       console.log("error")
  //     }
  //   }).then(function (response) {
  //     if (response === undefined || response.data === undefined) {
  //       console.log("errror")
  //     }
  //     let responseData = response.data
  //     if (responseData.code === -1) {
  //       //props.setBarState({...props.barState, message:responseData.message, open:true})
  //     }
  //     else if (responseData.code === 1) {

  //     }
  //     else {
  //       //props.setBarState({...props.barState, message:responseData.message, open:true})
  //     }
  //     //setNetworkErr(false)
  //   })
  // }



  static registerStep1(activeStep, setStep, userId) {
    axios({
      url: AccountUtil.getUrlBase() + "/account/registerStep1",
      method: 'post',
      data: { userId: userId },
      transformRequest: [function (data) {
        // transform data -> json
        return Qs.stringify(data)
      }],
    }).catch((err) => {
      console.log(err)
      return
    }).then(
      (response) => {
        console.log(response);
        if ((response != null && response !== undefined) && response.data != null && response.data !== undefined && response.data.code === 1) {
          setStep(activeStep + 1)
        }
        else {
          console.log("Please check your input")
        }
      }
    )

  }

  static registerStep2(activeStep, setStep, code) {
    setStep(activeStep + 1)
  }

  static registerStep3(activeStep, setStep, password, token,barState, setBarState) {
    axios({
      url: AccountUtil.getUrlBase() + "/account/registerStep3",
      method: 'post',
      data: { password: EncryptionUtil.encryption(password), userId: token },
      transformRequest: [function (data) {
        // transform data -> json
        return Qs.stringify(data)
      }],
    }).catch((err) => {
      console.log("Connection error")
      return
    }).then(
      (response) => {
        console.log(response)
        if ((response != null && response !== undefined) && response.data != null && response.data !== undefined && response.data.code === 1) {
          setStep(activeStep + 1)
        }
        else {
          console.log("Please check your input")
          console.log(response.data.message)
          setBarState({ ...barState, open: true, message:response.data.message})

        }
      }
    )

  }

  static uploadAvatar(data) {
    async function upload() {
      let response = await axios({
        url: "http://localhost:8080/account/uploadAvatar",
        method: 'post',
        data: { avatar: data },
        headers: {
          token: localStorage.getItem("token"),
          'Content-Type': 'multipart/form-data',
        }
      })
      let responseData = response.data
      return responseData.code === 1
    }
    return upload()
  }

  // This is about get userInfo
  static getOwnerInfo(userinfo, setUserInfo) {

    localforage.getItem("userId").then(res => {
      console.log(res)
      axios({
        url: AccountUtil.getUrlBase() + "/account/getinfo",
        method: 'post',
        data: { userId: res },
        transformRequest: [function (data) {
          return Qs.stringify(data)
        }],
        headers: {
          token: localStorage.getItem("token"),
        }
      }).catch(err => {
        console.log(err)
      }).then(response => {
        if (!response || !response.data) {
          return
        }
        if (response.data.code === -1) {
          console.log(response.data.message)
          return
        }
        let content = response.data.message
        let decoded = JSON.parse(content)
        // localforage.setItem();
        setUserInfo(decoded)
        console.log(decoded)
      })
    })


  }

  static updateUserInfo(introduction, nickName, location, pictures, birthdate, gender) {
    if (!pictures) pictures = []
    console.log({
      introduction: introduction,
      userName: nickName,
      location: location,
      pictures: pictures,
      dateOfBirth: birthdate,
      gender: gender
    })
    localforage.getItem("userId").then(res => {
      axios({
        url: AccountUtil.getUrlBase() + "/account/setinfo",
        method: 'post',
        data: {
          userId: res,
          introduction: introduction,
          userName: nickName,
          location: location,
          pictures: pictures,
          dateOfBirth: birthdate,
          gender: gender
        },
        transformRequest: [function (data) {
          return Qs.stringify(data)
        }],
        headers: {
          token: localStorage.getItem("token"),
        }
      }).catch(err => {

      }).then(response => {
        console.log(response)
      })
    })
  }
  static async getAvatar(avatar, setAvatar) {
    try {
      axios({
        url: AccountUtil.getUrlBase() + "/account/getAvatar",
        method: 'get',
        transformRequest: [function (data) {
          return Qs.stringify(data)
        }],
        headers: {
          token: localStorage.getItem("token"),
        }
      }).catch(err => {

      }).then(response => {
        console.log(response)
        setAvatar(response.data)
      })

    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  }


  static registerValidate() {

  }

  static registerOptionalData() {

  }

  static forget() {

  }

}