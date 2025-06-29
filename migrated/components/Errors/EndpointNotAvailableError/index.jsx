import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Warning as WarningIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useThemeMode } from '../../../contexts/ThemeContext';
import styles from '../../../styles/EndpointNotAvailableError.module.css';

export default function EndpointNotAvailableError({ endpoint, onRetry }) {
  const { mode } = useThemeMode();
  
  const handleRetry = () => {
    if (onRetry && typeof onRetry === 'function') {
      onRetry();
    } else {
      // Default retry action: reload the page
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };
  
  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper 
        elevation={3} 
        className={`${styles.paper} ${mode === 'dark' ? styles.paperDark : styles.paperLight}`}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3} className={styles.iconContainer}>
            <WarningIcon className={`${styles.icon} ${mode === 'dark' ? styles.iconDark : styles.iconLight}`} />
          </Grid>
          
          <Grid item xs={12} sm={9}>
            <Typography variant="h4" component="h1" className={styles.title}>
              Service Unavailable
            </Typography>
            
            <Typography variant="body1" className={styles.message}>
              We're having trouble connecting to the required service.
              {endpoint && (
                <>
                  <br />
                  <code className={styles.endpoint}>{endpoint}</code> is currently unavailable.
                </>
              )}
            </Typography>
            
            <Box className={styles.details}>
              <Typography variant="body2" className={styles.detailsText}>
                This could be due to:
              </Typography>
              
              <ul className={styles.list}>
                <li>Temporary server maintenance</li>
                <li>Network connectivity issues</li>
                <li>Service outage</li>
              </ul>
            </Box>
            
            <Box className={styles.actions}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRetry}
                className={`${styles.button} ${styles.retryButton} ${mode === 'dark' ? styles.retryButtonDark : styles.retryButtonLight}`}
              >
                Retry Connection
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box className={styles.supportInfo}>
        <Typography variant="body2" className={styles.supportText}>
          If the problem persists, please contact support at{' '}
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