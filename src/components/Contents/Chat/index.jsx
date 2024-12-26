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




export default function Chat(props) {
  let height = window.innerHeight * 0.8
  //const isFocused = useIsFocused();
  
  let { refresh, sideBarSelector, setSideBarSelector, setChatRecords, chatRecords, userRecords, setUserRecords } = props

  console.log(props)

  // const history = useLocation()
  // console.log(history)


  // userId
  return (
    <Stack sx={{ marginLeft: '15%', width: '70%', height: height, }} direction="row" justify="center" spacing={2}>
      <SideBar select={sideBarSelector} setSelect={setSideBarSelector} userRecords={userRecords} setUserRecords={setUserRecords} ></SideBar>
      <MessageList select={sideBarSelector} setSelector={setSideBarSelector} refresh={refresh} chatRecords={chatRecords} setChatRecords={setChatRecords}></MessageList>
    </Stack>
  );
}
