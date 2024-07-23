import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { ListItemButton } from '@mui/material';


export default function Session(props) {
  let { title, selected, sessionId, lastModified} = props

  return (
    <ListItemButton onClick={props.onClick} sx={{ width: "100%" }} selected={selected === sessionId}>
      <ListItem sx={{ width: "100%" }} >

        <ListItemText primary={title} secondary={lastModified} />
      </ListItem>
    </ListItemButton>
  )
}