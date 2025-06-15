import * as React from 'react';
import { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate, useNavigate } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Paper, Stack, Divider, Fade, Alert } from '@mui/material';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import Snackbar from '@mui/material/Snackbar';
import { useNotification } from '../../../Providers/NotificationProvider';
import { useRef } from 'react';
import { CountDownButton } from '../CountDownButton.jsx';

// Custom theme with a more modern palette
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
  },
});

// Copyright component
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

// Step icons for the stepper
const StepIcons = {
  0: <EmailIcon />,
  1: <LockOutlinedIcon />,
  2: <PersonAddIcon />,
  3: <CheckCircleIcon />
};

export default function SignUp(props) {
  const [skipped, setSkipped] = useState(new Set());
  const [email, setEmail] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [step3Tokens, setStep3Tokens] = useState("");
  const { showNotification } = useNotification();
  
  // Snackbar state
  const [barState, setBarState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: "",
    severity: "info"
  });
  const { vertical, horizontal, open, message, severity } = barState;

  const { loginState, setLoginState } = props;
  


  

  // Redirect if already logged in
  if (loginState === true) {
    return <Navigate to="/" replace />;
  }

  const validate = (nickname, username, password) => {
    return true;
  };


  const step1 = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const emailValue = data.get("email");
    setEmail(emailValue);
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      showNotification("Please enter a valid email address", "error")
      return;
    }
    setIsLoading(true);

        
    // Simulate API delay for demo purposes
      AccountUtil.registerStep1(emailValue).catch((err) => {
        console.log(err)
        return
      }).then(
        (response) => {
          if ((response != null && response !== undefined) && response.data != null && response.data !== undefined && response.data.code === 0) {
            AccountUtil.sendVerificationCode(emailValue).catch((err) => {
              console.log(err)
              return
            }).then(
              (response) => {
                if ((response != null && response !== undefined) && response.data != null && response.data !== undefined && response.data.code === 0) {
                  console.log("Verification code sent")
                  setIsLoading(false);
                  setActiveStep(activeStep + 1)
                  showNotification("Verification code sent", "success")
                }
                else {
                  showNotification("Please check your input", "error")
                }
              }
            )
          }
          else {
            showNotification("Please check your input", "error")
          }
        }
      )

  };

  const step2 = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const codeValue = data.get("digits");
    
    // Validate the code is 6 digits
    if (!/^\d{6}$/.test(codeValue)) {
      showNotification("Please enter a valid 6-digit code", "error")
      setIsLoading(false);
      return;
    }
    
    // Simulate API delay for demo purposes
      AccountUtil.registerStep2(email, codeValue).then(
        (response) => { 
          if ((response != null && response !== undefined) && response.data != null && response.data !== undefined && response.data.code === 0) {
            setActiveStep(2);
            setIsLoading(false);
            setStep3Tokens(response.data.message);
          }
          else {
            showNotification("Please check your input", "error")
            setIsLoading(false);
          }
        }
      )
  };

  const step3 = (event) => {
    event.preventDefault();
    setIsLoading(true);
    let password = event.currentTarget.password.value
    let validatepw = event.currentTarget.confirmPassword.value
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
      setIsLoading(false);
      return;
    }
    
    if (password !== validatepw) {
      setPasswordError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    

    if (step3Tokens == null || step3Tokens == undefined || step3Tokens === "") {
      showNotification("Please restart from the beginning", "error")
      setIsLoading(false);
      return;
    }

    AccountUtil.registerStep3(email, password, step3Tokens).then(
      (response) => {
        if ((response != null && response !== undefined) && response.data != null && response.data !== undefined && response.data.code === 0) {
          setActiveStep(activeStep + 1)
        }
        else {
          setBarState({ ...barState, open: true, message:response.data.message})

        }
        setIsLoading(false);
      }
    )
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setBarState({...barState, open: false});
  };



  const previousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const jumpToLoginPage = () => {
    navigate("/account/login");
  };

  const steps = [
    'Email Address',
    'Verification',
    'Set Password',
    'Complete',
  ];

  // Step Content Components
  const StepContent = () => {
    switch (activeStep) {
      case 0:
        return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <EmailIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h4" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Enter your email to get started with your new account
              </Typography>
              
              <Box component="form" noValidate onSubmit={step1} sx={{ width: '100%' }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  // onChange={(event) => setEmail(event.target.value)}
                  // value={email}
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? "Sending Verification..." : "Continue"}
                </Button>
                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                  <Grid item>
                    <Link href="/account/login" variant="body2" color="primary.main">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
        );
      case 1:
        return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h4" gutterBottom>
                Verify Email
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 1 }}>
                We've sent a verification code to
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 3 }}>
                {email}
              </Typography>
              
              <Box component="form" noValidate onSubmit={step2} sx={{ width: '100%' }}>
                <TextField
                  required
                  fullWidth
                  id="digits"
                  label="6-Digit Code"
                  name="digits"
                  placeholder="000000"
                  inputProps={{ maxLength: 6 }}
                  sx={{ mb: 2 }}
                />
                
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={previousStep}
                    variant="outlined"
                    sx={{ py: 1.5, flex: 1 }}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ py: 1.5, flex: 2 }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                </Stack>
                <CountDownButton email={email} activeStep={activeStep} />
              </Box>
            </Box>
        );
        
      case 2:
        return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <PersonAddIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h4" gutterBottom>
                Set Password
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Create a secure password for your new account
              </Typography>
              
              <Box component="form" noValidate onSubmit={step3} sx={{ width: '100%' }}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  error={!!passwordError}
                  sx={{ mb: 2 }}
                />
                <TextField
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  error={!!passwordError}
                  helperText={passwordError}
                  sx={{ mb: 2 }}
                />
                
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={previousStep}
                    variant="outlined"
                    sx={{ py: 1.5, flex: 1 }}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ py: 1.5, flex: 2 }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Complete Registration"}
                  </Button>
                </Stack>
              </Box>
            </Box>
        );
        
      case 3:
        return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Avatar sx={{ m: 2, bgcolor: 'success.main', width: 64, height: 64 }}>
                <CheckCircleIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h4" gutterBottom>
                Registration Complete!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                Your account has been successfully created. You can now sign in to access your account.
              </Typography>
              
              <Button
                onClick={jumpToLoginPage}
                fullWidth
                variant="contained"
                sx={{ py: 1.5 }}
              >
                Sign In
              </Button>
            </Box>
        );
        
      default:
        return <Typography>Something went wrong!</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm"  sx={{
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)', // For Safari compatibility
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: semi-transparent background
            borderRadius: '16px', // Optional: rounded corners
            padding: '20px', // Optional: internal padding
          }}>
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
        

          <Box sx={{ pt: 2, pb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel 
                      {...labelProps}
                      StepIconProps={{
                        icon: StepIcons[index]
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          <StepContent />
        
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}