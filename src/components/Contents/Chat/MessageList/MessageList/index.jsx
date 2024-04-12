import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements'
import { useState } from 'react';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import SingleMessage from './SingleMessage';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  textAlign: 'right',
  color: theme.palette.text.secondary,
  flexGrow: 2,
}));

export default function (props ) {
  let messages = props.chatRecords;
  console.log(messages);
  let setMessages = props.setChatRecords;
  return (
    <Stack sx={{ borderRadius: 2,boxShadow:1, overflow:'scroll'}} >
          {
      messages.map((x,idx)=>{
        let flag = "right"
        if (x % 2 ==0) {
          flag = "left";
        }
			return (<SingleMessage content={x} position = {flag}></SingleMessage>)
		})
  }
    </Stack>
  );
}