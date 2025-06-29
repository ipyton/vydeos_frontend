import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Container, Box } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamic import for the FriendList component
const FriendList = dynamic(() => import('../components/Contents/FriendList'));

export default function FriendsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Friends | Blog</title>
        <meta name="description" content="View and manage your friends, groups, and connections" />
      </Head>
      
      <Container maxWidth={false} sx={{ pt: 2, pb: 4, height: 'calc(100vh - 64px)' }}>
        <Box sx={{ height: '100%' }}>
          <FriendList />
        </Box>
      </Container>
    </>
  );
} 