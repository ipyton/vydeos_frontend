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

export function CountDownButton({email, activeStep}) {
  //countdown for step 1
  const { showNotification } = useNotification();

  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
    const timerRef = useRef(null);
    const countdownRef = useRef(60); // Store the actual countdown value in a ref
  
    const [countdownDisplay, setCountdownDisplay] = useState(60); // Only for display purposes
    useEffect(() => {
        if (activeStep === 1 && timerRef.current === null) {
          // Initialize
          countdownRef.current = 60; // Reset to initial value (e.g., 60 seconds)
          setCountdownDisplay(countdownRef.current);
          setIsResendDisabled(true);
          
          timerRef.current = setInterval(() => {
            countdownRef.current -= 1;
            
            // Only update the state when needed (for display)
            setCountdownDisplay(countdownRef.current);
            
            if (countdownRef.current <= 0) {
              clearInterval(timerRef.current);
              timerRef.current = null;
              setIsResendDisabled(false);
            }
          }, 1000);
        }
        
        return () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        };
      }, []);
  const handleResendCode = (e) => {
    e.preventDefault();
    setIsResendDisabled(true);
    setCountdown(30);
    
    // Add your code resending logic here
    AccountUtil.sendVerificationCode(email).catch((err) => {
      console.log(err);
      return;
    }).then((response) => {
      if ((response != null && response !== undefined) && response.data != null && 
          response.data !== undefined && response.data.code === 0) {
        showNotification("Verification code resent", "success");
      } else {
        showNotification("Failed to resend code", "error");
      }
    });
    
    // Start the countdown again
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };
  return  (<Box sx={{ mt: 3, textAlign: 'center' }}>
  <Button
  variant="text"
  disabled={isResendDisabled}
  onClick={handleResendCode}
  sx={{ 
    textTransform: 'none',
    fontSize: 'body2.fontSize'
  }}
  >
  {isResendDisabled 
    ? `Resend code in ${countdownDisplay}s` 
    : "Didn't receive a code? Resend"}
  </Button>
</Box>
)
}
