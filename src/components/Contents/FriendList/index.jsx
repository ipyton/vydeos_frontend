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
          {/* <AppBar position="static" color="primary" elevation={0}>
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
          </AppBar> */}
          <Box sx={{ height: 'calc(100vh - 56px)', overflow: 'auto' }}>
            <Introductions selector={selector} handleBack={handleBackToList} isMobile={isMobile} />
          </Box>
        </Dialog>
      )}
      
      {!(!!isMobile && selector.content !== "null") && (
  <Fade in={true} timeout={500}>
    <div style={{ width: isMobile ? '100%' : '40%' }}>
      <Box sx={{ height: '100%' }}>
        <Button
          variant="contained"
          onClick={() => { setOpenDialog(true) }}
          sx={{ mb: 2, width: '100%' }}
        >
          Create A Group
        </Button>
        <Friend setSelector={setSelector} />
      </Box>
    </div>
  </Fade>
)}
      
      {selector.content !== "null" && (
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <div style={{ flexGrow: 1, width: isMobile ? '100%' : '50%' }}>
            <Introductions selector={selector} position="right" />
          </div>
        </Slide>
      )}
    </Stack>
  );
}