import React, { useState, useEffect } from "react";
import { 
  Box, 
  useMediaQuery, 
  useTheme,
  Stack,
  Dialog,
  IconButton,
  Typography,
  Slide,
  Fade,
  Paper,
  Divider,
} from '@mui/material';
import Friend from './Friend';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import { API_BASE_URL } from "../../../util/io_utils/URL";
import Introductions from "../Introductions";
import { useNotification } from '../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../Themes/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

// Smooth slide transition for mobile fullscreen dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Friends(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode } = useThemeMode();
  const { showNotification } = useNotification();
  
  // State management
  const [selector, setSelector] = useState({ type: "userId", content: "null" });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogList, setDialogList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Dark mode enhanced colors
  const darkModeColors = {
    background: mode === 'dark' ? '#121212' : theme.palette.background.default,
    paper: mode === 'dark' ? '#1e1e1e' : theme.palette.background.paper,
    surface: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
    border: mode === 'dark' ? '#404040' : theme.palette.divider,
    text: {
      primary: mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
      secondary: mode === 'dark' ? '#b3b3b3' : theme.palette.text.secondary,
    },
    accent: mode === 'dark' ? '#bb86fc' : theme.palette.primary.main,
  };
  
  // Handle mobile selector changes
  useEffect(() => {
    if (isMobile && selector.content !== "null") {
      setShowMobileDetail(true);
    }
  }, [selector, isMobile]);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log("Friends component deregistered");
      setSelector(null);
    };
  }, []);
  
  // Fetch friends data when dialog opens
  useEffect(() => {
    if (!openDialog) return;
    
    const fetchFriends = async () => {
      if (!checkAuthentication()) return;
      
      setLoading(true);
      try {
        const response = await axios({
          url: `${API_BASE_URL}/friends/get_friends`,
          method: "post",
          data: {},
          headers: {
            "token": localStorage.getItem("token"),
          }
        });
        
        const friendsData = JSON.parse(response.data.message);
        console.log("Friends data loaded:", friendsData);
        setDialogList(friendsData);
        
      } catch (error) {
        console.error("Error fetching friends:", error);
        handleFetchError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriends();
  }, [openDialog]);
  
  // Enhanced error handling for fetch operations
  const handleFetchError = (error) => {
    if (error.response) {
      const message = error.response.data?.message || "Server error occurred";
      showNotification(`Server error: ${message}`, "error");
    } else if (error.request) {
      showNotification("Network error - please check your connection", "error");
    } else if (error.message?.includes("JSON")) {
      showNotification("Failed to parse server response", "error");
    } else {
      showNotification("Failed to fetch friends data", "error");
    }
  };
  
  // Handle friend selection toggling
  const handleToggleFriend = (friendId) => {
    setSelectedFriends(prevSelected => 
      prevSelected.includes(friendId)
        ? prevSelected.filter(id => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  // Validate group creation data
  const validateGroupData = () => {
    const trimmedName = groupName.trim();
    
    if (!trimmedName) {
      showNotification("Group name cannot be empty", "error");
      return false;
    }
    
    if (trimmedName.length < 2) {
      showNotification("Group name must be at least 2 characters long", "error");
      return false;
    }
    
    if (selectedFriends.length === 0) {
      showNotification("Please select at least one friend", "error");
      return false;
    }
    
    return true;
  };
  
  // Handle dialog close with state reset
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setGroupName("");
    setSelectedFriends([]);
  };

  // Handle mobile detail view navigation
  const handleBackToList = () => {
    setShowMobileDetail(false);
    setSelector({ type: "userId", content: "null" });
  };

  // Authentication check utility
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Authentication required. Please login again.", "error");
      return false;
    }
    return true;
  };

  // Handle dialog open with authentication
  const handleOpenDialog = () => {
    if (checkAuthentication()) {
      setOpenDialog(true);
    }
  };

  // Get display names for selected friends
  const getSelectedFriendNames = () => {
    return dialogList
      .filter(friend => selectedFriends.includes(friend.friendId))
      .map(friend => friend.name || friend.friendId);
  };

  return (
    <Stack 
      sx={{ 
        margin: isMobile ? '8px' : '12px',
        width: '100%',
        height: isMobile ? "calc(100vh - 64px - 24px)" : "calc(100vh - 64px - 78px)",
        padding: isMobile ? '0' : '0 8px',
        backgroundColor: darkModeColors.background,
        borderRadius: '12px',
        overflow: 'hidden',
      }} 
      direction={isMobile ? "column" : "row"} 
      spacing={2}
    > 
      {/* Enhanced Mobile Detail View Dialog */}
      {isMobile && (
        <Dialog
          open={showMobileDetail}
          onClose={handleBackToList}
          TransitionComponent={Transition}
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: darkModeColors.paper,
              backgroundImage: mode === 'dark' 
                ? 'linear-gradient(180deg, #1e1e1e 0%, #121212 100%)'
                : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
              width: '100%',
              height: '100%',
              borderRadius: 0,
            }
          }}
        >
          {/* Enhanced Dialog Header */}
          <Paper
            elevation={mode === 'dark' ? 0 : 1}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 2,
              backgroundColor: darkModeColors.paper,
              borderBottom: `1px solid ${darkModeColors.border}`,
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: darkModeColors.text.primary,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <PersonIcon sx={{ color: darkModeColors.accent }} />
              User Details
            </Typography>
            <IconButton 
              onClick={handleBackToList}
              sx={{
                color: darkModeColors.text.primary,
                backgroundColor: mode === 'dark' ? '#333' : '#f0f0f0',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#444' : '#e0e0e0',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Paper>
          
          {/* Dialog Content */}
          <Box sx={{ 
            height: 'calc(100vh - 72px)', 
            overflow: 'auto',
            backgroundColor: darkModeColors.background,
          }}>
            <Introductions 
              selector={selector} 
              handleBack={handleBackToList} 
              isMobile={isMobile}
              onError={(message) => showNotification(message || "Error loading user details", "error")} 
            />
          </Box>
        </Dialog>
      )}
      
      {/* Main Friends List Panel */}
      {!(!!isMobile && selector.content !== "null") && (
        <Fade in={true} timeout={600}>
          <Paper
            elevation={mode === 'dark' ? 0 : 2}
            sx={{
              width: isMobile ? 'calc(100% - 8px)' : '42%',
              marginRight: isMobile ? 1 : 2,
              backgroundColor: darkModeColors.paper,
              borderRadius: '16px',
              border: mode === 'dark' ? `1px solid ${darkModeColors.border}` : 'none',
              backgroundImage: mode === 'dark' 
                ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
            }}
          >              
            {/* Friends List Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${darkModeColors.border}`,
              backgroundColor: mode === 'dark' ? '#252525' : '#fafafa',
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: darkModeColors.text.primary,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <GroupIcon sx={{ color: darkModeColors.accent }} />
                Friends
              </Typography>
            </Box>
            
            {/* Friends Component */}
            <Box sx={{ height: 'calc(100% - 73px)', overflow: 'auto' }}>
              <Friend 
                setSelector={setSelector}
                onError={(message) => showNotification(message || "Error loading friends", "error")} 
              />
            </Box>
          </Paper>
        </Fade>
      )}
      
      {/* Desktop Detail Panel */}
      {selector.content !== "null" && !isMobile && (
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={400}
        >
          <Paper
            elevation={mode === 'dark' ? 0 : 2}
            sx={{
              flexGrow: 1,
              width: '58%',
              backgroundColor: darkModeColors.paper,
              borderRadius: '16px',
              border: mode === 'dark' ? `1px solid ${darkModeColors.border}` : 'none',
              backgroundImage: mode === 'dark' 
                ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {/* Detail Panel Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${darkModeColors.border}`,
              backgroundColor: mode === 'dark' ? '#252525' : '#fafafa',
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: darkModeColors.text.primary,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <PersonIcon sx={{ color: darkModeColors.accent }} />
                User Information
              </Typography>
            </Box>
            
            {/* Introductions Component */}
            <Box sx={{ height: 'calc(100% - 73px)', overflow: 'auto' }}>
              <Introductions 
                selector={selector} 
                position="right"
                onError={(message) => showNotification(message || "Error loading user details", "error")} 
              />
            </Box>
          </Paper>
        </Slide>
      )}
    </Stack>
  );
}