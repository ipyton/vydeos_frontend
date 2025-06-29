import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useThemeMode } from '../../../contexts/ThemeContext';
import styles from '../../../styles/NotFound.module.css';
import Head from 'next/head';

export default function NotFound() {
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
  
  return (
    <>
      <Head>
        <title>Page Not Found</title>
        <meta name="description" content="The page you're looking for couldn't be found" />
      </Head>
      
      <Container maxWidth="md" className={styles.container}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box className={styles.textContent}>
              <Typography variant="h2" component="h1" className={styles.title}>
                <span className={styles.highlight}>404</span>
              </Typography>
              
              <Typography variant="h4" component="h2" className={styles.subtitle}>
                Page Not Found
              </Typography>
              
              <Typography variant="body1" className={styles.description}>
                Oops! The page you're looking for doesn't exist or has been moved.
              </Typography>
              
              <Box className={styles.buttonContainer}>
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
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box className={styles.imageContainer}>
              <img
                src="/images/404.svg"
                alt="404 Not Found Illustration"
                className={styles.image}
              />
            </Box>
          </Grid>
        </Grid>
        
        <Box className={styles.suggestions}>
          <Typography variant="h6" className={styles.suggestionsTitle}>
            You might want to check out:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Link href="/" passHref>
                <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                  Home Page
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
            
            <Grid item xs={6} sm={4}>
              <Link href="/videos" passHref>
                <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                  Videos
                </Typography>
              </Link>
            </Grid>
            
            <Grid item xs={6} sm={4}>
              <Link href="/about" passHref>
                <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                  About Us
                </Typography>
              </Link>
            </Grid>
            
            <Grid item xs={6} sm={4}>
              <Link href="/settings" passHref>
                <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                  Settings
                </Typography>
              </Link>
            </Grid>
            
            <Grid item xs={6} sm={4}>
              <Link href="/chat" passHref>
                <Typography component="a" className={`${styles.link} ${mode === 'dark' ? styles.linkDark : styles.linkLight}`}>
                  Chat
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
} 