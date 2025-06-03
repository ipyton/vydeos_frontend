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
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

import FriendItem from './FriendItem';
import SocialMediaUtil from '../../../../util/io_utils/SocialMediaUtil';
import { useThemeMode } from '../../../../Themes/ThemeContext';
import { useNotification } from '../../../../Providers/NotificationProvider';

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


// Create Group Dialog Component
function CreateGroupDialog({ open, onClose, mode, theme }) {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    allowInvites: true,
    avatar: null
  });

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
            ? 'linear-gradient(145deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%)'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: mode === 'dark'
            ? '0 24px 38px 3px rgba(0, 0, 0, 0.6), 0 9px 46px 8px rgba(0, 0, 0, 0.4)'
            : '0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
        }
      }}
    >
      <DialogTitle
        sx={{
          background: mode === 'dark'
            ? 'linear-gradient(90deg, rgba(156, 39, 176, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)'
            : 'linear-gradient(90deg, rgba(156, 39, 176, 0.05) 0%, rgba(63, 81, 181, 0.05) 100%)',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
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
              background: mode === 'dark'
                ? 'linear-gradient(45deg, #ffffff, #e0e0e0)'
                : 'linear-gradient(45deg, #333333, #666666)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create New Group
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Stack spacing={3}>
          {/* Group Avatar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                border: `2px dashed ${mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: theme.palette.secondary.main,
                }
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 30, opacity: 0.6 }} />
            </Avatar>
          </Box>

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
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'transparent',
                }
              }
            }}
          />

          {/* Group Description */}
          <TextField
            fullWidth
            label="Description"
            value={groupData.description}
            onChange={handleInputChange('description')}
            variant="outlined"
            multiline
            rows={3}
            placeholder="Tell others what this group is about..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'transparent',
                }
              }
            }}
          />

          <Divider sx={{ my: 1, opacity: 0.3 }} />

          {/* Privacy Settings */}
          <FormControl fullWidth>
            <InputLabel>Privacy</InputLabel>
            <Select
              value={groupData.privacy}
              onChange={handleInputChange('privacy')}
              label="Privacy"
              sx={{
                borderRadius: 2,
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <MenuItem value="public">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PublicIcon fontSize="small" />
                  <Box>
                    <Typography variant="body2">Public</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Anyone can find and join
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="private">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon fontSize="small" />
                  <Box>
                    <Typography variant="body2">Private</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Invite only
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Additional Settings */}
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={groupData.allowInvites}
                  onChange={handleSwitchChange('allowInvites')}
                  color="secondary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2">Allow member invites</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Let members invite their friends
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          background: mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: 2,
            px: 3,
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }
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
            boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #8e24aa, #3949ab)',
              boxShadow: '0 6px 20px rgba(156, 39, 176, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
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
  const { mode } = useThemeMode();
  const { setSelector } = props;
  const { showNotification } = useNotification();
  // States
  const [value, setValue] = useState(0);
  const [list, setList] = useState([]);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]); // Counts for each tab
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial data load
  useEffect(() => {
    setIsLoading(true);
    
    SocialMediaUtil.getRelationships(value)
      .then(data => {
        setList(data);
        setIsLoading(false);
        
        // Update counts - in a real app, you'd get these from your API
        const newCounts = [...counts];
        newCounts[value] = data.length;
        setCounts(newCounts);
      })
      .catch(error => {
        console.error("Error fetching relationships:", error);
        setIsLoading(false);
      });
  }, [value]);
  // Handle group creation
  // const handleCreateGroup = () => {
  //   if (!validateGroupData()) return;

  //   // setLoading(true);
  //   axios({
  //     url: API_BASE_URL + "/group_chat/create",
  //     method: "post",
  //     data: {
  //       groupName: groupName,
  //       members: selectedFriends
  //     },
  //     headers: {
  //       "token": localStorage.getItem("token"),
  //     }
  //   })
  //   .then((res) => {
  //     if (res.data && res.data.success) {
  //       setOpenDialog(false);
  //       setGroupName("");
  //       setSelectedFriends([]);
  //       showNotification("Group created successfully", "success");
  //     } else {
  //       showNotification(res.data?.message || "Failed to create group", "error");
  //     }
  //   })
  //   .catch(err => {
  //     console.error("Group creation error:", err);
  //     if (err.response) {
  //       // Server responded with an error status
  //       showNotification(`Error: ${err.response.data?.message || "Failed to create group"}`, "error");
  //     } else if (err.request) {
  //       // Request made but no response received
  //       showNotification("Network error - please check your connection", "error");
  //     } else {
  //       // Error setting up the request
  //       showNotification("Failed to create group", "error");
  //     }
  //   })
  //   .finally(() => {
  //     setLoading(false);
  //   });
  // };
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // The useEffect will handle the data fetching when value changes
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
      transition: 'all 0.3s ease-in-out',
      height: '100%',
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
  textColor={mode === 'dark' ? 'inherit' : 'primary'}
  variant="scrollable"
  scrollButtons
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
      // Enhanced text visibility for dark mode
      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
      '&.Mui-selected': {
        color: mode === 'dark' ? '#ffffff' : theme.palette.primary.main,
        fontWeight: 600,
      },
      '&:hover': {
        backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
      },
      // Ensure icons are also visible in dark mode
      '& .MuiSvgIcon-root': {
        color: 'inherit',
        opacity: mode === 'dark' ? 0.9 : 0.8,
      },
      '&.Mui-selected .MuiSvgIcon-root': {
        opacity: 1,
      }
    },
    // Enhanced tab indicator for dark mode
    '& .MuiTabs-indicator': {
      height: 3,
      borderRadius: '2px 2px 0 0',
      backgroundColor: mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.main,
    },
    // Enhanced scroll buttons for dark mode
    '& .MuiTabs-scrollButtons': {
      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)',
      '&:hover': {
        backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
      },
      '&.Mui-disabled': {
        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
      }
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

      {/* Create Group Button - Only show for Groups tab and non-mobile */}
      {value === 3 && !isMobile && (
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateGroupOpen(true)}
            sx={{
              borderRadius: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #9c27b0, #3f51b5)',
              boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.05rem',
              '&:hover': {
                background: 'linear-gradient(45deg, #8e24aa, #3949ab)',
                boxShadow: '0 6px 20px rgba(156, 39, 176, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Create New Group
          </Button>
        </Box>
      )}
      
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
        enableMouseEvents={true}
        resistance={true}
                scrollButtons="auto"

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
                  <Box sx={{ 
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    '& .MuiSvgIcon-root': {
                      fontSize: '2rem'
                    }
                  }}>
                    {tabConfigs[tabIndex].icon}
                  </Box>
                  <Typography 
                    align="center"
                    color={mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}
                    sx={{ fontWeight: 400 }}
                  >
                    No {tabConfigs[tabIndex].label.toLowerCase()} to display
                  </Typography>
                  {/* Show create group button for empty groups on mobile */}
                  {tabIndex === 3 && isMobile && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setCreateGroupOpen(true)}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        borderColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          borderColor: theme.palette.secondary.dark,
                          backgroundColor: mode === 'dark' 
                            ? 'rgba(156, 39, 176, 0.1)' 
                            : 'rgba(156, 39, 176, 0.05)',
                        }
                      }}
                    >
                      Create Group
                    </Button>
                  )}
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
      
      {/* Count indicator */}
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

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        mode={mode}
        theme={theme}
      />
    </Paper>
  );
}