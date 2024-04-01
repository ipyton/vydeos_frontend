import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { ListItemButton } from '@mui/material';


export default function Contact(props) {
    let {date, content, name, avatar} = props.content
  return (     
    <ListItemButton onClick={props.onClick} sx={{width:"100%"}} >
    <ListItem sx={{width:"100%"}}>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={content} secondary={date} />
    </ListItem>
    </ListItemButton>
)
}