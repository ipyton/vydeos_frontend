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
  Fade
} from '@mui/material';
import Friend from './Friend';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import {API_BASE_URL} from "../../../util/io_utils/URL";
import Introductions from "../Introductions";
import { useNotification } from '../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../Themes/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';

// Transition for the mobile fullscreen dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
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
      // Optional: Redirect to login page
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

  return (
    <Stack 
      sx={{ 
        margin: isMobile ? '5px' : '5px',
        width: isMobile ? '100%' : '100%',
        height: isMobile ? "calc(100vh - 64px - 66px)" : "calc(100vh - 64px - 66px)",
        padding: isMobile ? '0' : '0 5px',
      }} 
      direction={isMobile ? "column" : "row"} 
      spacing={2}
    >
      {/* Group Creation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={onClose} 
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
            width: isMobile ? '100%' : '500px',
            maxHeight: isMobile ? '100%' : '80vh'
          },
        }}
      >
        <DialogTitle sx={{
          color: mode === 'dark' ? '#fff' : 'black',
        }}>Select Friends to Create Group</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : dialogList.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>No friends found. Add some friends first!</Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: '50vh', overflow: 'auto' }}>
              {dialogList.map((friend) => (
                <ListItem sx={{
                  color: mode === 'dark' ? '#fff' : 'black',
                }} key={friend.id || friend.friendId}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFriends.includes(friend.friendId)}
                        onChange={() => handleToggleFriend(friend.friendId)}
                        name={friend.name || friend.friendId}
                        color="primary"
                      />
                    }
                    label={friend.name || friend.friendId}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <TextField
            id="outlined-basic"
            label="Group Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={groupName}
            onChange={(res) => setGroupName(res.target.value)}
            error={groupName.trim() === ""}
            helperText={groupName.trim() === "" ? "Group name cannot be empty" : ""}
            sx={{
              input: {
                color: mode === 'dark' ? '#fff' : 'black',
              },
              label: {
                color: mode === 'dark' ? '#aaa' : 'black',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#2c2c2c' : '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#444' : '#bdbdbd',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: isMobile ? 2 : 1 }}>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup} 
            color="primary" 
            variant="contained"
            disabled={loading || selectedFriends.length === 0 || groupName.trim() === ""}
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
          <div style={{ width: isMobile ? '100%' : '40%' }}>
            <Box sx={{ height: '100%' }}>
              <Button
                variant="contained"
                onClick={handleOpenDialog}
                sx={{ mb: 2, width: '100%' }}
              >
                Create A Group
              </Button>
              <Friend 
                setSelector={setSelector}
                onError={(message) => showNotification(message || "Error loading friends", "error")} 
              />
            </Box>
          </div>
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