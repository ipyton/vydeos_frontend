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
import { useRef } from 'react';
import { useEffect } from 'react';

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
  let { chatRecords, select } = props;


  if (!chatRecords || chatRecords.length === 0) {
    return <div>Start to chat</div>
  }
  const messagesEndRef = useRef(null)

  console.log(messagesEndRef)

  useEffect(()=> {
    if (!messagesEndRef) return
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatRecords])


  return (
    <Stack sx={{ borderRadius: 2, overflow: 'scroll' }} >
      <div className="messagesWrapper" >
        {
          chatRecords.map((x, idx) => {
            return (<SingleMessage content={x} select = {select}></SingleMessage>)
          })
        }

      <div style={{ float: "left", clear: "both" }}
        ref={messagesEndRef} />

    </div>

    </Stack>
  );
}