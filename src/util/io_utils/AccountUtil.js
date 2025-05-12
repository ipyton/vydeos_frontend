import axios from "axios"
import Qs from 'qs'
import EncryptionUtil from "./EncryptionUtil"

import { update } from "../../components/redux/UserDetails"
import { useDispatch } from "react-redux"
import localforage from "localforage"

import {API_BASE_URL, DOWNLOAD_BASE_URL} from "./URL";

export default class AccountUtil {



  dispatch = useDispatch()

  static getLanguages(setLanguages) {
    return axios({
      url: API_BASE_URL + "/i18n/getLanguages",
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
    return axios({
      url: API_BASE_URL+ "/account/verifyToken",
      method: 'post',
      data: { token: localStorage.getItem("token") },
      headers: {
        token: localStorage.getItem("token"),
      }
    })

  }

  static login(data) {
    console.log(data.get("remember") )
    return axios({
      url: API_BASE_URL+ "/account/login",
      method: 'post',
      data: { email: data.get('email'), password: EncryptionUtil.encryption(data.get('password')), remember: data.get("remember") },
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }],

    })
  }


  static  registerStep1( userId) {
    return axios({
      url: API_BASE_URL + "/account/registerStep1",
      method: 'post',
      data: { userId: userId },
      transformRequest: [function (data) {
        // transform data -> json
        return Qs.stringify(data)
      }],
    })

  }
  static resetStep1(userId) {
    return axios({
      url: API_BASE_URL + "/account/registerStep1",
      method: 'post',
      data: { userId: userId },
      transformRequest: [function (data) {
        // transform data -> json
        return Qs.stringify(data)
      }],
    })

  }


  static sendVerificationCode(email) {
    return axios({
      url: API_BASE_URL + "/account/sendVerificationCode",
      method: 'post',
      data: { userId: email},
      transformRequest: [function (data) {
        // transform data -> json
        return Qs.stringify(data)
      }],
    })
    }


  static registerStep2( email, code) {
    return axios({
      url: API_BASE_URL + "/account/registerStep2",
      method: 'post',
      data: { userId: email, code: code },
      transformRequest: [function (data) {
        // transform data -> json
        return Qs.stringify(data)
      }],
    })
  }

  static registerStep3(userId,password, token) {
   return axios({
      url: API_BASE_URL + "/account/registerStep3",
      method: 'post',
      data: { password: EncryptionUtil.encryption(password), token: token, userId: userId },
      transformRequest: [function (data) {
        // transform data -> json
        return Qs.stringify(data)
      }],
    })

  }

  static uploadAvatar(data) {
    async function upload() {
      let response = await axios({
        url: API_BASE_URL + "/account/uploadAvatar",
        method: 'post',
        data: { avatar: data },
        headers: {
          token: localStorage.getItem("token"),
          'Content-Type': 'multipart/form-data',
        }
      })
      let responseData = response.data
      return responseData.code === 0
    }
    return upload()
  }

  // This is about get userInfo
  static getOwnerInfo() {

    return localforage.getItem("userId").then(res => {
      return axios({
        url: API_BASE_URL + "/account/getinfo",
        method: 'post',
        data: { userId: res },
        transformRequest: [function (data) {
          return Qs.stringify(data)
        }],
        headers: {
          token: localStorage.getItem("token"),
        }
      })
    })


  }

  static updateUserInfo(introduction, nickName, location, pictures, birthdate, gender, language, country) {
    if (!pictures) pictures = []
    console.log({
      introduction: introduction,
      userName: nickName,
      location: location,
      pictures: pictures,
      dateOfBirth: birthdate,
      gender: gender,
      language: language,
      country: country
    })
    localforage.getItem("userId").then(res => {
      axios({
        url: API_BASE_URL + "/account/setinfo",
        method: 'post',
        data: {
          userId: res,
          introduction: introduction,
          userName: nickName,
          location: location,
          pictures: pictures,
          dateOfBirth: birthdate,
          gender: gender,
          language: language,
          country: country
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
        url: API_BASE_URL + "/account/getAvatar",
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