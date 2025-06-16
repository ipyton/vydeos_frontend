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
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

// Custom theme with a more modern palette - matching the signup theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#3f51b5',
        },
      },
    },
  },
});

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Chat Chat
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

  if (true === networkErr) {
    return <NetworkError />;
  }

  if (true === login) {
    return <Navigate to="/" replace />;
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
      <CssBaseline />

        <Container 
          component="main" 
          maxWidth="sm"
          sx={{
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)', // For Safari compatibility
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: semi-transparent background
            borderRadius: '16px', // Optional: rounded corners
            padding: '20px', // Optional: internal padding
          }}
        >
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            autoHideDuration={5000}
            sx={{ mt: 6 }}
          >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
          

            <Fade in={true}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <LoginIcon fontSize="large" />
                </Avatar>
                
                <Typography component="h1" variant="h4" gutterBottom>
                  Welcome Back
                </Typography>
                
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Sign in to access your account
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
                    sx={{ mb: 2 }}
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
                    sx={{ mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selected}
                        onChange={handleSelection} 
                        value="remember" 
                        color="primary" 
                        sx={{ borderRadius: 1 }}
                      />
                    }
                    label="Remember me for 30 days"
                    sx={{ mb: 2 }}
                  />
                          <GoogleOAuthProvider clientId="282080402821-e07eo98flrekqkh8p4rja2kr5f387psi.apps.googleusercontent.com">
            <SignInButton />
          </GoogleOAuthProvider>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{ py: 1.5, mt: 2 }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Signing In...
                      </Box>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                      <Link href="/forget" variant="body2" color="primary.main">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                      <Link href="/signup" variant="body2" color="primary.main">
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Fade>          
          <Copyright sx={{ mt: 3, color: 'white' }} />
        </Container>
    </ThemeProvider>
  );
}