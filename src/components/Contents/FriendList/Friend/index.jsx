import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  AppBar, 
  Tabs, 
  Tab, 
  Typography, 
  useMediaQuery,
  CircularProgress,
  Chip,
  Fade,
  Paper
} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import MailIcon from '@mui/icons-material/Mail';
import BlockIcon from '@mui/icons-material/Block';

import FriendItem from './FriendItem';
import SocialMediaUtil from '../../../../util/io_utils/SocialMediaUtil';
import { useThemeMode } from '../../../../Themes/ThemeContext';

// TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`relationship-tabpanel-${index}`}
      aria-labelledby={`relationship-tab-${index}`}
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// A11y props helper
function a11yProps(index) {
  return {
    id: `relationship-tab-${index}`,
    'aria-controls': `relationship-tabpanel-${index}`,
  };
}

// Main Component
export default function Friend(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode } = useThemeMode();
  const { setSelector } = props;
  
  // States
  const [value, setValue] = useState(0);
  const [list, setList] = useState([]);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]); // Counts for each tab

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial data load
  useEffect(() => {
    setIsLoading(true);
    SocialMediaUtil.getRelationships(value, setValue, (data) => {
      setList(data);
      setIsLoading(false);
      
      // Update counts - in a real app, you'd get these from your API
      const newCounts = [...counts];
      newCounts[value] = data.length;
      setCounts(newCounts);
    });
  }, []);

  const handleChange = (event, newValue) => {
    setIsLoading(true);
    SocialMediaUtil.getRelationships(newValue, setValue, (data) => {
      setList(data);
      setIsLoading(false);
      
      // Update counts when tab changes
      const newCounts = [...counts];
      newCounts[newValue] = data.length;
      setCounts(newCounts);
    });
  };
  
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  // Calculate optimal list height for different devices
  const listHeight = isMobile ? 
    windowHeight * 0.7 : // Smaller height on mobile
    windowHeight * 0.75;  // Larger height on desktop

  // Tab configurations with icons
  const tabConfigs = [
    { label: "FRIENDS", icon: <PeopleIcon />, index: 0 },
    { label: "FOLLOWS", icon: <PersonAddIcon />, index: 1 },
    { label: "FOLLOWERS", icon: <PersonIcon />, index: 2 },
    { label: "GROUPS", icon: <GroupsIcon />, index: 3 },
    { label: "INVITES", icon: <MailIcon />, index: 4, hideMobile: true },
    { label: "BLOCKED", icon: <BlockIcon />, index: 5, hideMobile: true }
  ];

  return (
    <Paper elevation={3} sx={{ 
      borderRadius: 2,
      maxHeight: '100%',
      overflow: 'hidden',
      backgroundColor: mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
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
          borderColor: 'divider' 
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="primary"
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          aria-label="Relationship tabs"
          sx={{
            '& .MuiTab-root': {
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              letterSpacing: '0.05rem',
              fontWeight: 500,
              minWidth: 120,
              maxWidth: isMobile ? 160 : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              },
            }
          }}
        >
          {tabConfigs.map((tab) => (
            (!tab.hideMobile || !isMobile) && (
              <Tab 
                key={tab.index}
                icon={tab.icon}
                label={tab.label}
                {...a11yProps(tab.index)}
                sx={{
                  '& .MuiTab-iconWrapper': {
                    mb: 0.5,
                  }
                }}
              />
            )
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
        {[0, 1, 2, 3, 4, 5].map((tabIndex) => (
          <TabPanel value={value} index={tabIndex} dir={theme.direction} key={tabIndex}>
            <Box sx={{
              height: listHeight,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { 
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              }
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
                  <Typography variant="body2" color="text.secondary">
                    Loading {tabConfigs[tabIndex].label.toLowerCase()}...
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
                  {tabConfigs[tabIndex].icon}
                  <Typography align="center">
                    No {tabConfigs[tabIndex].label.toLowerCase()} to display
                  </Typography>
                </Box>
              ) : (
                <Fade in={!isLoading} timeout={500}>
                  <List 
                    disablePadding
                    sx={{
                      '& > *:not(:last-child)': {
                        borderBottom: '1px solid',
                        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    {list.map((res, idx) => (
                      <FriendItem 
                        key={idx}
                        setSelector={setSelector} 
                        content={res} 
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
      
      {/* 计数指示器单独显示，而不是在标签内 */}
      {!isLoading && counts[value] > 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 1, 
          mb: 0.5 
        }}>
          <Chip 
            label={`${counts[value]} ${tabConfigs[value].label.toLowerCase()}`}
            size="small"
            color="secondary"
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
      )}
    </Paper>
  );
}