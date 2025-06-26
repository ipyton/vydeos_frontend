import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { requireAuthentication } from '../utils/AuthUtil';

// Dynamically import Chat component to avoid SSR issues
const Chat = dynamic(() => import('../components/Contents/Chat'), { 
  ssr: false,
  loading: () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 'calc(100vh - 64px)',
        p: 3
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Loading chat...
      </Typography>
    </Box>
  )
});

export default function ChatPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sideBarSelector, setSideBarSelector] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await requireAuthentication();
        setIsAuthenticated(isAuth);
        
        if (!isAuth) {
          router.push('/login?redirect=chat');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push('/login?redirect=chat');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Parse URL parameters to set initial chat
  useEffect(() => {
    if (router.isReady && router.query) {
      const { type, userId, groupId } = router.query;
      
      if (type && (userId || groupId)) {
        setSideBarSelector({
          type,
          userId: userId || undefined,
          groupId: groupId || undefined
        });
      }
    }
  }, [router.isReady, router.query]);
  
  const markAsRead = (type, id) => {
    // Function to mark messages as read
    // This should be implemented based on your app's requirements
    console.log('Marking as read:', type, id);
    
    // Update notifications state
    setNotifications(prev => prev.filter(
      notification => !(notification.type === type && notification.id === id)
    ));
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <Head>
          <title>Loading Chat...</title>
        </Head>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading chat...
        </Typography>
      </Box>
    );
  }
  
  // Only render Chat component if authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <>
      <Head>
        <title>Chat | Blog</title>
        <meta name="description" content="Chat with your contacts" />
      </Head>
      <Box sx={{ pt: { xs: 0, md: 2 }, px: { xs: 0, md: 2 } }}>
        <Chat
          sideBarSelector={sideBarSelector}
          setSideBarSelector={setSideBarSelector}
          notifications={notifications}
          setNotifications={setNotifications}
          markAsRead={markAsRead}
        />
      </Box>
    </>
  );
} 