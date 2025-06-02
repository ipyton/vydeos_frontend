import React, { useState, useEffect } from "react";
import { 
  Box, 
  useMediaQuery, 
  useTheme,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Slide,
  Paper,
  Fade,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import Friend from './Friend';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import {API_BASE_URL} from "../../../util/io_utils/URL";
import Introductions from "../Introductions";
import { useNotification } from '../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../Themes/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

// Transition for the mobile fullscreen dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Friends(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const [selector, setSelector] = useState({type:"userId", content:"null"});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogList, setDialogList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  
  // Handle selector change for mobile view
  useEffect(() => {
    if (isMobile && selector.content !== "null") {
      setShowMobileDetail(true);
    }
  }, [selector, isMobile]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("deregister");
      setSelector(null);
    }
  }, []);
  
  // Fetch friends data when dialog opens
  useEffect(() => {
    if (openDialog) {
      setLoading(true);
      axios({
        url: API_BASE_URL + "/friends/get_friends",
        method: "post",
        data: {},
        headers: {
          "token": localStorage.getItem("token"),
        }
      })
      .then((res) => {
        try {
          const friendsData = JSON.parse(res.data.message);
          console.log(friendsData);
          setDialogList(friendsData);
        } catch (parseError) {
          console.error("Failed to parse friends data:", parseError);
          showNotification("Failed to load friends data", "error");
        }
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
        if (error.response) {
          // Server responded with an error status
          showNotification(`Server error: ${error.response.data.message || "Unknown error"}`, "error");
        } else if (error.request) {
          // Request made but no response received
          showNotification("Network error - please check your connection", "error");
        } else {
          // Error setting up the request
          showNotification("Failed to fetch friends", "error");
        }
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [openDialog, showNotification]);
  
  // Handle friend selection toggling
  const handleToggleFriend = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  // Validate group creation data
  const validateGroupData = () => {
    if (groupName.trim() === "") {
      showNotification("Group name cannot be empty", "error");
      return false;
    }
    
    if (selectedFriends.length === 0) {
      showNotification("Please select at least one friend", "error");
      return false;
    }
    
    return true;
  };

  // Handle group creation
  const handleCreateGroup = () => {
    if (!validateGroupData()) return;

    setLoading(true);
    axios({
      url: API_BASE_URL + "/group_chat/create",
      method: "post",
      data: {
        groupName: groupName,
        members: selectedFriends
      },
      headers: {
        "token": localStorage.getItem("token"),
      }
    })
    .then((res) => {
      if (res.data && res.data.success) {
        setOpenDialog(false);
        setGroupName("");
        setSelectedFriends([]);
        showNotification("Group created successfully", "success");
      } else {
        showNotification(res.data?.message || "Failed to create group", "error");
      }
    })
    .catch(err => {
      console.error("Group creation error:", err);
      if (err.response) {
        // Server responded with an error status
        showNotification(`Error: ${err.response.data?.message || "Failed to create group"}`, "error");
      } else if (err.request) {
        // Request made but no response received
        showNotification("Network error - please check your connection", "error");
      } else {
        // Error setting up the request
        showNotification("Failed to create group", "error");
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  // Handle dialog close
  const onClose = () => {
    setOpenDialog(false);
    setGroupName("");
    setSelectedFriends([]);
  };

  // Handle back button press on mobile detail view
  const handleBackToList = () => {
    setShowMobileDetail(false);
    setSelector({type:"userId", content:"null"});
  };

  // Handle if token is missing
  const checkAuthentication = () => {
    if (!localStorage.getItem("token")) {
      showNotification("Authentication required. Please login again.", "error");
      return false;
    }
    return true;
  };

  // Handle dialog open with authentication check
  const handleOpenDialog = () => {
    if (checkAuthentication()) {
      setOpenDialog(true);
    }
  };

  // Get selected friend names for display
  const getSelectedFriendNames = () => {
    return dialogList
      .filter(friend => selectedFriends.includes(friend.friendId))
      .map(friend => friend.name || friend.friendId);
  };

  return (
    <Stack 
      sx={{ 
        margin: isMobile ? '5px' : '5px',
        width: isMobile ? '100%' : '100%',
        height: isMobile ? "calc(100vh - 64px - 16px)" : "calc(100vh - 64px - 66px)",
        padding: isMobile ? '0' : '0 5px',
      }} 
      direction={isMobile ? "column" : "row"} 
      spacing={2}
    >
      {/* Enhanced Group Creation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={onClose} 
        fullScreen={isMobile}
        TransitionComponent={isMobile ? Transition : undefined}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
            backgroundImage: mode === 'dark' ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))' : 'none',
            width: isMobile ? '100%' : '500px',
            maxWidth: isMobile ? '100%' : '500px',
            maxHeight: isMobile ? '100%' : '85vh',
            borderRadius: isMobile ? 0 : '12px',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
          },
        }}
      >
        {/* Enhanced Dialog Header */}
        {isMobile && (
          <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
              backgroundColor: mode === 'dark' ? '#1e1e1e' : theme.palette.primary.main,
              borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : 'none'
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2, flex: 1, fontWeight: 600 }}>
                Create Group
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        
        {!isMobile && (
          <DialogTitle sx={{
            color: mode === 'dark' ? '#ffffff' : '#1a1a1a',
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
            borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 600,
            py: 2
          }}>
            <GroupIcon />
            Create New Group
          </DialogTitle>
        )}

        <DialogContent sx={{ 
          p: isMobile ? 2 : 3,
          backgroundColor: mode === 'dark' ? '#121212' : '#ffffff'
        }}>
          {/* Group Name Input */}
          <Box sx={{ mb: 3 }}>
            <TextField
              id="group-name-input"
              label="Group Name"
              variant="outlined"
              
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              error={groupName.trim() === "" && groupName !== ""}
              helperText={groupName.trim() === "" && groupName !== "" ? "Group name cannot be empty" : ""}
              sx={{
                marginTop: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  '& fieldset': {
                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiOutlinedInput-input': {
                  color: mode === 'dark' ? '#ffffff' : '#000000',
                },
              }}
            />
          </Box>

          {/* Selected Friends Chips */}
          {selectedFriends.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ 
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                mb: 1 
              }}>
                Selected ({selectedFriends.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {getSelectedFriendNames().map((name, index) => (
                  <Chip
                    key={index}
                    label={name}
                    size="small"
                    color="primary"
                    variant={mode === 'dark' ? 'filled' : 'outlined'}
                    sx={{
                      backgroundColor: mode === 'dark' ? 'rgba(144, 202, 249, 0.16)' : undefined,
                      borderColor: mode === 'dark' ? 'rgba(144, 202, 249, 0.5)' : undefined,
                      color: mode === 'dark' ? '#90caf9' : undefined,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Friends List */}
          <Box>
            <Typography variant="subtitle2" sx={{ 
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PersonIcon fontSize="small" />
              Select Friends
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress size={40} />
                <Typography sx={{ ml: 2, color: mode === 'dark' ? '#ffffff' : '#000000' }}>
                  Loading friends...
                </Typography>
              </Box>
            ) : dialogList.length === 0 ? (
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5',
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)'
              }}>
                <PersonIcon sx={{ fontSize: 48, color: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)', mb: 1 }} />
                <Typography sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                  No friends found. Add some friends first!
                </Typography>
              </Paper>
            ) : (
              <Paper sx={{ 
                maxHeight: isMobile ? '40vh' : '300px', 
                overflow: 'auto',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)'
              }}>
                <List sx={{ p: 0 }}>
                  {dialogList.map((friend, index) => (
                    <React.Fragment key={friend.id || friend.friendId}>
                      <ListItem 
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            backgroundColor: mode === 'dark' ? 'rgba(144, 202, 249, 0.16)' : theme.palette.primary.light,
                            color: mode === 'dark' ? '#90caf9' : theme.palette.primary.dark,
                            width: 40,
                            height: 40
                          }}>
                            {(friend.name || friend.friendId).charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={friend.name || friend.friendId}
                          sx={{
                            '& .MuiListItemText-primary': {
                              color: mode === 'dark' ? '#ffffff' : '#000000',
                              fontWeight: 500
                            }
                          }}
                        />
                        <Checkbox
                          checked={selectedFriends.includes(friend.friendId)}
                          onChange={() => handleToggleFriend(friend.friendId)}
                          color="primary"
                          sx={{
                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      </ListItem>
                      {index < dialogList.length - 1 && (
                        <Divider sx={{ 
                          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' 
                        }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: isMobile ? 2 : 3, 
          gap: 1,
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          borderTop: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)'
        }}>
          <Button 
            onClick={onClose} 
            sx={{ 
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              minWidth: 80
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup} 
            variant="contained"
            disabled={loading || selectedFriends.length === 0 || groupName.trim() === ""}
            startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{ 
              minWidth: 120,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:disabled': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Mobile Detail View as Dialog/Slide */}
      {isMobile && (
        <Dialog
          open={showMobileDetail}
          onClose={handleBackToList}
          TransitionComponent={Transition}
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
              width: '100%',
              height: '100%',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <Typography variant="h6">User Details</Typography>
            <IconButton onClick={handleBackToList}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ height: 'calc(100vh - 56px)', overflow: 'auto' }}>
            <Introductions 
              selector={selector} 
              handleBack={handleBackToList} 
              isMobile={isMobile}
              onError={(message) => showNotification(message || "Error loading user details", "error")} 
            />
          </Box>
        </Dialog>
      )}
      
      {!(!!isMobile && selector.content !== "null") && (
        <Fade in={true} timeout={500}>
          <Box
            sx={{
              width: isMobile ? 'calc(100% - 8px)' : '40%',
              marginRight: isMobile ? 1 : 1,
            }}
          >              
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              startIcon={<GroupIcon />}
              sx={{ 
                mb: 1, 
                width: isMobile ? '100%' : "100%",
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                background: mode === 'dark' 
                  ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                  : theme.palette.primary.main,
                '&:hover': {
                  background: mode === 'dark'
                    ? 'linear-gradient(45deg, #1976D2 30%, #0097A7 90%)'
                    : theme.palette.primary.dark,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Create A Group
            </Button>
            <Friend 
              setSelector={setSelector}
              onError={(message) => showNotification(message || "Error loading friends", "error")} 
            />
          </Box>
        </Fade>
      )}
      
      {selector.content !== "null" && !isMobile && (
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <div style={{ flexGrow: 1, width: isMobile ? '100%' : '50%' }}>
            <Introductions 
              selector={selector} 
              position="right"
              onError={(message) => showNotification(message || "Error loading user details", "error")} 
            />
          </div>
        </Slide>
      )}
    </Stack>
  );
}