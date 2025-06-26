import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Stack, useTheme, useMediaQuery, Slide, Fade } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Dynamic imports to prevent SSR issues
const SideBar = dynamic(() => import('./SideBar'), { ssr: false });
const MessageList = dynamic(() => import('./MessageList'), { ssr: false });

export default function Chat(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [windowHeight, setWindowHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  let { sideBarSelector, setSideBarSelector, notifications, setNotifications, markAsRead } = props;

  // Set up client-side height calculation
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      
      const handleResize = () => {
        setWindowHeight(window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Process URL parameters to set the selected contact/group
  useEffect(() => {
    if (isMounted && router.query) {
      const { type, userId, groupId } = router.query;
      
      if (type && (userId || groupId)) {
        setSideBarSelector({
          type,
          userId: userId || undefined,
          groupId: groupId || undefined
        });
      }
    }
  }, [router.query, isMounted, setSideBarSelector]);

  // If component hasn't mounted yet, return null to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <Stack
      sx={{
        margin: isMobile ? '0' : '0px',
        marginTop: isMobile ? '0' : '20px',
        width: isMobile ? '100%' : '100%',
        height: isMobile ? "calc(100vh - 64px - 66px)" : "calc(100vh - 64px - 66px)",
        padding: isMobile ? '0' : '0 5px',
      }}
      direction={isMobile ? "column" : "row"}
      spacing={2}
    >
      {!(!!isMobile && (!!sideBarSelector)) && (
        <Fade in={true} timeout={500}>
          <div style={{ width: isMobile ? '100%' : '40%' }}> {/* Fixed width for sidebar container */}
            <SideBar
              select={sideBarSelector}
              setSelect={setSideBarSelector}
              isMobile={isMobile}
              markAsRead={markAsRead}
            />
          </div>
        </Fade>
      )}
      
      {!!(sideBarSelector) && (
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <div style={{ flexGrow: 1, width: isMobile ? '100%' : '50%' }}> {/* Adjusted width for message list */}
            <MessageList
              select={sideBarSelector}
              setSelect={setSideBarSelector}
              isMobile={isMobile}
              setNotifications={setNotifications}
              notifications={notifications}
              markAsRead={markAsRead}
            />
          </div>
        </Slide>
      )}
    </Stack>
  );
} 