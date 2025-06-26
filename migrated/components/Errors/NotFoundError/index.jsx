import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import { useThemeMode } from '../../../contexts/ThemeContext';
import Image from 'next/image';

// Import styles
import styles from '../../../styles/NotFoundError.module.css';

const NotFoundError = () => {
  const router = useRouter();
  const { mode } = useThemeMode();

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper 
        elevation={3} 
        className={styles.paper}
        sx={{ 
          backgroundColor: mode === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/404.svg"
                alt="404 Not Found"
                width={300}
                height={300}
                priority
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E";
                }}
              />
            </div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box textAlign="center" className={styles.content}>
              <Typography variant="h2" component="h1" className={styles.errorCode}>
                404
              </Typography>
              
              <Typography variant="h4" component="h2" className={styles.title}>
                Page Not Found
              </Typography>
              
              <Typography variant="body1" className={styles.message}>
                The page you're looking for doesn't exist or has been moved.
              </Typography>
              
              <Box mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => router.push('/')}
                  className={styles.homeButton}
                >
                  Go Home
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => router.back()}
                  className={styles.backButton}
                  sx={{ ml: 2 }}
                >
                  Go Back
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NotFoundError; 