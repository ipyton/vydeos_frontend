import React from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { useThemeMode } from '../../../contexts/ThemeContext';
import styles from '../../../styles/LoadingPage.module.css';

export default function LoadingPage({ message = 'Loading content...', showSpinner = true }) {
  const { mode } = useThemeMode();
  
  return (
    <Container maxWidth="sm" className={styles.container}>
      <Box className={styles.content}>
        {showSpinner && (
          <CircularProgress 
            size={60}
            thickness={4}
            className={`${styles.spinner} ${mode === 'dark' ? styles.spinnerDark : styles.spinnerLight}`}
          />
        )}
        
        <Typography 
          variant="h6" 
          className={`${styles.message} ${mode === 'dark' ? styles.messageDark : styles.messageLight}`}
        >
          {message}
        </Typography>
        
        <Box className={styles.loadingBar}>
          <Box 
            className={`${styles.loadingProgress} ${mode === 'dark' ? styles.loadingProgressDark : styles.loadingProgressLight}`}
          />
        </Box>
      </Box>
    </Container>
  );
} 