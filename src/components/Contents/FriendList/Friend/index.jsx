import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import FriendItem from './FriendItem';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';


export default function(props) {
    let  a=[1,1,1,1,1,1,1,1,6,6,6,6,6]
    return (<Stack sx={{width:"30%", boxShadow:1,  borderRadius: 2}} spacing={2}>

    <List sx={{ width: '100%', bgcolor: 'background.paper',overflow:'scroll'}}>
    {a.map(()=>{return <FriendItem></FriendItem>})}
    </List>

</Stack>)
}