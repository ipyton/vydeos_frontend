import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Typography, Button, Container, Paper, Grid } from '@mui/material';
import { Search as SearchIcon, ArrowBack as ArrowBackIcon, Home as HomeIcon } from '@mui/icons-material';
import { useThemeMode } from '../../../contexts/ThemeContext';
import styles from '../../../styles/NotFoundError.module.css';

export default function NotFoundError({ resourceType = 'resource', resourceId = '', customMessage = '' }) {
  const router = useRouter();
  const { mode } = useThemeMode();
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleGoHome = () => {
    router.push('/');
  };
  
  const handleSearch = () => {
    router.push('/search');
  };
  
  // Generate appropriate message based on resource type
  const getMessage = () => {
    if (customMessage) return customMessage;
    
    if (resourceId) {
      return `The ${resourceType} with ID "${resourceId}" could not be found. It may have been deleted or never existed.`;
    }
    
    return `The requested ${resourceType} could not be found. It may have been deleted or never existed.`;
  };
  
  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper 
        elevation={3} 
        className={`${styles.paper} ${mode === 'dark' ? styles.paperDark : styles.paperLight}`}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5} className={styles.iconContainer}>
            <Box className={styles.errorCode}>404</Box>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" className={styles.title}>
              {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Not Found
            </Typography>
            
            <Typography variant="body1" className={styles.message}>
              {getMessage()}
            </Typography>
            
            <Box className={styles.actions}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                className={`${styles.button} ${styles.homeButton} ${mode === 'dark' ? styles.homeButtonDark : styles.homeButtonLight}`}
              >
                Go Home
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                className={`${styles.button} ${styles.backButton} ${mode === 'dark' ? styles.backButtonDark : styles.backButtonLight}`}
              >
                Go Back
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                className={`${styles.button} ${styles.searchButton} ${mode === 'dark' ? styles.searchButtonDark : styles.searchButtonLight}`}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box className={styles.suggestions}>
        <Typography variant="subtitle2" className={styles.suggestionsTitle}>
          You might want to check out:
        </Typography>
        
        <Grid container spacing={2}>
          {resourceType === 'post' && (
            <>
              <Grid item xs={6} sm={4}>
                <Link href="/posts" passHref>
                  <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                    All Posts
                  </Typography>
                </Link>
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Link href="/videos" passHref>
                  <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                    Videos
                  </Typography>
                </Link>
              </Grid>
            </>
          )}
          
          {resourceType === 'video' && (
            <>
              <Grid item xs={6} sm={4}>
                <Link href="/videos" passHref>
                  <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                    All Videos
                  </Typography>
                </Link>
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Link href="/posts" passHref>
                  <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                    Blog Posts
                  </Typography>
                </Link>
              </Grid>
            </>
          )}
          
          {resourceType === 'user' && (
            <Grid item xs={6} sm={4}>
              <Link href="/chat" passHref>
                <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                  Chat
                </Typography>
              </Link>
            </Grid>
          )}
          
          <Grid item xs={6} sm={4}>
            <Link href="/" passHref>
              <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                Home Page
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 