import VideoCard from "./VideoCard"
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
export default function() {
    return (<Stack direction="row" spacing={2} sx={{marginLeft:"10%",width:"80%"}}>
         <Item><VideoCard></VideoCard></Item>
        <Item><VideoCard></VideoCard></Item>
        <Item><VideoCard></VideoCard></Item>
        <Item><VideoCard></VideoCard></Item>
    </Stack>)
}