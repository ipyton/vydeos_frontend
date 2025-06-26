import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Fade, Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';

// Custom theme for SignUp component
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
  },
});

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Vydeo.xyz
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function SignUp(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const router = useRouter();

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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError('');
  };

  const validate = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // Placeholder for signup functionality
    setBarState({
      open: true,
      message: "Signup functionality is not implemented yet",
      severity: "info",
      vertical: "top",
      horizontal: "center"
    });
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
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px',
          padding: '20px',
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
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            
            <Typography component="h1" variant="h4" gutterBottom>
              Create Account
            </Typography>
            
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Sign up to get started with our services
            </Typography>
            
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
                autoComplete="new-password"
                value={password}
                onChange={handlePasswordChange}
                error={!!passwordError}
                helperText={passwordError}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                sx={{ mb: 2 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.5, mt: 2 }}
              >
                Sign Up
              </Button>
              
              <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                <Grid item>
                  <Link 
                    href="/login" 
                    variant="body2"
                    color="primary.main"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/login');
                    }}
                  >
                    Already have an account? Sign in
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