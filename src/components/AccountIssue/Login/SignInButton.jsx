import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import { Box, Button } from '@mui/material';
import { Google } from '@mui/icons-material';

import { login } from "../../redux/authSlice";
import store from "../../redux/store";
import AuthUtil from '../../../util/io_utils/AuthUtil';
import { useNotification } from '../../../Providers/NotificationProvider';
import localforage from 'localforage';
import { useThemeMode } from '../../../Themes/ThemeContext';

const SignInButton = () => {
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();

  const handleGoogleSuccess = (credentialResponse) => {
    AccountUtil.googleLogin({ idToken: credentialResponse.credential }).then((res) => {
      if (res.data.code === 0) {
        const content = JSON.parse(res.data.message);
        localStorage.setItem("userInfo", res.data.message);
        showNotification("Login successful!", "success");
        localStorage.setItem("token", content.tokenString);
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userId', content.userId);
        
        AuthUtil.getPaths().then((response1) => {
          if (response1.data.code === 0) {
            localforage.setItem("paths", JSON.parse(response1.data.message)).then(() => {
              setTimeout(() => {
                store.dispatch(login({
                  user: content.userId,
                  token: content.tokenString
                }));
              }, 500);
            });
          }
        });
      }
    });
  };

  const handleGoogleError = () => {
    console.log('Google login failed');
    showNotification("Google login failed", "error");
  };

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      mb: 2 
    }}>
      {/* 方案1: 使用GoogleLogin组件并添加容器样式 */}
      {/* <Box sx={{
        width: '100%',
        '& > div': {
          width: '100% !important',
          justifyContent: 'center !important'
        },
        '& button': {
          width: '100% !important',
          justifyContent: 'center !important',
          minHeight: '48px !important'
        }
      }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />
      </Box> */}

      {/* 方案2: 如果上面不行，可以使用自定义按钮 */}
      
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        render={({ onClick, disabled }) => (
          <Button
            onClick={onClick}
            disabled={disabled}
            variant="outlined"
            fullWidth
            startIcon={<Google />}
            sx={{
              py: 1.5,
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : '#dadce0',
              color: mode === 'dark' ? '#ffffff' : '#3c4043',
              '&:hover': {
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#dadce0',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa'
              }
            }}
          >
            Sign in with Google
          </Button>
        )}
      />
     
    </Box>
  );
};

export default SignInButton;