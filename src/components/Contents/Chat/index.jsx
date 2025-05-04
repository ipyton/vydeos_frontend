import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SideBar from './SideBar';
import MessageList from './MessageList';
import { fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { useEffect } from 'react';
import MessageUtil from '../../../util/io_utils/MessageUtil';
import localforage from 'localforage';
// import { useIsFocused } from '@react-navigation/native';
import { useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

export default function Chat(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  let height = window.innerHeight * 0.8
  //const isFocused = useIsFocused();
  
  let { refresh, sideBarSelector, setSideBarSelector } = props


  console.log(sideBarSelector)
  // const history = useLocation()
  console.log( "1" + "isMobile: " + isMobile + "sideBarSelector: " + (sideBarSelector === null) + "result: " + !(!!isMobile && (sideBarSelector===null)))

  console.log("2" + "isMobile: " + isMobile + "sideBarSelector: " + (sideBarSelector === null) + "result: " + (sideBarSelector===null))
  // userId
  return (
    <Stack 
      sx={{ 
        margin: isMobile ? '0' : '20px',
        marginTop: isMobile ? '0' : '20px',
        width: isMobile ? '100%' : '95%',
        height: isMobile ? '100vh' : height,
        padding: isMobile ? '0' : '0 20px',
      }} 
      direction={isMobile ? "column" : "row"} 
      spacing={2}
    >

      {!(!!isMobile && (!!sideBarSelector)) && (
        <SideBar 
          select={sideBarSelector} 
          setSelect={setSideBarSelector}
          isMobile={isMobile}
        />
      )}
      {!!(sideBarSelector) && (
        <MessageList 
          select={sideBarSelector} 
          setSelect={setSideBarSelector} 
          refresh={refresh}
          isMobile={isMobile}
        />
      )}
    </Stack>
  );
}
