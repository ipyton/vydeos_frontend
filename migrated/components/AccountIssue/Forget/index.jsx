import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useRouter } from 'next/router';

export default function Forget() {
  const router = useRouter();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        backdropFilter: 'blur(40px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%'
      }}
    >
      <Typography component="h1" variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      
      <Typography variant="body1" color="white" sx={{ mb: 3 }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        sx={{ mb: 2 }}
      />
      
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ py: 1.5, mt: 2 }}
      >
        Send Reset Link
      </Button>
      
      <Box sx={{ mt: 3 }}>
        <Link 
          href="/login" 
          variant="body2"
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            router.push('/login');
          }}
        >
          Back to login
        </Link>
      </Box>
    </Box>
  );
} 