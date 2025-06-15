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
import UserInviteSelector from './UserInviteSelector';

import MessageUtil from '../../../../util/io_utils/MessageUtil';

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

function CreateGroupDialog({ open, onClose, mode, theme }) {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    allowInvites: true,
    avatar: null
  });

  const [selectedUsersToInvite, setSelectedUsersToInvite] = useState([]);


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
    MessageUtil.createGroup(groupData.name, groupData.description,userIdsToInvite, groupData.allowInvites )
    onClose();
    // Reset form
    setGroupData({
      name: '',
      description: '',
      privacy: 'public',
      allowInvites: true,
      avatar: null
    });
    setSelectedUsersToInvite([])
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
                '&.Mui-focused': {
                  backgroundColor: mode === 'dark' ? '#2a2a2a' : 'transparent',
                  '& fieldset': {
                    borderColor: theme.palette.secondary.main,
                    borderWidth: '2px',
                  },
                }
              },
              '& .MuiInputLabel-root': {
                color: mode === 'dark' ? '#cccccc' : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-focused': {
                  color: theme.palette.secondary.main,
                }
              },
              '& .MuiOutlinedInput-input': {
                color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
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
                '&.Mui-focused': {
                  backgroundColor: mode === 'dark' ? '#2a2a2a' : 'transparent',
                  '& fieldset': {
                    borderColor: theme.palette.secondary.main,
                    borderWidth: '2px',
                  },
                }
              },
              '& .MuiInputLabel-root': {
                color: mode === 'dark' ? '#cccccc' : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-focused': {
                  color: theme.palette.secondary.main,
                }
              },
              '& .MuiOutlinedInput-input': {
                color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
                '&::placeholder': {
                  color: mode === 'dark' ? '#888888' : 'rgba(0, 0, 0, 0.6)',
                  opacity: 1,
                }
              }
            }}
          />

          <Divider sx={{
            my: 1,
            borderColor: mode === 'dark' ? '#404040' : 'rgba(0, 0, 0, 0.12)'
          }} />
          <UserInviteSelector
            selectedUsers={selectedUsersToInvite}
            onSelectionChange={setSelectedUsersToInvite}
            mode={mode}
            theme={theme}
          />
          <Divider sx={{
            my: 1,
            borderColor: mode === 'dark' ? '#404040' : 'rgba(0, 0, 0, 0.12)'
          }} />
          {/* Privacy Settings */}
          <FormControl fullWidth>
            <InputLabel sx={{
              color: mode === 'dark' ? '#cccccc' : 'rgba(0, 0, 0, 0.6)',
              '&.Mui-focused': {
                color: theme.palette.secondary.main,
              }
            }}>
              Privacy
            </InputLabel>

          </FormControl>

          {/* Additional Settings */}
          <Box sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: mode === 'dark' ? '#2a2a2a' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${mode === 'dark' ? '#555555' : 'rgba(0, 0, 0, 0.1)'}`
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
                  <Typography variant="body2" sx={{
                    color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)'
                  }}>
                    Allow using invitation code/url to join.
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: mode === 'dark' ? '#888888' : 'rgba(0, 0, 0, 0.6)'
                  }}>
                    Let members invite their friends using invitation code/url to join.
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
          borderTop: `1px solid ${mode === 'dark' ? '#404040' : 'rgba(0, 0, 0, 0.1)'}`,
          background: mode === 'dark' ? '#242424' : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: 2,
            px: 3,
            color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.7)',
            border: mode === 'dark' ? '1px solid #555555' : 'none',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              borderColor: mode === 'dark' ? '#777777' : 'transparent',
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
  const { mode } = useThemeMode();
  console.log("Friend component rendered with mode:", mode);
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
    
    SocialMediaUtil.getRelationships(value).then((response) => {
            if (!response || !response.data) {
                console.log("Internal Error");
                throw new Error("Internal Error");
            }
            
            if (response.data && response.data.code === -1) {
                throw new Error(response.data.message || "Error with code -1");
            }
            
            try {
                const list = JSON.parse(response.data.message);
                return list;
            } catch (error) {
                console.error("Error parsing response:", error);
                throw error;
            }
        })
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
    windowHeight * 0.6 : // Smaller height on mobile
    windowHeight * 0.65;  // Larger height on desktop

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
      {value === 3 && (
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
              paddingBottom:"16px",
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
                  height: '100vh',
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
                  height: '100vh',
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
                </Box>
              ) : (
                <Fade in={!isLoading} timeout={500}>
                  <List
                    disablePadding
                    sx={{
                      paddingBottom:'8px',
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
                    {/* Count indicator */}
      {!isLoading && counts[value] > 0 && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 0.5,
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
            </Box>
            
          </TabPanel>
        ))}
      </SwipeableViews>



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