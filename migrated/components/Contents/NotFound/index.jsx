import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../../styles/NotFound.module.css';
import { useThemeMode } from '../../../contexts/ThemeContext';

export default function NotFound() {
  const router = useRouter();
  const { mode } = useThemeMode();
  
  return (
    <>
      <Head>
        <title>Page Not Found</title>
        <meta name="description" content="The page you're looking for couldn't be found" />
      </Head>
      
      <Container maxWidth="md" className={styles.container}>
        <Box className={styles.content}>
          <Box className={styles.imageContainer}>
            <img 
              src="/images/404.svg" 
              alt="Page Not Found" 
              className={styles.image} 
            />
          </Box>
          
          <Typography variant="h2" component="h1" className={styles.title}>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" className={styles.message}>
            Sorry, we couldn't find the page you're looking for. It might have been moved,
            deleted, or perhaps never existed.
          </Typography>
          
          <Box className={styles.actions}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => router.back()}
              className={styles.button}
            >
              Go Back
            </Button>
            
            <Link href="/" passHref>
              <Button 
                variant="contained" 
                color="primary"
                className={styles.button}
              >
                Go Home
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
} 