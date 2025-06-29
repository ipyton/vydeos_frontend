import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Skeleton } from '@mui/material';

export default function LongVideoIntroduction(props) {
  const { content, position, isMobile, onBack } = props;
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={40} width="60%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="40%" sx={{ mb: 3 }} />
        <Skeleton variant="text" height={20} width="90%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="85%" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {content.title || 'Video Title'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is a placeholder for the LongVideoIntroduction component. 
            In a complete implementation, this would display detailed information about a movie or TV show.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
} 