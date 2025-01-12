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
  let { chatRecords, setChatRecords, select } = props;

  console.log(chatRecords)
  const messagesEndRef = useRef(null)
  
  // useEffect(() => {
  //   console.log("messageList")
  //   //MessageUtil.getNewestMessages(select)
  //   // localforage.getItem("send_to_" + select).then(
  //   //   send_to => {
  //   //     localforage.getItem("send_from_" + select).then(
  //   //       async receive_from => {
  //   //         if (!send_to) {
  //   //           send_to = []
  //   //           await localforage.setItem("send_to_" + select, send_to)
  //   //         }
  //   //         if (!receive_from) {
  //   //           receive_from = []
  //   //           await localforage.setItem("send_from_" + select, receive_from)
  //   //         }
  //   //         let result = [...send_to, ...receive_from]
  //   //         result.sort((a, b) => {
  //   //           return a.sendTime - b.sendTime
  //   //         })
  //   //         setChatRecords(result)
  //   //       }
  //   //     )
  //   //   }
  //   // )

  // }, [select.groupId, select.userId])

  useEffect(()=> {
    if (!messagesEndRef || !messagesEndRef.current) return
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatRecords])
  
  if ( chatRecords && chatRecords.length === 0) {
    return <div>Start to chat</div>
  }

  console.log(chatRecords)
  return (
    <Stack sx={{ borderRadius: 2, overflow: 'scroll' }} >
      <div className="messagesWrapper" style={{ display: 'flex', flexDirection: 'column-reverse' }} >

        <div style={{ float: "left", clear: "both" }}
          ref={messagesEndRef} />
        {
          chatRecords.map((x, idx) => {
            console.log(x)
            return (<SingleMessage content={x} select = {select}></SingleMessage>)
          })
        }


    </div>

    </Stack>
  );
}