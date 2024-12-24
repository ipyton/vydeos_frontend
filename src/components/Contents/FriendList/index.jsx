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
//import FriendIntroductionCentered from '../Introductions/FriendIntroductionCentered';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Checkbox, FormControlLabel } from "@mui/material";

import Introductions from "../Introductions"
export default function Friends(props) {
  let list = [12, 12, 312, 4, 13, 4123, 5, 345, 34]
  let height = window.innerHeight * 0.8
  let [selector, setSelector] = React.useState({type:"userId", content:"null"})
  const position = "right"
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(()=>{
    return ()=>{
      console.log("deregister")
      setSelector(null)
    }
  },[])
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
    if (selectedFriends.length > 0) {
      //onCreateGroup(selectedFriends);
      //onClose(); // Close the dialog after creating the group
    }
  };
  const onClose = () => {

  }
  const friends = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
  ];
  return (
    <Stack sx={{ marginLeft: '10%', width: '80%', marginTop: 3, height: height }} direction="row" justify="center" spacing={2}>
      <Button variant="contained" onClick={()=>{setOpenDialog(true)}}>Create A Group</Button>

      <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}}>
        <DialogTitle>Select Friends to Create Group</DialogTitle>
        <DialogContent>
          <List>
            {friends.map((friend) => (
              <ListItem key={friend.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => handleToggleFriend(friend.id)}
                      name={friend.name}
                      color="primary"
                    />
                  }
                  label={friend.name}
                />
              </ListItem>
            ))}
          </List>
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
      <Friend setSelector={setSelector}></Friend>
      <Introductions selector={selector} position={"right"}></Introductions>
    </Stack>

  );
}