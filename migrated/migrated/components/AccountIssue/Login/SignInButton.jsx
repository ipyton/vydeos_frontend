import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Box, Button } from '@mui/material';
import { Google } from '@mui/icons-material';
import { login } from "../../../components/redux/authSlice";
import { useDispatch } from 'react-redux';
import localforage from 'localforage';
import { useNotification } from '../../../contexts/NotificationProvider';
import AccountUtil from '../../../utils/AccountUtil';
import AuthUtil from '../../../utils/AuthUtil';

const SignInButton = () => {
  const { showNotification } = useNotification();
  const dispatch = useDispatch();

  const handleGoogleSuccess = (credentialResponse) => {
    AccountUtil.googleLogin({ idToken: credentialResponse.credential }).then((res) => {
      if (res.data.code === 0) {
        const content = JSON.parse(res.data.message);
        
        // Store in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("userInfo", res.data.message);
          localStorage.setItem("token", content.tokenString);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', content.userId);
        }
        
        showNotification("Login successful!", "success");
        
        // Get user paths
        AuthUtil.getPaths().then((response1) => {
          if (response1.data.code === 0) {
            localforage.setItem("paths", JSON.parse(response1.data.message)).then(() => {
              setTimeout(() => {
                dispatch(login({
                  user: content.userId,
                  token: content.tokenString
                }));
              }, 500);
            });
          }
        });
      }
    }).catch(error => {
      console.error("Login error:", error);
      showNotification("Login failed. Please try again.", "error");
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
              borderColor: '#dadce0',
              color: '#3c4043',
              '&:hover': {
                borderColor: '#dadce0',
                backgroundColor: '#f8f9fa'
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
