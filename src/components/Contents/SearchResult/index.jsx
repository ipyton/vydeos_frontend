import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Stack, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SearchSidebar from './SideBar';
import Introductions from '../Introductions';
import { useNotification } from '../../../Providers/NotificationProvider';

export default function SearchResults() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const searchResult = useSelector((state) => state.searchResult.value);
  
  const [selector, setSelector] = useState({ type: "", objectId: null });
  const [viewHeight, setViewHeight] = useState(window.innerHeight * 0.8);
  const { showNotification } = useNotification();
  
  // Update height on window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setViewHeight(window.innerHeight * 0.8);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive layout handling
  const containerStyles = isMobile 
    ? { width: '95%', marginLeft: '2.5%', flexDirection: 'column' }
    : { width: '80%', marginLeft: '10%', flexDirection: 'row' };

  return (
    <Stack 
      sx={{ 
        ...containerStyles,
        marginTop: 3, 
        height: viewHeight,
        gap: 2
      }} 
      direction={isMobile ? 'column' : 'row'} 
      justifyContent="center"
      spacing={0}
    >
      <SearchSidebar setSelector={setSelector} />
      
      <Stack 
        sx={{
          width: isMobile ? '100%' : '70%',
          height: isMobile ? `calc(${viewHeight}px - 350px)` : '100%',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderRadius: 2,
          overflow: 'auto',
          bgcolor: 'background.paper'
        }}
      >
        {selector.type ? (
          <Introductions selector={selector} position="right" />
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%', 
              p: 3 
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Select an item from the sidebar to view details
            </Typography>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}