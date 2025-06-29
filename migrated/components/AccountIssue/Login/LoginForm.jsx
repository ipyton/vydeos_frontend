import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { login } from '../../../components/redux/authSlice';
import { useNotification } from '../../../contexts/NotificationProvider';
import AccountUtil from '../../../utils/AccountUtil';
import AuthUtil from '../../../utils/AuthUtil';
import localforage from 'localforage';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { showNotification } = useNotification();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      return 'Email is required';
    } else if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      return 'Password is required';
    } else if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newEmailError = validateEmail(email);
    const newPasswordError = validatePassword(password);
    
    setEmailError(newEmailError);
    setPasswordError(newPasswordError);
    
    if (newEmailError || newPasswordError) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await AccountUtil.login({
        username: email,
        password: password
      });
      
      if (response.data.code === 0) {
        const content = JSON.parse(response.data.message);
        
        // Store data in localStorage (with SSR check)
        if (typeof window !== 'undefined') {
          localStorage.setItem("userInfo", response.data.message);
          localStorage.setItem("token", content.tokenString);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', content.userId);
        }
        
        showNotification("Login successful!", "success");
        
        // Get user paths
        const paths = await AuthUtil.getPaths();
        if (paths.data.code === 0) {
          await localforage.setItem("paths", JSON.parse(paths.data.message));
          
          setTimeout(() => {
            dispatch(login({
              user: content.userId,
              token: content.tokenString
            }));
            
            router.push('/');
          }, 500);
        }
      } else {
        showNotification("Login failed: " + response.data.message, "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showNotification("Login failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{ mt: 1 }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={handleEmailChange}
        error={!!emailError}
        helperText={emailError}
        disabled={isLoading}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={handlePasswordChange}
        error={!!passwordError}
        helperText={passwordError}
        disabled={isLoading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>
    </Box>
  );
};

export default LoginForm; 