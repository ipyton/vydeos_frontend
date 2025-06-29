import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Skeleton, Avatar, Stack, Chip } from '@mui/material';

export default function GroupIntroduction(props) {
  const { groupId, isMobile, onBack } = props;
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
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" height={40} width="70%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="50%" sx={{ mb: 3 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Members</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} variant="circular" width={40} height={40} />
          ))}
        </Stack>
        
        <Skeleton variant="text" height={20} width="90%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="85%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="80%" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Group #{groupId || '0000'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Created on {new Date().toLocaleDateString()}
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Members
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Chip
                key={i}
                avatar={<Avatar>U{i}</Avatar>}
                label={`User ${i}`}
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
          
          <Typography variant="body1">
            This is a placeholder for the GroupIntroduction component.
            In a complete implementation, this would display detailed information about a group,
            including members, description, and group settings.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
} 