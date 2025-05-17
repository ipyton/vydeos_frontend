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
  Slide
} from '@mui/material';
import Friend from './Friend';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import {API_BASE_URL} from "../../../util/io_utils/URL";
import Introductions from "../Introductions";
import { useNotification } from '../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../Themes/ThemeContext';

// Transition for the mobile fullscreen dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function Friends(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const height = window.innerHeight * 0.8;
  const [selector, setSelector] = useState({type:"userId", content:"null"});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogList, setDialogList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  
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
      axios({
        url: API_BASE_URL + "/friends/get_friends",
        method: "post",
        data: {},
        headers: {
          "token": localStorage.getItem("token"),
        }
      }).then((res) => {
        console.log(JSON.parse(res.data.message));
        setDialogList(JSON.parse(res.data.message));
      });
    }
  }, [openDialog]);
  
  // Handle friend selection toggling
  const handleToggleFriend = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  // Handle group creation
  const handleCreateGroup = () => {
    if (selectedFriends.length > 0 && groupName.length !== 0) {
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
      }).then((res) => {
        setOpenDialog(false);
        setGroupName("");
        setSelectedFriends([]);
        showNotification("Group created successfully", "success");
      }).catch(err => {
        showNotification("Failed to create group", "error");
      });
    }
  };
  
  // Handle dialog close
  const onClose = () => {
    setOpenDialog(false);
  };

  // Handle back button press on mobile detail view
  const handleBackToList = () => {
    setShowMobileDetail(false);
    setSelector({type:"userId", content:"null"});
  };

  return (
    <Stack 
      sx={{ 
        width: isMobile ? '100%' : '80%', 
        marginLeft: isMobile ? '0' : '10%',
        marginTop: 2, 
        height: height,
        padding: isMobile ? 1 : 3
      }} 
      direction={isMobile ? "column" : "row"} 
      spacing={2}
    >
      {/* Group Creation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => {setOpenDialog(false)}} 
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
          <List sx={{ maxHeight: '50vh', overflow: 'auto' }}>
            {dialogList.map((friend) => (
              <ListItem sx={{
                color: mode === 'dark' ? '#fff' : 'black',
              }} key={friend.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFriends.includes(friend.friendId)}
                      onChange={() => handleToggleFriend(friend.friendId)}
                      name={friend.name}
                      color="primary"
                    />
                  }
                  label={friend.friendId}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            id="outlined-basic"
            label="Group Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(res) => setGroupName(res.target.value)}
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
            disabled={selectedFriends.length === 0 || groupName.length === 0}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Mobile Detail View as Dialog/Slide */}
      {isMobile && (
        <Dialog
          fullScreen
          open={showMobileDetail}
          onClose={handleBackToList}
          TransitionComponent={Transition}
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
            }
          }}
        >
          <AppBar position="static" color="primary" elevation={0}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleBackToList}
                aria-label="back"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ ml: 1, flex: 1 }}>
                User Details
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ height: 'calc(100vh - 56px)', overflow: 'auto' }}>
            <Introductions selector={selector} position="bottom" isMobile={true} />
          </Box>
        </Dialog>
      )}
      
      {/* Main Content Layout */}
      <Box sx={{
        display: isMobile && showMobileDetail ? 'none' : 'block',
        width: "100%",
      }}>
        <Stack sx={{
          width: isMobile ? "100%" : "40%", 
          height: isMobile ? "100%" : "100%",
          minHeight: "300px",
          float: isMobile ? 'none' : 'left'
        }}>
          <Button 
            variant="contained" 
            onClick={() => { setOpenDialog(true) }}
            sx={{ mb: 2 }}
          >
            Create A Group
          </Button>
          <Friend setSelector={setSelector} />
        </Stack>

        {!isMobile && (
          <Box sx={{ 
            width: "58%",
            height: "100%",
            minHeight: "300px",
            float: 'right'
          }}>
            <Introductions selector={selector} position="right" />
          </Box>
        )}
      </Box>
    </Stack>
  );
}