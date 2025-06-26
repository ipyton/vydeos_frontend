import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Paper,
  AppBar,
  Tabs,
  Tab,
  List,
  CircularProgress,
  Chip,
  Fade,
  Slide,
  IconButton,
  Toolbar
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import Head from 'next/head';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SearchItem from './SideBar/SearchItem';
import { useNotification } from '../../../contexts/NotificationProvider';
import { useThemeMode } from '../../../contexts/ThemeContext';
import styles from '../../../styles/SearchResult.module.css';

// Dynamically import SwipeableViews to prevent SSR issues
const SwipeableViews = dynamic(() => import('react-swipeable-views'), { 
  ssr: false 
});

// Dynamic import for SearchUtil to avoid SSR issues
const SearchUtil = dynamic(() => import('../../../utils/SearchUtil'), { 
  ssr: false 
});

// Enhanced dark mode color configurations with much better contrast
const getDarkModeColors = (mode) => ({
  background: {
    primary: mode === 'dark' ? '#0a0a0a' : '#ffffff',
    secondary: mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
    paper: mode === 'dark' ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
    active: mode === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.1)',
    elevated: mode === 'dark' ? '#242424' : '#ffffff'
  },
  text: {
    primary: mode === 'dark' ? '#f5f5f5' : '#1a1a1a',
    secondary: mode === 'dark' ? '#e0e0e0' : 'rgba(26, 26, 26, 0.7)',
    disabled: mode === 'dark' ? '#a0a0a0' : 'rgba(26, 26, 26, 0.4)',
    muted: mode === 'dark' ? '#c0c0c0' : 'rgba(26, 26, 26, 0.6)'
  },
  border: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
  shadow: mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)' 
    : '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
  scrollbar: {
    track: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    thumb: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)',
    thumbHover: mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.35)'
  }
});

// TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={300}>
          <Box sx={{ p: { xs: 1, sm: 2, md: 2 } }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `search-tab-${index}`,
    'aria-controls': `search-tabpanel-${index}`,
  };
}

export default function SearchResults() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode } = useThemeMode();
  const { showNotification } = useNotification();
  const [isMounted, setIsMounted] = useState(false);
  
  // Get dark mode color configurations
  const colors = getDarkModeColors(mode);
  
  // Redux state
  const search = useSelector((state) => state.search?.search || '');
  const searchType = useSelector((state) => state.search?.searchType || -1);
  const changed = useSelector((state) => state.search?.changed || 0);
  
  // Local state
  const [value, setValue] = useState(0);
  const [list, setList] = useState([]);
  const [selector, setSelector] = useState({ type: null, objectId: null });
  const [viewHeight, setViewHeight] = useState(typeof window !== 'undefined' ? window.innerHeight - 84 : 600);
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0]); // Counts for each tab
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Update height for client-side rendering
    if (typeof window !== 'undefined') {
      setViewHeight(window.innerHeight - 84);
    }
  }, []);

  // Handle selector change for mobile view
  useEffect(() => {
    if (isMounted && isMobile && selector.type) {
      setShowMobileDetail(true);
    }
  }, [selector, isMobile, isMounted]);

  // Update height on window resize for responsive layout
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    
    const handleResize = () => {
      setViewHeight(window.innerHeight * 0.8);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);

  const onBackToList = () => {
    setShowMobileDetail(false);
    setSelector({ type: "", objectId: null });
  };

  // Effect for the search type changes
  useEffect(() => {
    if (!isMounted) return;
    
    if (searchType !== -1) {
      setValue(searchType);
    }
  }, [searchType, isMounted]);

  // Effect for search changes
  useEffect(() => {
    if (!isMounted || !SearchUtil || searchType === -1) return;
    
    setIsLoading(true);
    performSearch(searchType, search);
  }, [changed, isMounted, SearchUtil]);

  // Effect for tab changes
  useEffect(() => {
    if (!isMounted || !SearchUtil) return;
    
    setIsLoading(true);
    performSearch(value, search);
  }, [value, isMounted, SearchUtil]);

  const performSearch = async (tabIndex, searchQuery) => {
    if (!isMounted || typeof window === 'undefined' || !SearchUtil) return;
    if (!searchQuery || searchQuery.length === 0 || searchQuery === "") {
      setList([]);
      setIsLoading(false);
      return;
    }

    try {
      if (tabIndex === 0) {
        console.log("Searching contacts by ID:", searchQuery);
        await SearchUtil.searchChatContactById(searchQuery, handleSearchResults);
      } else if (tabIndex === 1) {
        await SearchUtil.searchLocalResult(searchQuery, handleSearchResults);
      } else if (tabIndex === 2) {
        await SearchUtil.searchVideos(searchQuery, handleSearchResults);
      } else if (tabIndex === 3) {
        await SearchUtil.searchMusics(searchQuery, handleSearchResults);
      } else if (tabIndex === 4) {
        await SearchUtil.searchPosts(searchQuery, handleSearchResults);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Search error:", error);
      showNotification({ 
        message: "Error performing search. Please try again.", 
        variant: "error" 
      });
      setIsLoading(false);
      setList([]);
    }
  };

  const handleSearchResults = (data) => {
    console.log("Search results:", data);
    setList(Array.isArray(data) ? data : []);
    setIsLoading(false);
    
    // Update counts
    const newCounts = [...counts];
    newCounts[value] = Array.isArray(data) ? data.length : 0;
    setCounts(newCounts);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleBackToList = () => {
    setShowMobileDetail(false);
    setSelector({ type: "", objectId: null });
  };

  // Calculate optimal list height for different devices
  const listHeight = isMobile ? 
    viewHeight - 120 : // Account for header and controls on mobile
    viewHeight - 80;   // Account for tabs on desktop

  // Tab configurations with icons
  const tabConfigs = [
    { label: "Users", icon: <PeopleIcon />, index: 0 },
    { label: "Chats", icon: <ChatIcon />, index: 1 },
    { label: "Videos", icon: <VideocamIcon />, index: 2 },
    { label: "Music", icon: <MusicNoteIcon />, index: 3 },
    { label: "Posts", icon: <ArticleIcon />, index: 4 }
  ];

  // Enhanced scroll style for lists
  const scrollbarStyle = {
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': { 
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: colors.scrollbar.track,
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: colors.scrollbar.thumb,
      borderRadius: '3px',
      transition: 'background 0.2s ease',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: colors.scrollbar.thumbHover,
    }
  };

  // Safe rendering when component isn't mounted yet to prevent hydration issues
  if (!isMounted) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading search...
        </Typography>
      </Box>
    );
  }

  // Mobile detail view when an item is selected
  if (isMobile && showMobileDetail) {
    return (
      <>
        <Head>
          <title>{getTypeForTab(value)} Search Result | Blog</title>
        </Head>
        <Box className={styles.mobileDetailContainer}>
          <AppBar position="sticky" color="inherit" elevation={0} className={styles.mobileDetailAppBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleBackToList} aria-label="back to list">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" className={styles.mobileDetailTitle}>
                {selector.name || selector.title || getTypeForTab(value)}
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Box className={styles.mobileDetailContent}>
            <Paper elevation={0} className={styles.mobileDetailPaper}>
              {renderDetailContent(selector)}
            </Paper>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Search Results | Blog</title>
        <meta name="description" content="Search results for blog content, users, chats, videos, music and posts" />
      </Head>
      
      <Box className={styles.container}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2} 
          className={styles.contentStack}
        >
          {/* Left Section: Search Results List */}
          <Paper 
            elevation={3} 
            className={styles.leftPanel}
            sx={{ 
              width: { xs: '100%', md: '40%' },
              boxShadow: colors.shadow
            }}
          >
            <AppBar 
              position="static" 
              color="inherit" 
              elevation={0}
              className={styles.searchAppBar}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="search category tabs"
                className={styles.tabs}
              >
                {tabConfigs.map((tab) => (
                  <Tab
                    key={tab.index}
                    label={
                      <Box className={styles.tabContent}>
                        {tab.icon}
                        <Box className={styles.tabLabel}>
                          {tab.label}
                          {counts[tab.index] > 0 && (
                            <Chip
                              label={counts[tab.index]}
                              size="small"
                              className={styles.tabChip}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    {...a11yProps(tab.index)}
                    className={value === tab.index ? styles.activeTab : styles.tab}
                  />
                ))}
              </Tabs>
            </AppBar>
            
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
              disabled={isLoading}
              className={styles.swipeableViews}
            >
              {[0, 1, 2, 3, 4].map((tabIndex) => (
                <TabPanel key={tabIndex} value={value} index={tabIndex}>
                  <Box
                    sx={{
                      height: listHeight,
                      ...scrollbarStyle
                    }}
                    className={styles.resultsContainer}
                  >
                    {isLoading ? (
                      <Box className={styles.loadingBox}>
                        <CircularProgress size={30} />
                        <Typography variant="body2" className={styles.loadingText}>
                          Searching {getTypeForTab(tabIndex)}...
                        </Typography>
                      </Box>
                    ) : list.length > 0 ? (
                      <List className={styles.resultsList}>
                        {list.map((item, idx) => (
                          <SearchItem
                            key={idx}
                            content={item}
                            type={getTypeForTab(tabIndex)}
                            setSelector={setSelector}
                            idx={idx}
                          />
                        ))}
                      </List>
                    ) : search && search.length > 0 ? (
                      <Box className={styles.noResultsBox}>
                        <Typography variant="body1" className={styles.noResultsText}>
                          No {getTypeForTab(tabIndex)} found for "{search}"
                        </Typography>
                      </Box>
                    ) : (
                      <Box className={styles.emptySearchBox}>
                        <Typography variant="body1" className={styles.emptySearchText}>
                          Enter a search term to find {getTypeForTab(tabIndex)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TabPanel>
              ))}
            </SwipeableViews>
          </Paper>

          {/* Right Section: Detail View */}
          <Paper 
            elevation={3} 
            className={styles.rightPanel}
            sx={{ 
              width: { xs: '100%', md: '60%' },
              display: { xs: 'none', md: 'block' },
              boxShadow: colors.shadow
            }}
          >
            {!selector.type ? (
              <Box className={styles.noSelectionBox}>
                <Typography variant="h6" className={styles.noSelectionTitle}>
                  Select an item to view details
                </Typography>
                <Typography variant="body2" className={styles.noSelectionSubtitle}>
                  Choose from the search results on the left to view more information
                </Typography>
              </Box>
            ) : (
              <Box className={styles.detailContainer}>
                {renderDetailContent(selector)}
              </Box>
            )}
          </Paper>
        </Stack>
      </Box>
    </>
  );
}

function getTypeForTab(tabIndex) {
  switch (tabIndex) {
    case 0: return 'Users';
    case 1: return 'Chats';
    case 2: return 'Videos';
    case 3: return 'Music';
    case 4: return 'Posts';
    default: return 'Items';
  }
}

function renderDetailContent(selector) {
  // For the initial version, we'll just render a placeholder with item details
  // This would be replaced with the actual detailed content component based on type
  if (!selector || !selector.type) {
    return (
      <Box className={styles.emptyDetailBox}>
        <Typography variant="body1">
          No item selected
        </Typography>
      </Box>
    );
  }

  // Basic example - to be replaced with proper content components
  return (
    <Box className={styles.detailContentBox}>
      <Typography variant="h5" className={styles.detailTitle}>
        {selector.name || selector.title || 'Item Details'}
      </Typography>
      
      {selector.pics || selector.image_address || selector.cover || selector.thumbnail ? (
        <Box className={styles.detailImageContainer}>
          <img
            src={selector.pics || selector.image_address || selector.cover || selector.thumbnail}
            alt={selector.name || selector.title || 'Item image'}
            className={styles.detailImage}
          />
        </Box>
      ) : null}
      
      <Box className={styles.detailInfoBox}>
        {selector.intro && (
          <Typography variant="body1" className={styles.detailIntro}>
            {selector.intro}
          </Typography>
        )}
        
        {selector.introduction && (
          <Typography variant="body1" className={styles.detailDescription}>
            {selector.introduction}
          </Typography>
        )}
        
        {selector.artist && (
          <Typography variant="body2" className={styles.detailMetadata}>
            Artist: {selector.artist}
          </Typography>
        )}
        
        {selector.release_date && (
          <Typography variant="body2" className={styles.detailMetadata}>
            Released: {selector.release_date}
          </Typography>
        )}
        
        {/* Placeholder for detailed content rendering */}
        <Box className={styles.detailPlaceholder}>
          <Typography variant="body2" className={styles.detailNote}>
            Detailed content for {selector.type} would be rendered here based on the selected item
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 