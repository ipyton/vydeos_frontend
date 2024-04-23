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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  overflow: "scroll"
}));

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));


export default function Chat(props) {
  let height = window.innerHeight * 0.8
  const [userRecords, setUserRecords] = useState([])
  let { refresh,sideBarSelector, setSideBarSelector} = props
  const afterGetting = () => {


  }




  // userId
  return (
    <Stack sx={{ marginLeft: '15%', width: '70%', height: height, }} direction="row" justify="center" spacing={2}>
      <SideBar select={sideBarSelector} setSelect={setSideBarSelector} userRecords={userRecords} setUserRecords={setUserRecords} ></SideBar>
      <MessageList select={sideBarSelector} setSelector={setSideBarSelector} refresh={refresh} ></MessageList>
    </Stack>
  );
}
