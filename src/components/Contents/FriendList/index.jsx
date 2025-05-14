import React, { useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Friend from './Friend';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import FriendIntro from './FriendIntro';
import { useEffect } from 'react';
import axios from "axios";
import TextField from "@mui/material/TextField";
//import FriendIntroductionCentered from '../Introductions/FriendIntroductionCentered';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Checkbox, FormControlLabel } from "@mui/material";
import {API_BASE_URL, DOWNLOAD_BASE_URL} from "../../../util/io_utils/URL";

import Introductions from "../Introductions"
import { useNotification } from '../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../Themes/ThemeContext';

export default function Friends(props) {
  let list = [12, 12, 312, 4, 13, 4123, 5, 345, 34]
  let height = window.innerHeight * 0.8
  let [selector, setSelector] = React.useState({type:"userId", content:"null"})
  const position = "right"
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedGroupUser, setSelectedGroupUser] = useState([])
  const [dialogList, setDialogList] = useState([])
  const [groupName, setGroupName] = useState("")
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  useEffect(()=>{
    return ()=>{
      console.log("deregister")
      setSelector(null)
    }
  },[])
  useEffect(() => {
    if (openDialog) {
      axios({
        url: API_BASE_URL + "/friends/get_friends",
        method: "post",
        data: {},
        headers: {
          "token": localStorage.getItem("token"),
        }
      }).then((res)=>{
        console.log(JSON.parse(res.data.message))
        setDialogList(JSON.parse(res.data.message))
      })
    }
  }, [openDialog])
  let [index, setIndex] = React.useState(0)
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleToggleFriend = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

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
      }).then((res)=>{
        setOpenDialog(false)
        setGroupName("")
        setSelectedFriends([])
      })
    }
  };
  const onClose = () => {
    setOpenDialog(false)
  }

  return (
    <Stack sx={{ marginLeft: '10%', width: '80%', marginTop: 3, height: height }} direction="row" justify="center" spacing={2}>

      <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}} sx={{
        '& .MuiDialog-paper': {
          backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
        },
      }}>
        <DialogTitle sx={{
          color: mode === 'dark' ? '#fff' : 'black',
        }}>Select Friends to Create Group</DialogTitle>
        <DialogContent>
          <List>
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
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateGroup} color="primary" variant="contained">
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
      <Stack  sx={{width:"40%", height:"100%"}}>
        <Button variant="contained" onClick={() => { setOpenDialog(true) }}>Create A Group</Button>
        <Friend setSelector={setSelector}></Friend>
      </Stack>

      <Introductions selector={selector} position={"right"}></Introductions>
    </Stack>

  );
}