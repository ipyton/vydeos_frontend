import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Friend from './Friend';
import { Box } from '@mui/material';


export default function Friends(props) {
  let list = [12,12,312,4,13,4123,5,345,34]
  return (
    <Box display="flex" sx={{justifyContent:"center"}}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper',  }}>
      {list.map(x=>{ 
      return (<Friend></Friend>)
      })}
    </List>


    </Box>

  );
}