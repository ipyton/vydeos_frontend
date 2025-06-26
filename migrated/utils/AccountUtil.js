import Qs from 'qs'
import localforage from "localforage"
import { API_URL } from "./URL"

// Dynamic imports for browser-only dependencies
let EncryptionUtil = null;
let apiClient = null;
let publicClient = null;

// Initialize browser-only dependencies
if (typeof window !== 'undefined') {
  // Only import these on the client side
  import("./EncryptionUtil").then(module => {
    EncryptionUtil = module.default;
  });
  
  import("./ApiClient").then(module => {
    apiClient = module.default;
    publicClient = module.publicClient;
  });
}

export default class AccountUtil {
  static async ensureDependencies() {
    // Make sure dependencies are loaded before proceeding
    if (typeof window !== 'undefined' && !apiClient) {
      const apiClientModule = await import("./ApiClient");
      apiClient = apiClientModule.default;
      publicClient = apiClientModule.publicClient;
    }
    
    if (typeof window !== 'undefined' && !EncryptionUtil) {
      const encryptionModule = await import("./EncryptionUtil");
      EncryptionUtil = encryptionModule.default;
    }
  }

  static async getLanguages(setLanguages) {
    await this.ensureDependencies();
    
    try {
      const response = await apiClient({
        url: "/i18n/getLanguages",
        method: 'get',
      });
      
      if (!response || !response.data) {
        return;
      }
      
      if (response.data.code === -1) {
        return;
      }
      
      let content = response.data;
      setLanguages(content);
      return response;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async login(data) {
    await this.ensureDependencies();
    
    try {
      const email = data.get('email');
      const password = data.get('password');
      const remember = data.get('remember');
      
      return await publicClient({
        url: "/account/login",
        method: 'post',
        data: { 
          email: email, 
          password: EncryptionUtil.encryption(password), 
          remember: remember 
        },
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async registerStep1(userId) {
    await this.ensureDependencies();
    
    try {
      return await publicClient({
        url: "/account/registerStep1",
        method: 'post',
        data: { userId: userId },
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
      });
    } catch (error) {
      console.error('Registration step 1 error:', error);
      throw error;
    }
  }

  static async resetStep1(userId) {
    await this.ensureDependencies();
    
    try {
      return await publicClient({
        url: "/account/registerStep1",
        method: 'post',
        data: { userId: userId },
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
      });
    } catch (error) {
      console.error('Reset step 1 error:', error);
      throw error;
    }
  }

  static async sendVerificationCode(email) {
    await this.ensureDependencies();
    
    try {
      return await publicClient({
        url: "/account/sendVerificationCode",
        method: 'post',
        data: { userId: email },
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
      });
    } catch (error) {
      console.error('Verification code error:', error);
      throw error;
    }
  }

  static async registerStep2(email, code) {
    await this.ensureDependencies();
    
    try {
      return await publicClient({
        url: "/account/registerStep2",
        method: 'post',
        data: { userId: email, code: code },
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
      });
    } catch (error) {
      console.error('Registration step 2 error:', error);
      throw error;
    }
  }

  static async registerStep3(userId, password, token) {
    await this.ensureDependencies();
    
    try {
      return await publicClient({
        url: "/account/registerStep3",
        method: 'post',
        data: { 
          password: EncryptionUtil.encryption(password), 
          token: token, 
          userId: userId 
        },
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
      });
    } catch (error) {
      console.error('Registration step 3 error:', error);
      throw error;
    }
  }

  static async uploadAvatar(data) {
    await this.ensureDependencies();
    
    try {
      const response = await apiClient({
        url: "/account/uploadAvatar",
        method: 'post',
        data: { avatar: data },
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      const responseData = response.data;
      return responseData.code === 0;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  }

  static async getOwnerInfo(userInfo, setUserInfo) {
    await this.ensureDependencies();
    
    if (typeof window === 'undefined') {
      // Return default user info during SSR
      return {
        data: {
          code: -1,
          message: JSON.stringify(userInfo)
        }
      };
    }
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      return await apiClient({
        url: "/account/getinfo",
        method: 'post',
        data: { userId: userId },
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
      });
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  }

  static async updateUserInfo(introduction, nickName, location, pictures, birthdate, gender, language, country) {
    await this.ensureDependencies();
    
    if (!pictures) pictures = [];
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      return await apiClient({
        url: "/account/setinfo",
        method: 'post',
        data: {
          userId: userId,
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
          return Qs.stringify(data);
        }],
      });
    } catch (error) {
      console.error('Update user info error:', error);
      throw error;
    }
  }

  static async getAvatar(avatar, setAvatar) {
    await this.ensureDependencies();
    
    try {
      const response = await apiClient({
        url: "/account/getAvatar",
        method: 'get',
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
      });
      
      setAvatar(response.data);
      return response;
    } catch (error) {
      console.error('Error fetching avatar:', error);
      throw error;
    }
  }

  static async googleLogin(params) {
    await this.ensureDependencies();
    
    try {
      return await apiClient.post("/account/google", params);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
  
  // Helper method for authentication checks
  static async isAuthenticated() {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      return !!(token && userId);
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }
} 