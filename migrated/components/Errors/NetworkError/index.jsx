import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, Grid, LinearProgress } from '@mui/material';
import { WifiOff, Refresh, SignalWifiOff } from '@mui/icons-material';
import { useThemeMode } from '../../../contexts/ThemeContext';
import styles from '../../../styles/NetworkError.module.css';

export default function NetworkError({ onRetry }) {
  const { mode } = useThemeMode();
  const [isOnline, setIsOnline] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
    
    // Check online status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      
      // Add event listeners for online/offline status
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Cleanup
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);
  
  const handleRetry = async () => {
    if (!isClient) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      if (onRetry && typeof onRetry === 'function') {
        await onRetry();
      } else {
        // Default retry: check if we can reach a common endpoint
        const response = await fetch('https://www.google.com/generate_204', { 
          mode: 'no-cors',
          cache: 'no-cache'
        });
        
        // If we get here, we have network connectivity
        setIsOnline(true);
        
        // Wait a moment before refreshing
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Network retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };
  
  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }
  
  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper 
        elevation={3} 
        className={`${styles.paper} ${mode === 'dark' ? styles.paperDark : styles.paperLight}`}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} className={styles.iconContainer}>
            {isOnline ? (
              <SignalWifiOff className={`${styles.icon} ${mode === 'dark' ? styles.iconDark : styles.iconLight}`} />
            ) : (
              <WifiOff className={`${styles.icon} ${mode === 'dark' ? styles.iconDark : styles.iconLight}`} />
            )}
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" component="h1" className={styles.title}>
              {isOnline ? 'Connection Error' : 'No Internet Connection'}
            </Typography>
            
            <Typography variant="body1" className={styles.message}>
              {isOnline 
                ? 'We\'re having trouble connecting to our servers. Your internet connection appears to be working, but we can\'t reach our service.'
                : 'You appear to be offline. Please check your internet connection and try again.'}
            </Typography>
            
            <Box className={styles.details}>
              <Typography variant="body2" className={styles.detailsText}>
                {isOnline ? 'This could be due to:' : 'Please try:'}
              </Typography>
              
              <ul className={styles.list}>
                {isOnline ? (
                  <>
                    <li>Our servers may be experiencing high traffic</li>
                    <li>Temporary service outage</li>
                    <li>Firewall or network restrictions</li>
                  </>
                ) : (
                  <>
                    <li>Checking your Wi-Fi connection</li>
                    <li>Checking your mobile data settings</li>
                    <li>Reconnecting to your network</li>
                  </>
                )}
              </ul>
            </Box>
            
            {isRetrying && (
              <Box className={styles.progressContainer}>
                <LinearProgress 
                  className={`${styles.progress} ${mode === 'dark' ? styles.progressDark : styles.progressLight}`}
                />
                <Typography variant="caption" className={styles.progressText}>
                  Checking connection...
                </Typography>
              </Box>
            )}
            
            <Box className={styles.actions}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={handleRetry}
                disabled={isRetrying}
                className={`${styles.button} ${styles.retryButton} ${mode === 'dark' ? styles.retryButtonDark : styles.retryButtonLight}`}
              >
                {isRetrying ? 'Checking...' : `Retry Connection${retryCount > 0 ? ` (${retryCount})` : ''}`}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box className={styles.tips}>
        <Typography variant="subtitle2" className={styles.tipsTitle}>
          Troubleshooting Tips
        </Typography>
        
        <Typography variant="body2" className={styles.tipsText}>
          • Try refreshing the page<br />
          • Check if other websites are working<br />
          • Restart your router or modem<br />
          • Try again in a few minutes
        </Typography>
      </Box>
    </Container>
  );
} 