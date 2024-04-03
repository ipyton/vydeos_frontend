import axios from "axios"
import Qs from 'qs'
import EncryptionUtil from "./EncryptionUtil"

import { update } from "../../components/redux/UserDetails"
import { useDispatch } from "react-redux"

export default class AccountUtil {

  static getUrlBase() {
    return "http://localhost:8000"
  }

  dispatch = useDispatch()

  static verifyTokens(setState) {
    if (localStorage.getItem("token") === null) {
      return
    }
    axios({
      url: AccountUtil.getUrlBase() + "/account/verifyToken",
      method: 'post',
      data: { token: localStorage.getItem("token") },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
      sychronous: true,
      headers: {
        token: localStorage.getItem("token"),
      }
    }).catch(err => {
      console.log("error")
    }).then(
      response => {
        console.log(response)
        if (response === undefined || response.data === undefined) {
          console.log("login error")
          return
        }

        let responseData = response.data
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
        localStorage.setItem("email", data.get("email"))
        setLogin(true)
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
      console.log("Connection error")
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

  static registerStep3(activeStep, setStep, password, token) {
    axios({
      url: AccountUtil.getUrlBase() + "/account/registerStep3",
      method: 'post',
      data: { password: EncryptionUtil.encryption(password), userId:token },
      transformRequest: [function (data) {
        // transform data -> json
        return Qs.stringify(data)
      }],
    }).catch((err) => {
      console.log("Connection error")
      return
    }).then(
      (response) => {
        if ((response != null && response !== undefined) && response.data != null && response.data !== undefined && response.data.code === 1) {
          setStep(activeStep + 1)
        }
        else {
          console.log("Please check your input")
        }
      }
    )

  }


  static registerValidate() {

  }

  static registerOptionalData() {

  }

  static forget() {

  }

}