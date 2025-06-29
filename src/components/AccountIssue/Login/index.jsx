import * as React from 'react';
import { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import NetworkError from '../../Errors/NetworkError';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import { useNotification } from '../../../Providers/NotificationProvider';
import localforage from 'localforage';
import { Paper, Divider, Fade, Alert, Snackbar, CircularProgress } from '@mui/material';
import AuthUtil from '../../../util/io_utils/AuthUtil';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignInButton from './SignInButton';
import { login } from "../../redux/authSlice"; // Adjust path to your auth actions
import store from "../../redux/store"; // Adjust path to your Redux store
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useThemeMode } from '../../../Themes/ThemeContext';
import { getAccountTheme } from '../theme';

function Copyright(props) {
  const { mode } = useThemeMode();
  return (
    <Typography variant="body2" color={mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'} align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Vydeo.xyz
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Login(props) {
  const [selected, setSelected] = useState(false);
  const [networkErr, setNetworkErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { showNotification } = useNotification();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { mode } = useThemeMode();
  const theme = getAccountTheme(mode);

  const navigate = useNavigate();

  // Snackbar state
  const [barState, setBarState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: "",
    severity: "info"
  });
  const { vertical, horizontal, open, message, severity } = barState;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setBarState({...barState, open: false});
  };
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (true === networkErr) {
    return <NetworkError />;
  }

  const validate = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };

  const handleSelection = (event) => {
    setSelected(!selected);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    
    const data = new FormData(event.currentTarget);
    data.append("remember", selected);

    try {
      const response = await AccountUtil.login(data);
      
      if (response === undefined || response.data === undefined) {
        setBarState({
          open: true,
          message: "Unable to connect to server",
          severity: "error",
          vertical: "top",
          horizontal: "center"
        });
        setIsLoading(false);
        return;
      }
      
      let responseData = response.data;
      
      if (responseData.code === -1) {
        showNotification(responseData.message, "error");
        setBarState({
          open: true,
          message: responseData.message || "Login failed",
          severity: "error",
          vertical: "top",
          horizontal: "center"
        });
      } else if (responseData.code === 0) {
        localStorage.setItem("token", responseData.message);
        localStorage.setItem("userId", data.get("email"));
        
        try {
          await localforage.setItem("userId", data.get("email"));
          const userInfoResponse = await AccountUtil.getOwnerInfo();
          
          if (userInfoResponse && userInfoResponse.data && userInfoResponse.data.code !== -1) {
            const content = JSON.parse(userInfoResponse.data.message);
            localStorage.setItem("userInfo", JSON.stringify(content));
            showNotification("Login successful!", "success")
            AuthUtil.getPaths().then(
              (response1) => {
                if (response1.data.code === 0) {
                  localforage.setItem("paths", JSON.parse(response1.data.message)).then(  
                    () => {
                      setTimeout(() => {
                        store.dispatch(login({
                          user: content.userId,
                          token: responseData.message
                        }));
                      navigate('/', { replace: true });

                        
                      }, 500);
                    }
                  )
                }
              }
            )
            // Give the notification time to show before redirecting

          }
        } catch (err) {
          showNotification("Error retrieving user information", "error");
        }
      } else {
        showNotification(responseData.message, "error");
      }
    } catch (error) {
      if (error.message === "Network Error") {
        setNetworkErr(true);
      } else {
        setBarState({
          open: true,
          message: "Login failed: " + error.message,
          severity: "error",
          vertical: "top",
          horizontal: "center"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 8,
            mb: 4,
            width: '100%',
            maxWidth: '550px',
            mx: 'auto'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LoginIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={selected}
                  onChange={handleSelection}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forget" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4, width: '100%' }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
              <SignInButton />
            </GoogleOAuthProvider>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 5 }} />
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}