import React from 'react';
import Button from '@mui/material/Button';
import { useGoogleLogin } from '@react-oauth/google';

export default function SignInButton() {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse);
      // Here you would normally call your backend API with the tokenResponse
    },
    onError: error => console.log('Login Failed:', error)
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      sx={{ py: 1.5, mt: 2 }}
      onClick={() => login()}
    >
      Sign in with Google
    </Button>
  );
} 