import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { ListItemButton } from '@mui/material';


export default function Contact(props) {
  let { userId, name, avatar } = props.content
  let selected = props.selected

  return (
    <ListItemButton onClick={props.onClick} sx={{ width: "100%" }} selected={selected === userId}>
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