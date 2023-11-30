import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SideBar from './SideBar';
import MessageList from './MessageList';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  overflow:"scroll"
}));

const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  }));
  

export default function Chat() {
  let height = window.innerHeight * 0.8
  console.log(height)
  return (
    <Stack sx={{marginLeft:'15%',width:'70%',marginTop:3, height:height, overflow:"hidden"}} direction="row" justify="center" spacing={2}>
      <SideBar></SideBar>
      <MessageList></MessageList>
    </Stack>
  );
}
