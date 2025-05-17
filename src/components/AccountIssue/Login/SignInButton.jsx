import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


const SignInButton = () => {
    return (
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const decoded = jwtDecode(credentialResponse.credential || '');
          console.log('登录成功，用户信息:', decoded);
          // TODO: 发送 token 给你的后端进行身份验证
        }}
        onError={() => {
          console.log('登录失败');
        }}
      />
    );
  };
  

export default SignInButton;