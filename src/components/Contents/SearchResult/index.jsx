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
  Slide
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

// Dark mode color configurations
const getDarkModeColors = (mode) => ({
  background: {
    primary: mode === 'dark' ? '#121212' : '#ffffff',
    secondary: mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
    paper: mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    active: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
  },
  text: {
    primary: mode === 'dark' ? '#ffffff' : '#000000',
    secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)'
  },
  divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  scrollbar: {
    track: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    thumb: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    thumbHover: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
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
    viewHeight  : // Smaller height on mobile
    viewHeight;  // Larger height on desktop

  // Tab configurations with icons
  const tabConfigs = [
    { label: "USERS", icon: <PeopleIcon />, index: 0 },
    { label: "CHATS", icon: <ChatIcon />, index: 1 },
    { label: "VIDEOS", icon: <VideocamIcon />, index: 2 },
    { label: "MUSIC", icon: <MusicNoteIcon />, index: 3 },
    { label: "POSTS", icon: <ArticleIcon />, index: 4 }
  ];

  // Common scroll style for lists
  const scrollbarStyle = {
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': { 
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: colors.scrollbar.track,
    },
    '&::-webkit-scrollbar-thumb': {
      background: colors.scrollbar.thumb,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: colors.scrollbar.thumbHover,
    }
  };

  return (
    <Stack 
      sx={{ 
        width: isMobile ? '100%' : '90%',
         marginLeft: isMobile ? '0px' : '5%',
        height: viewHeight,
        gap: 2
      }} 
      direction={isMobile ? 'column' : 'row'} 
      //justifyContent="center"
      spacing={0}
    >
      {/* Mobile Detail View as Dialog/Slide */}
      {isMobile && showMobileDetail && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: colors.background.secondary,
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2,
            borderBottom: 1,
            borderColor: colors.divider
          }}>
            <Typography variant="h6" sx={{ color: colors.text.primary }}>Item Details</Typography>
            <Box 
              onClick={handleBackToList}
              sx={{ 
                cursor: 'pointer',
                padding: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
                bgcolor: colors.background.hover,
                '&:hover': {
                  bgcolor: colors.background.active,
                }
              }}
            >
              <ArrowBackIcon sx={{ color: colors.text.primary, mr: 0.5 }} />
              <Typography variant="body1" sx={{ color: colors.text.primary }}>Back</Typography>
            </Box>
          </Box>
          <Box sx={{ height: 'calc(100vh - 56px)', overflow: 'auto', ...scrollbarStyle }}>
            <Introductions selector={selector} handleBack={handleBackToList} isMobile={isMobile} onBack={onBackToList} />
          </Box>
        </Box>
      )}

      {/* Search Results List */}
      <Fade in={true} timeout={500}>
        <Paper elevation={3} sx={{ 
          width: isMobile ? '100%' : '40%',
          height: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: colors.background.paper,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out'
        }}>
          <AppBar 
            position="static" 
            color="default" 
            elevation={0}
            sx={{ 
              backgroundColor: 'transparent',
              borderBottom: 1, 
              borderColor: colors.divider
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
                backgroundColor: colors.background.secondary,

                // Scroll button styles
                '& .MuiTabs-scrollButtons': {
                  color: colors.text.secondary,
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '50%',
                  mx: 0.5,
                  '&:hover': {
                    backgroundColor: colors.background.hover,
                  },
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                },

                // Tab styles
                '& .MuiTab-root': {
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  letterSpacing: '0.05rem',
                  fontWeight: 500,
                  minWidth: 120,
                  color: colors.text.primary,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: colors.background.hover,
                  },
                },

                // Selected tab text
                '& .Mui-selected': {
                  color: mode === 'dark'
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.main,
                },

                // Tab indicator
                '& .MuiTabs-indicator': {
                  backgroundColor: mode === 'dark'
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.main,
                },
              }}
            >
              {tabConfigs.map((tab) => (
                <Tab
                  key={tab.index}
                  icon={React.cloneElement(tab.icon, { 
                    sx: { color: 'inherit' } 
                  })}
                  label={tab.label}
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
                      gap: 2
                    }}>
                      <CircularProgress color="secondary" size={40} />
                      <Typography 
                        variant="body2" 
                        sx={{ color: colors.text.primary }}
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
                      gap: 2,
                      opacity: 0.7
                    }}>
                      {React.cloneElement(tabConfigs[tabIndex].icon, { 
                        sx: { color: colors.text.secondary, fontSize: '2rem' } 
                      })}
                      <Typography 
                        align="center" 
                        variant="body2" 
                        sx={{ color: colors.text.secondary }}
                      >
                        No {tabConfigs[tabIndex].label.toLowerCase()} found
                      </Typography>
                    </Box>
                  ) : (
                    <Fade in={!isLoading} timeout={500}>
                      <List 
                        disablePadding
                        sx={{
                          '& > *:not(:last-child)': {
                            borderBottom: '1px solid',
                            borderColor: colors.divider
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
          
          {/* Count indicator */}
          {!isLoading && counts[value] > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 1, 
              mb: 0.5 
            }}>
              <Chip 
                label={`${counts[value]} ${tabConfigs[value].label.toLowerCase()} found`}
                size="small"
                color="secondary"
                sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 500, 
                  bgcolor: colors.background.hover,
                  color: colors.text.primary
                }}
              />
            </Box>
          )}
        </Paper>
      </Fade>

      {/* Detail Panel */}
      {!isMobile && selector.type && (
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <Stack 
            sx={{
              width: '70%',
              height: '100%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              borderRadius: 2,
              overflow: 'auto',
              bgcolor: colors.background.secondary,
              ...scrollbarStyle}}
              
          >
            <Introductions selector={selector} position="right"  />
          </Stack>
        </Slide>
      )}
      
      {/* Empty state when no item is selected */}
      {!isMobile && !selector.type && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '70%',
            height: '100%',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            backgroundColor: colors.background.secondary,
          }}
        >
          <Typography variant="body1" sx={{ color: colors.text.primary }}>
            Select an item to view details
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

// Helper function to map tab index to content type
function getTypeForTab(tabIndex) {
  switch (tabIndex) {
    case 0: return 'contact';
    case 1: return 'chatRecords';
    case 2: return tabIndex === 2 ? 'movie' : 'tv'; // You can differentiate here if needed
    case 3: return 'music';
    case 4: return 'posts';
    default: return '';
  }
}