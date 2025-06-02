import * as React from 'react';
import { useState, useEffect } from 'react';
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
import SwipeableViews from 'react-swipeable-views';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SearchItem from './SideBar/SearchItem';
import Introductions from '../Introductions';
import { useNotification } from '../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../Themes/ThemeContext';
import SearchUtil from '../../../util/io_utils/SearchUtil';

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
    // Much improved text colors for dark mode
    primary: mode === 'dark' ? '#f5f5f5' : '#1a1a1a',        // Brighter white for dark mode
    secondary: mode === 'dark' ? '#e0e0e0' : 'rgba(26, 26, 26, 0.7)',  // Much brighter secondary text
    disabled: mode === 'dark' ? '#a0a0a0' : 'rgba(26, 26, 26, 0.4)',   // Improved disabled text
    muted: mode === 'dark' ? '#c0c0c0' : 'rgba(26, 26, 26, 0.6)'       // New muted text level
  },
  border: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',  // Slightly more visible borders
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
  const location = useLocation();
  const { mode } = useThemeMode();
  const { showNotification } = useNotification();
  
  // Get dark mode color configurations
  const colors = getDarkModeColors(mode);
  
  // Redux state
  const search = useSelector((state) => state.search.search);
  const searchType = useSelector((state) => state.search.searchType);
  const changed = useSelector((state) => state.search.changed);
  
  // Local state
  const [value, setValue] = useState(0);
  const [list, setList] = useState([]);
  const [selector, setSelector] = useState({ type: null, objectId: null });
  const [viewHeight, setViewHeight] = useState(window.innerHeight * 0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0]); // Counts for each tab
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Handle selector change for mobile view
  useEffect(() => {
    if (isMobile && selector.type) {
      setShowMobileDetail(true);
    }
  }, [selector, isMobile]);

  // Update height on window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setViewHeight(window.innerHeight * 0.8);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onBackToList = () => {
    setShowMobileDetail(false);
    setSelector({ type: "", objectId: null });
  };

  // Effect for the search type changes
  useEffect(() => {
    if (searchType !== -1) {
      setValue(searchType);
    }
  }, [searchType]);

  // Effect for search changes
  useEffect(() => {
    if (searchType === -1) {
      // Do nothing
    } else {
      setIsLoading(true);
      performSearch(searchType, search);
    }
  }, [changed]);

  // Effect for tab changes
  useEffect(() => {
    setIsLoading(true);
    performSearch(value, search);
  }, [value]);

  const performSearch = (tabIndex, searchQuery) => {
    if (tabIndex === 0) {
      console.log("Searching contacts by ID:", searchQuery);
      SearchUtil.searchChatContactById(searchQuery, handleSearchResults).then(() => {
        setIsLoading(false);
      })
    } else if (tabIndex === 1) {
      SearchUtil.searchLocalResult(searchQuery, handleSearchResults)
    } else if (tabIndex === 2) {
      SearchUtil.searchVideos(searchQuery, handleSearchResults).then(() => {
        setIsLoading(false);
      }) 
    } else if (tabIndex === 3) {
      SearchUtil.searchMusics(searchQuery, handleSearchResults);
    } else if (tabIndex === 4) {
      SearchUtil.searchPosts(searchQuery, handleSearchResults);
    }
  };

  const handleSearchResults = (data) => {
    console.log("Search results:", data);
    setList(data);
    setIsLoading(false);
    
    // Update counts
    const newCounts = [...counts];
    newCounts[value] = data.length;
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

  return (
    <Stack 
      sx={{ 
        width: isMobile ? '100%' : '90%',
        height: viewHeight,
        gap: 2,
        p: isMobile ? 1 : 0
      }} 
      direction={isMobile ? 'column' : 'row'} 
      spacing={0}
    >
      {/* Enhanced Mobile Detail View */}
      {isMobile && showMobileDetail && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.background.primary,
          }}
        >
          {/* Improved Mobile Header with better back button */}
          <AppBar
            position="static"
            sx={{ 
              backgroundColor: colors.background.elevated,
              borderBottom: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
            }}
          >
            <Toolbar>
              <IconButton 
                onClick={handleBackToList}
                edge="start"
                sx={{ 
                  mr: 2,
                  p: 1,
                  backgroundColor: colors.background.hover,
                  color: colors.text.primary,
                  transition: 'all 0.2s ease'
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: colors.text.primary,
                  fontWeight: 600,
                  flex: 1
                }}
              >
                Details
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ 
            height: 'calc(100vh - 56px)', 
            backgroundColor: colors.background.secondary,
            ...scrollbarStyle 
          }}>
            <Introductions 
              selector={selector} 
              handleBack={handleBackToList} 
              isMobile={isMobile} 
              onBack={onBackToList} 
            />
          </Box>
        </Box>
      )}

      {/* Enhanced Search Results List */}
      <Fade in={true} timeout={500}>
        <Paper 
          elevation={8} 
          sx={{ 
            width: isMobile ? '100%' : '40%',
            height: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: colors.background.elevated,
            backdropFilter: 'blur(15px)',
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <AppBar 
            position="static" 
            color="default" 
            elevation={0}
            sx={{ 
              backgroundColor: colors.background.elevated,
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              indicatorColor="secondary"
              textColor="primary"
              aria-label="Search result tabs"
              sx={{
                backgroundColor: colors.background.elevated,
                minHeight: 64,

                // Enhanced scroll button styles
                '& .MuiTabs-scrollButtons': {
                  color: colors.text.primary,
                  backgroundColor: colors.background.hover,
                  borderRadius: '8px',
                  mx: 1,
                  width: 36,
                  height: 36,
                  '&:hover': {
                    backgroundColor: colors.background.active,
                    transform: 'scale(1.05)',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                  transition: 'all 0.2s ease',
                },

                // Enhanced tab styles with better text visibility
                '& .MuiTab-root': {
                  px: 3,
                  py: 2,
                  fontSize: '0.875rem',
                  letterSpacing: '0.02rem',
                  fontWeight: 600,
                  minWidth: 120,
                  color: colors.text.secondary, // Using improved secondary text color
                  borderRadius: '8px 8px 0 0',
                  margin: '0 2px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: colors.background.hover,
                    color: colors.text.primary, // Using improved primary text color
                    transform: 'translateY(-1px)',
                  },
                },

                // Enhanced selected tab with better visibility
                '& .Mui-selected': {
                  color: `${mode === 'dark' ? '#ffffff' : theme.palette.secondary.main} !important`, // Force white in dark mode
                  backgroundColor: colors.background.hover,
                  fontWeight: 700,
                },

                // Enhanced tab indicator
                '& .MuiTabs-indicator': {
                  backgroundColor: mode === 'dark'
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.main,
                  height: 3,
                  borderRadius: '2px 2px 0 0',
                },
              }}
            >
              {tabConfigs.map((tab) => (
                <Tab
                  key={tab.index}
                  icon={React.cloneElement(tab.icon, { 
                    sx: { 
                      color: 'inherit',
                      fontSize: '1.2rem'
                    } 
                  })}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.label}
                      {counts[tab.index] > 0 && (
                        <Chip 
                          label={counts[tab.index]} 
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: mode === 'dark' 
                              ? 'rgba(255,255,255,0.2)' // More visible chip background
                              : 'rgba(0,0,0,0.1)',
                            color: mode === 'dark' ? '#ffffff' : 'inherit' // Ensure chip text is visible
                          }}
                        />
                      )}
                    </Box>
                  }
                  {...a11yProps(tab.index)}
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      mb: 0.5,
                    },
                  }}
                />
              ))}
            </Tabs>
          </AppBar>
          
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
            enableMouseEvents={true}
            resistance={true}
            springConfig={{ duration: '0.35s', easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)', delay: '0s' }}
          >
            {[0, 1, 2, 3, 4].map((tabIndex) => (
              <TabPanel value={value} index={tabIndex} dir={theme.direction} key={tabIndex}>
                <Box sx={{
                  height: listHeight,
                  ...scrollbarStyle
                }}>
                  {isLoading ? (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      height: '100%',
                      flexDirection: 'column',
                      gap: 3
                    }}>
                      <CircularProgress 
                        color="secondary" 
                        size={48} 
                        thickness={4}
                        sx={{
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          }
                        }}
                      />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: colors.text.primary, // Using improved primary text
                          fontWeight: 500
                        }}
                      >
                        Searching {tabConfigs[tabIndex].label.toLowerCase()}...
                      </Typography>
                    </Box>
                  ) : list.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      height: '100%',
                      flexDirection: 'column',
                      gap: 3,
                      opacity: 0.8,
                      p: 4
                    }}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: '50%',
                          backgroundColor: colors.background.hover,
                          border: `2px solid ${colors.border}`
                        }}
                      >
                        {React.cloneElement(tabConfigs[tabIndex].icon, { 
                          sx: { color: colors.text.muted, fontSize: '2.5rem' } // Using new muted color
                        })}
                      </Box>
                      <Typography 
                        align="center" 
                        variant="h6" 
                        sx={{ 
                          color: colors.text.primary, // Improved primary text
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        No {tabConfigs[tabIndex].label.toLowerCase()} found
                      </Typography>
                      <Typography 
                        align="center" 
                        variant="body2" 
                        sx={{ 
                          color: colors.text.secondary, // Improved secondary text
                          maxWidth: 280
                        }}
                      >
                        Try adjusting your search terms or explore other categories
                      </Typography>
                    </Box>
                  ) : (
                    <Fade in={!isLoading} timeout={500}>
                      <List 
                        disablePadding
                        sx={{
                          '& > *:not(:last-child)': {
                            borderBottom: `1px solid ${colors.border}`
                          }
                        }}
                      >
                        {list.map((res, idx) => (
                          <SearchItem 
                            key={idx}
                            setSelector={setSelector} 
                            content={res} 
                            type={getTypeForTab(tabIndex)} 
                            idx={tabIndex}
                          />
                        ))}
                      </List>
                    </Fade>
                  )}
                </Box>
              </TabPanel>
            ))}
          </SwipeableViews>
        </Paper>
      </Fade>

      {/* Enhanced Detail Panel */}
      {!isMobile && selector.type && (
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={400}
        >
          <Paper
            elevation={8}
            sx={{
              width: '60%',
              height: '100%',
              borderRadius: 3,
              overflow: 'auto',
              backgroundColor: colors.background.elevated,
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
              ...scrollbarStyle
            }}
          >
            <Introductions selector={selector} position="right" />
          </Paper>
        </Slide>
      )}
      
      {/* Enhanced Empty state when no item is selected */}
      {!isMobile && !selector.type && (
        <Paper
          elevation={4}
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '60%',
            height: '100%',
            borderRadius: 3,
            backgroundColor: colors.background.elevated,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Box
            sx={{
              p: 4,
              borderRadius: '50%',
              backgroundColor: colors.background.hover,
              border: `2px dashed ${colors.border}`
            }}
          >
            <ChatIcon sx={{ color: colors.text.muted, fontSize: '3rem' }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: colors.text.primary, // Improved primary text
              fontWeight: 600,
              mb: 1
            }}
          >
            Ready to explore
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.text.secondary, // Improved secondary text
              textAlign: 'center',
              maxWidth: 300
            }}
          >
            Select an item from the search results to view detailed information
          </Typography>
        </Paper>
      )}
    </Stack>
  );
}

// Helper function to map tab index to content type
function getTypeForTab(tabIndex) {
  switch (tabIndex) {
    case 0: return 'contact';
    case 1: return 'chatRecords';
    case 2: return tabIndex === 2 ? 'movie' : 'tv';
    case 3: return 'music';
    case 4: return 'posts';
    default: return '';
  }
}