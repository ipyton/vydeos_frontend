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
import dynamic from 'next/dynamic';
import styles from '../../../styles/FriendList.module.css';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

// Dynamic imports for components
const Friend = dynamic(() => import('./Friend'));
const Introductions = dynamic(() => import('../Introductions'));

// Smooth slide transition for mobile fullscreen dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Friends(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State management
  const [selector, setSelector] = useState({ type: "userId", content: "null" });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogList, setDialogList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [loading, setLoading] = useState(false);
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
    }
  }, []);
  
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
    if (!isClient) return;
    
    if (isMobile && selector.content !== "null") {
      setShowMobileDetail(true);
    }
  }, [selector, isMobile, isClient]);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      setSelector(null);
    };
  }, []);
  
  // Fetch friends data when dialog opens
  useEffect(() => {
    if (!isClient || !openDialog) return;
    
    const fetchFriends = async () => {
      if (!checkAuthentication()) return;
      
      setLoading(true);
      try {
        // Mock API call for demo purposes
        // In a real app, you would call your API
        setTimeout(() => {
          const mockFriendsData = Array.from({ length: 10 }, (_, i) => ({
            friendId: `Friend_${i + 1}`,
            name: `Friend ${i + 1}`,
            relationship: Math.floor(Math.random() * 12) // Random relationship status
          }));
          
          setDialogList(mockFriendsData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching friends:", error);
        handleFetchError(error);
      }
    };
    
    fetchFriends();
  }, [openDialog, isClient]);
  
  // Enhanced error handling for fetch operations
  const handleFetchError = (error) => {
    console.error("Error:", error);
    showNotification(`Error: ${error.message || "Unknown error"}`, "error");
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
    if (!isClient) return false;
    
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

  // Mock notification function
  const showNotification = (message, severity) => {
    console.log(`[${severity}] ${message}`);
    // In a real app, you would use a notification system
  };

  // Don't render on server-side
  if (!isClient) {
    return null;
  }

  return (
    <Stack 
      className={`
        ${styles.container} 
        ${isMobile ? styles.containerMobile : styles.containerDesktop}
        ${mode === 'dark' ? styles.backgroundDark : styles.backgroundLight}
      `}
      direction={isMobile ? "column" : "row"} 
      spacing={2}
    > 
      {/* Enhanced Mobile Detail View Dialog */}
      {isMobile && (
        <Dialog
          open={showMobileDetail}
          onClose={handleBackToList}
          TransitionComponent={Transition}
          PaperProps={{
            className: mode === 'dark' ? styles.dialogPaperDark : styles.dialogPaperLight
          }}
        >
          {/* Enhanced Dialog Header */}
          <Paper
            elevation={mode === 'dark' ? 0 : 1}
            className={`${styles.dialogHeader} ${mode === 'dark' ? styles.dialogHeaderDark : styles.dialogHeaderLight}`}
          >
            <Typography 
              variant="h6"
              className={`${styles.dialogTitle} ${mode === 'dark' ? styles.dialogTitleDark : styles.dialogTitleLight}`}
            >
              <PersonIcon className={mode === 'dark' ? styles.dialogTitleIconDark : styles.dialogTitleIconLight} />
              User Details
            </Typography>
            <IconButton 
              onClick={handleBackToList}
              className={`${styles.closeButton} ${mode === 'dark' ? styles.closeButtonDark : styles.closeButtonLight}`}
            >
              <CloseIcon />
            </IconButton>
          </Paper>
          
          {/* Dialog Content */}
          <Box className={`${styles.dialogContent} ${mode === 'dark' ? styles.dialogContentDark : styles.dialogContentLight}`}>
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
            className={`
              ${styles.friendsPanel} 
              ${isMobile ? styles.friendsPanelMobile : styles.friendsPanelDesktop}
              ${mode === 'dark' ? styles.friendsPanelDark : styles.friendsPanelLight}
            `}
          >              
            {/* Friends List Header */}
            <Box className={`${styles.friendsHeader} ${mode === 'dark' ? styles.friendsHeaderDark : styles.friendsHeaderLight}`}>
              <Typography 
                variant="h6" 
                className={`${styles.friendsTitle} ${mode === 'dark' ? styles.friendsTitleDark : styles.friendsTitleLight}`}
              >
                <GroupIcon className={mode === 'dark' ? styles.friendsTitleIconDark : styles.friendsTitleIconLight} />
                Friends
              </Typography>
            </Box>
            
            {/* Friends Component */}
            <Box className={styles.friendsList}>
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
            className={`
              ${styles.detailPanel}
              ${mode === 'dark' ? styles.detailPanelDark : styles.detailPanelLight}
            `}
          >
            {/* Detail Panel Header */}
            <Box className={`${styles.detailHeader} ${mode === 'dark' ? styles.detailHeaderDark : styles.detailHeaderLight}`}>
              <Typography 
                variant="h6" 
                className={`${styles.detailTitle} ${mode === 'dark' ? styles.detailTitleDark : styles.detailTitleLight}`}
              >
                <PersonIcon className={mode === 'dark' ? styles.detailTitleIconDark : styles.detailTitleIconLight} />
                User Information
              </Typography>
            </Box>
            
            {/* Introductions Component */}
            <Box className={styles.detailContent}>
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