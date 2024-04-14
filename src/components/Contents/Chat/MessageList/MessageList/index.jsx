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
import localforage from 'localforage';
import { Sort } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  textAlign: 'right',
  color: theme.palette.text.secondary,
  flexGrow: 2,
}));

export default function (props) {
  // record list.
  let { chatRecords } = props;



  if (!chatRecords || chatRecords.length === 0) {
    return <div>Start to chat</div>
  }



  return (
    <Stack sx={{ borderRadius: 2, boxShadow: 1, overflow: 'scroll' }} >
      {
        chatRecords.map((x, idx) => {
          let flag = "right"
          if (x % 2 == 0) {
            flag = "left";
          }
          return (<SingleMessage content={x} position={flag}></SingleMessage>)
        })
      }
    </Stack>
  );
}