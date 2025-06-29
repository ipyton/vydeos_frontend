import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Typography, Button, Container, Paper, Grid } from '@mui/material';
import { LockOutlined, ArrowBack, Home, Login } from '@mui/icons-material';
import { useThemeMode } from '../../../contexts/ThemeContext';
import styles from '../../../styles/NoPermission.module.css';

export default function NoPermission({ resourceType = 'content', requiredRole = '', customMessage = '' }) {
  const router = useRouter();
  const { mode } = useThemeMode();
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleGoHome = () => {
    router.push('/');
  };
  
  const handleLogin = () => {
    // Store the current URL to redirect back after login
    if (typeof window !== 'undefined') {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?returnUrl=${returnUrl}`);
    } else {
      router.push('/login');
    }
  };
  
  // Generate appropriate message based on resource type and required role
  const getMessage = () => {
    if (customMessage) return customMessage;
    
    if (requiredRole) {
      return `You need ${requiredRole} permissions to access this ${resourceType}.`;
    }
    
    return `You don't have permission to access this ${resourceType}.`;
  };
  
  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper 
        elevation={3} 
        className={`${styles.paper} ${mode === 'dark' ? styles.paperDark : styles.paperLight}`}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5} className={styles.iconContainer}>
            <LockOutlined className={`${styles.icon} ${mode === 'dark' ? styles.iconDark : styles.iconLight}`} />
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" className={styles.title}>
              Access Denied
            </Typography>
            
            <Typography variant="body1" className={styles.message}>
              {getMessage()}
            </Typography>
            
            <Box className={styles.details}>
              <Typography variant="body2" className={styles.detailsText}>
                You may need to:
              </Typography>
              
              <ul className={styles.list}>
                <li>Log in with an account that has the required permissions</li>
                <li>Request access from an administrator</li>
                <li>Verify that your account has the correct role</li>
              </ul>
            </Box>
            
            <Box className={styles.actions}>
              <Button
                variant="contained"
                startIcon={<Login />}
                onClick={handleLogin}
                className={`${styles.button} ${styles.loginButton} ${mode === 'dark' ? styles.loginButtonDark : styles.loginButtonLight}`}
              >
                Log In
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={handleGoHome}
                className={`${styles.button} ${styles.homeButton} ${mode === 'dark' ? styles.homeButtonDark : styles.homeButtonLight}`}
              >
                Go Home
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleGoBack}
                className={`${styles.button} ${styles.backButton} ${mode === 'dark' ? styles.backButtonDark : styles.backButtonLight}`}
              >
                Go Back
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box className={styles.help}>
        <Typography variant="subtitle2" className={styles.helpTitle}>
          Need help?
        </Typography>
        
        <Typography variant="body2" className={styles.helpText}>
          If you believe you should have access to this {resourceType}, please contact support at{' '}
          <a 
            href="mailto:support@example.com" 
            className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}
          >
            support@example.com
          </a>
        </Typography>
      </Box>
    </Container>
  );
} 