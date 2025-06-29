import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Box, Tabs, Tab, Paper, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamic import for the Introductions component
const Introductions = dynamic(() => import('../components/Contents/Introductions'));

export default function IntroductionsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedType, setSelectedType] = useState('contact');
  const [selector, setSelector] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Get type and id from query parameters or use defaults
    const { type, id } = router.query;
    if (type) {
      setSelectedType(type);
    }
    
    // Create a selector object based on the type and id
    if (type && id) {
      const newSelector = createSelector(type, id);
      setSelector(newSelector);
    } else {
      // Default selector for demo purposes
      setSelector(createSelector('contact', '12345'));
    }
  }, [router.query]);

  // Create a selector object based on type and id
  const createSelector = (type, id) => {
    switch (type) {
      case 'contact':
        return { type: 'contact', userId: id };
      case 'movie':
        return { type: 'movie', movieId: id, title: `Movie ${id}` };
      case 'tv':
        return { type: 'tv', tvId: id, title: `TV Show ${id}` };
      case 'group':
        return { type: 'groupId', content: id };
      case 'music':
        return { type: 'music', musicId: id };
      case 'chatRecords':
        return { type: 'chatRecords', recordId: id };
      default:
        return { type: 'contact', userId: id };
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedType(newValue);
    
    // Update the URL to reflect the selected type
    router.push({
      pathname: '/introductions',
      query: { type: newValue, id: '12345' } // Default ID for demo
    }, undefined, { shallow: true });
  };

  // Don't render on server-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Introductions | Blog</title>
        <meta name="description" content="View detailed information about various content types" />
      </Head>
      
      <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={selectedType}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Contact" value="contact" />
            <Tab label="Movie" value="movie" />
            <Tab label="TV Show" value="tv" />
            <Tab label="Group" value="group" />
            <Tab label="Music" value="music" />
            <Tab label="Chat Records" value="chatRecords" />
          </Tabs>
        </Paper>
        
        <Box sx={{ 
          height: 'calc(100vh - 200px)', 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          {selector && (
            <Introductions 
              selector={selector} 
              position="center" 
              isMobile={isMobile} 
              onBack={() => router.back()}
            />
          )}
        </Box>
      </Container>
    </>
  );
} 