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
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slide
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import styles from '../../../../styles/FriendList.module.css';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import MailIcon from '@mui/icons-material/Mail';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

// Dynamic imports
const FriendItem = dynamic(() => import('./FriendItem'));
const SwipeableViews = dynamic(() => import('react-swipeable-views'), { ssr: false });

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

function CreateGroupDialog({ open, onClose }) {
  const theme = useTheme();
  const [mode, setMode] = useState('light');
  const [isClient, setIsClient] = useState(false);
  
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    allowInvites: true,
    avatar: null
  });

  const [selectedUsersToInvite, setSelectedUsersToInvite] = useState([]);

  // Check if we're on the client-side and get the theme mode
  useEffect(() => {
    setIsClient(true);
    
    // Get theme mode from localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setMode(savedMode);
    }
  }, []);

  const handleInputChange = (field) => (event) => {
    setGroupData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setGroupData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleSubmit = () => {
    // Handle group creation logic here
    console.log('Creating group:', groupData);
    let userIdsToInvite = []
    selectedUsersToInvite.forEach(user=> {
      userIdsToInvite.push(user.friendId)
    })
    
    // Mock API call for demo purposes
    // In a real app, you would call your API
    setTimeout(() => {
      onClose();
      // Reset form
      setGroupData({
        name: '',
        description: '',
        privacy: 'public',
        allowInvites: true,
        avatar: null
      });
      setSelectedUsersToInvite([]);
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setGroupData({
      name: '',
      description: '',
      privacy: 'public',
      allowInvites: true,
      avatar: null
    });
  };

  if (!isClient) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: mode === 'dark'
            ? '#1a1a1a'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: mode === 'dark'
            ? '0 24px 38px 3px rgba(0, 0, 0, 0.9), 0 9px 46px 8px rgba(0, 0, 0, 0.8)'
            : '0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
          border: mode === 'dark' ? '1px solid #404040' : '1px solid rgba(0, 0, 0, 0.05)',
        }
      }}
    >
      <DialogTitle
        sx={{
          background: mode === 'dark'
            ? '#242424'
            : 'linear-gradient(90deg, rgba(156, 39, 176, 0.05) 0%, rgba(63, 81, 181, 0.05) 100%)',
          borderBottom: `1px solid ${mode === 'dark' ? '#404040' : 'rgba(0, 0, 0, 0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          pt: 3,
          px: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.secondary.main,
              width: 40,
              height: 40,
              background: 'linear-gradient(45deg, #9c27b0, #3f51b5)',
            }}
          >
            <GroupsIcon />
          </Avatar>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: mode === 'dark' ? '#ffffff' : '#333333',
            }}
          >
            Create New Group
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.7)',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, backgroundColor: mode === 'dark' ? '#1a1a1a' : 'transparent' }}>
        <Stack spacing={3}>
          {/* Group Name */}
          <TextField
            fullWidth
            label="Group Name"
            value={groupData.name}
            onChange={handleInputChange('name')}
            variant="outlined"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: mode === 'dark' ? '#2a2a2a' : 'rgba(0, 0, 0, 0.02)',
                '& fieldset': {
                  borderColor: mode === 'dark' ? '#555555' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.04)',
                  '& fieldset': {
                    borderColor: mode === 'dark' ? '#777777' : 'rgba(0, 0, 0, 0.23)',
                  },
                },
              }
            }}
          />

          {/* Group Description */}
          <TextField
            fullWidth
            label="Group Description"
            value={groupData.description}
            onChange={handleInputChange('description')}
            variant="outlined"
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: mode === 'dark' ? '#2a2a2a' : 'rgba(0, 0, 0, 0.02)',
                '& fieldset': {
                  borderColor: mode === 'dark' ? '#555555' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.04)',
                  '& fieldset': {
                    borderColor: mode === 'dark' ? '#777777' : 'rgba(0, 0, 0, 0.23)',
                  },
                },
              }
            }}
          />

          {/* Group Settings */}
          <FormControlLabel
            control={
              <Switch
                checked={groupData.allowInvites}
                onChange={handleSwitchChange('allowInvites')}
                color="primary"
              />
            }
            label="Allow members to invite others"
            sx={{
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
            }}
          />

          {/* Placeholder for user selection */}
          <Box
            sx={{
              p: 2,
              border: `1px dashed ${mode === 'dark' ? '#555555' : 'rgba(0, 0, 0, 0.23)'}`,
              borderRadius: 2,
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              textAlign: 'center',
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            }}
          >
            <Typography variant="body2">
              Select friends to invite to this group
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!groupData.name.trim()}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(45deg, #9c27b0, #3f51b5)',
            boxShadow: mode === 'dark'
              ? '0 4px 15px rgba(156, 39, 176, 0.6)'
              : '0 4px 15px rgba(156, 39, 176, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #8e24aa, #3949ab)',
              boxShadow: mode === 'dark'
                ? '0 6px 20px rgba(156, 39, 176, 0.7)'
                : '0 6px 20px rgba(156, 39, 176, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: mode === 'dark' ? '#404040' : 'rgba(0, 0, 0, 0.1)',
              color: mode === 'dark' ? '#888888' : 'rgba(0, 0, 0, 0.26)',
              boxShadow: 'none',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Main Component
export default function Friend(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setSelector } = props;
  
  // States
  const [value, setValue] = useState(0);
  const [list, setList] = useState([]);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]); // Counts for each tab
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [mode, setMode] = useState('light');
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client-side and get the theme mode
  useEffect(() => {
    setIsClient(true);
    
    // Get theme mode from localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setMode(savedMode);
      setWindowHeight(window.innerHeight);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  // Initial data load
  useEffect(() => {
    if (!isClient) return;
    
    setIsLoading(true);
    
    // Mock API call for demo purposes
    // In a real app, you would call your API
    setTimeout(() => {
      // Generate mock data based on the tab
      const mockData = [];
      const count = Math.floor(Math.random() * 10) + 3; // 3-12 items
      
      for (let i = 0; i < count; i++) {
        if (value === 0 || value === 1 || value === 5) {
          mockData.push({
            friendId: `User_${i + 1}`,
            relationship: value === 0 ? 11 : value === 1 ? 10 : 0
          });
        } else if (value === 2) {
          mockData.push({
            userId: `Follower_${i + 1}`,
            relationship: 1
          });
        } else if (value === 3) {
          mockData.push({
            groupId: `group_${i + 1}`,
            groupName: `Group ${i + 1}`
          });
        } else if (value === 4) {
          mockData.push({
            invitationId: `inv_${i + 1}`,
            friendId: `Inviter_${i + 1}`
          });
        }
      }
      
      setList(mockData);
      
      // Update counts
      const newCounts = [...counts];
      newCounts[value] = mockData.length;
      setCounts(newCounts);
      
      setIsLoading(false);
    }, 1000);
  }, [value, isClient]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // The useEffect will handle the data fetching when value changes
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  // Calculate optimal list height for different devices
  const listHeight = isMobile ?
    (windowHeight || 600) * 0.6 : // Smaller height on mobile
    (windowHeight || 800) * 0.65;  // Larger height on desktop

  // Tab configurations with icons
  const tabConfigs = [
    { label: "FRIENDS", icon: <PeopleIcon />, index: 0 },
    { label: "FOLLOWS", icon: <PersonAddIcon />, index: 1 },
    { label: "FOLLOWERS", icon: <PersonIcon />, index: 2 },
    { label: "GROUPS", icon: <GroupsIcon />, index: 3 },
    { label: "INVITES", icon: <MailIcon />, index: 4, hideMobile: true },
    { label: "BLOCKED", icon: <BlockIcon />, index: 5, hideMobile: true }
  ];

  // Don't render on server-side
  if (!isClient) {
    return null;
  }

  return (
    <Paper 
      elevation={3} 
      className={`${styles.friendContainer} ${mode === 'dark' ? styles.friendContainerDark : styles.friendContainerLight}`}
    >
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={styles.tabs}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor={mode === 'dark' ? 'inherit' : 'primary'}
          variant="scrollable"
          scrollButtons
          aria-label="Relationship tabs"
          TabIndicatorProps={{
            className: `${styles.tabIndicator} ${mode === 'dark' ? styles.tabIndicatorDark : styles.tabIndicatorLight}`
          }}
          sx={{
            '& .MuiTabs-scrollButtons': {
              className: `${styles.scrollButton} ${mode === 'dark' ? styles.scrollButtonDark : styles.scrollButtonLight}`
            },
            '& .Mui-disabled': {
              className: styles.scrollButtonDisabled
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
                className={`
                  ${styles.tab} 
                  ${mode === 'dark' ? styles.tabDark : styles.tabLight}
                  ${value === tab.index ? styles.tabSelected : ''}
                  ${value === tab.index && mode === 'dark' ? styles.tabSelectedDark : ''}
                  ${value === tab.index && mode !== 'dark' ? styles.tabSelectedLight : ''}
                `}
                sx={{
                  '& .MuiSvgIcon-root': {
                    className: `
                      ${styles.tabIcon} 
                      ${mode === 'dark' ? styles.tabIconDark : styles.tabIconLight}
                      ${value === tab.index ? styles.tabIconSelected : ''}
                    `
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
        style={{ height: listHeight }}
        containerStyle={{ height: '100%' }}
        slideStyle={{ height: '100%' }}
      >
        {[0, 1, 2, 3, 4, 5].map((tabIndex) => (
          <TabPanel key={tabIndex} value={value} index={tabIndex} style={{ height: '100%' }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress color="secondary" />
              </Box>
            ) : list.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  No {tabConfigs[tabIndex].label.toLowerCase()} found
                </Typography>
                {tabIndex === 3 && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateGroupOpen(true)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                    }}
                  >
                    Create Group
                  </Button>
                )}
              </Box>
            ) : (
              <List sx={{ 
                width: '100%', 
                bgcolor: 'transparent',
                maxHeight: listHeight,
                overflow: 'auto',
                p: 0,
              }}>
                {list.map((item, idx) => (
                  <FriendItem
                    key={idx}
                    content={item}
                    idx={tabIndex}
                    setSelector={setSelector}
                  />
                ))}
                {tabIndex === 3 && (
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => setCreateGroupOpen(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                      }}
                    >
                      Create Group
                    </Button>
                  </Box>
                )}
              </List>
            )}
          </TabPanel>
        ))}
      </SwipeableViews>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
      />
    </Paper>
  );
} 