import Qs from 'qs'
import EncryptionUtil from "./EncryptionUtil"
import { update } from "../../components/redux/UserDetails"
import { useDispatch } from "react-redux"
import localforage from "localforage"
import apiClient, { publicClient } from "./ApiClient" // Import the API clients

export default class AccountUtil {

  dispatch = useDispatch()

  static getLanguages(setLanguages) {
    return apiClient({
      url: "/i18n/getLanguages",
      method: 'get',
    }).catch(err => {
      console.log(err)
    }).then(response => {
      if (!response || !response.data) {
        return
      }
      if (response.data.code === -1) {
        return
      }
      let content = response.data
      setLanguages(content)
    })
  }

  static login(data) {
    console.log(data.get("remember"))
    return publicClient({ // Use publicClient for login (no token needed)
      url: "/account/login",
      method: 'post',
      data: { 
        email: data.get('email'), 
        password: EncryptionUtil.encryption(data.get('password')), 
        remember: data.get("remember") 
      },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    })
  }

  static registerStep1(userId) {
    return publicClient({ // Use publicClient for registration (no token needed)
      url: "/account/registerStep1",
      method: 'post',
      data: { userId: userId },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    })
  }

  static resetStep1(userId) {
    return publicClient({ // Use publicClient for reset (no token needed)
      url: "/account/registerStep1",
      method: 'post',
      data: { userId: userId },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    })
  }

  static sendVerificationCode(email) {
    return publicClient({ // Use publicClient for verification (no token needed)
      url: "/account/sendVerificationCode",
      method: 'post',
      data: { userId: email},
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    })
  }

  static registerStep2(email, code) {
    return publicClient({ // Use publicClient for registration (no token needed)
      url: "/account/registerStep2",
      method: 'post',
      data: { userId: email, code: code },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    })
  }

  static registerStep3(userId, password, token) {
    return publicClient({ // Use publicClient for registration (no token needed)
      url: "/account/registerStep3",
      method: 'post',
      data: { 
        password: EncryptionUtil.encryption(password), 
        token: token, 
        userId: userId 
      },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    })
  }

  static uploadAvatar(data) {
    async function upload() {
      let response = await apiClient({
        url: "/account/uploadAvatar",
        method: 'post',
        data: { avatar: data },
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      let responseData = response.data
      return responseData.code === 0
    }
    return upload()
  }

  static getOwnerInfo() {
    return localforage.getItem("userId").then(res => {
      return apiClient({
        url: "/account/getinfo",
        method: 'post',
        data: { userId: res },
        transformRequest: [function (data) {
          return Qs.stringify(data)
        }],
      })
    })
  }

  static updateUserInfo(introduction, nickName, location, pictures, birthdate, gender, language, country) {
    if (!pictures) pictures = []

    
    return localforage.getItem("userId").then(res => {
      return apiClient({
        url: "/account/setinfo",
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
      }).catch(err => {
        // Error already handled by interceptor
        throw err; // Re-throw for caller to handle if needed
      }).then(response => {
        return response;
      })
    })
  }

  static async getAvatar(avatar, setAvatar) {
    try {
      const response = await apiClient({
        url: "/account/getAvatar",
        method: 'get',
        transformRequest: [function (data) {
          return Qs.stringify(data)
        }],
      });
      
      setAvatar(response.data)
      return response;
    } catch (error) {
      console.error('Error fetching avatar:', error);
      throw error; // Re-throw for caller to handle if needed
    }
  }

  static registerValidate() {
    // Implementation needed
  }

  static registerOptionalData() {
    // Implementation needed
  }

  static forget() {
    // Implementation needed
  }

  static googleLogin(params) {
    return apiClient.post("/account/google", params)
  }
}