import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import AccountUtil from '../../../util/io_utils/AccountUtil';

import { login } from "../../redux/authSlice"; // Adjust path to your auth actions
import store from "../../redux/store"; // Adjust path to your Redux store
import AuthUtil from '../../../util/io_utils/AuthUtil';
import { useNotification } from '../../../Providers/NotificationProvider';
import localforage from 'localforage';

const SignInButton = () => {
  const {showNotification} = useNotification()
    return (
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          //const decoded = jwtDecode(credentialResponse.credential || '');
          // console.log('登录成功，用户信息:', decoded);
          // TODO: 发送 token 给你的后端进行身份验证
          AccountUtil.googleLogin({idToken:credentialResponse.credential}).then((res)=>{
            if (res.data.code === 0) {
              const content = JSON.parse(res.data.message)
            localStorage.setItem("userInfo", res.data.message);
            showNotification("Login successful!", "success")
            localStorage.setItem("token",content.tokenString);
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('userId',content.userId);
            AuthUtil.getPaths().then(
              (response1) => {
                if (response1.data.code === 0) {
                  localforage.setItem("paths", JSON.parse(response1.data.message)).then(  
                    () => {
 
                      setTimeout(() => {
                        store.dispatch(login({
                          user: content.userId,
                          token: content.tokenString
                        }));
                        
                      }, 500);
                    }
                  )
                }
              }
            )
            } else {

            }
          })
        }}
        onError={() => {
          console.log('登录失败');
        }}
      />
    );
  };
  

export default SignInButton;