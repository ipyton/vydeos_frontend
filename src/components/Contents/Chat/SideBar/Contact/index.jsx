import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { ListItemButton } from '@mui/material';


export default function Contact(props) {
  let { userId, name, avatar } = props.content
  console.log(props)
  let selected = props.selected
  
  function isSelected() {
    if (selected.type ==="userId") {
      return userId === selected.userId
    }
    else if (selected.type === "groupId") {
      return userId === selected.groupId

    }
    // 可以在这里添加更复杂的判断逻辑
    return userId === selected.userId;
  }


  return (
    <ListItemButton onClick={props.onClick} sx={{ width: "100%" }} selected={isSelected()}>
      <ListItem sx={{ width: "100%" }} >
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} secondary={userId} />
      </ListItem>
    </ListItemButton>
  )
}