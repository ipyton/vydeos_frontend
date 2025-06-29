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
import LockResetIcon from '@mui/icons-material/LockReset';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
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
import { useThemeMode } from '../../../Themes/ThemeContext';
import { getAccountTheme } from '../theme';

const StepIcons = {
  0: <EmailIcon />,
  1: <LockOutlinedIcon />,
  2: <LockResetIcon />,
  3: <CheckCircleIcon />
};

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

export default function Forget(props) {
  const [skipped, setSkipped] = useState(new Set());
  const [receive, setReceive] = useState(false);
  const [selected, setSelected] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [validatepw, setValidatepw] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [step3Tokens, setStep3Tokens] = useState("");
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  const theme = getAccountTheme(mode);
  
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
  const [transactionNumber, setTransactionNumber] = useState("000000");

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
    AccountUtil.resetStep1(emailValue).catch((err) => {
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
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const jumpToLoginPage = () => {
    navigate('/login');
  };

  const steps = [
    'Verify Email',
    'Confirm Code',
    'Reset Password',
    'Complete'
  ];

  const StepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box component="form" onSubmit={step1} sx={{ mt: 3 }}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Remember your password? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box component="form" onSubmit={step2} sx={{ mt: 3 }}>
            <TextField
              required
              fullWidth
              name="digits"
              label="6-Digit Code"
              id="digits"
              autoComplete="one-time-code"
              autoFocus
              inputProps={{ maxLength: 6 }}
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={7}>
                <CountDownButton
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    AccountUtil.sendVerificationCode(email).then(
                      (response) => {
                        if (response && response.data && response.data.code === 0) {
                          showNotification("Verification code resent", "success");
                        } else {
                          showNotification("Failed to resend verification code", "error");
                        }
                      }
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="text"
              onClick={previousStep}
              sx={{ mt: 2 }}
            >
              Back
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box component="form" onSubmit={step3} sx={{ mt: 3 }}>
            <TextField
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="new-password"
              autoFocus
              error={!!passwordError}
              helperText={passwordError || "Password must include uppercase, lowercase, number, and special character"}
            />
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              sx={{ mt: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={previousStep}
            >
              Back
            </Button>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Avatar sx={{ m: '0 auto', bgcolor: 'success.main', width: 60, height: 60 }}>
              <CheckCircleIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Password Reset Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Your password has been reset successfully.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={jumpToLoginPage}
              sx={{ mt: 3 }}
            >
              Sign In
            </Button>
          </Box>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
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
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockResetIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3 }}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps} StepIconComponent={() => StepIcons[index]}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          
          <Box sx={{ width: '100%', mt: 2 }}>
            <StepContent />
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