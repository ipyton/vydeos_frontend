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
  const [sideBarSelector, setSideBarSelector] = useState("")
  const afterGetting = () => {


  }

  useEffect(() => {
    localforage.getItem(
      "recent_contacts"
    ).then(res => {
      if (!res) res=[]
      localforage.getItem(
        "contactCursor"
      ).then(cursor => {
        if (!cursor) console.log("can not find the user")
        else {
          res.forEach((ele)=>{
            if (ele.userId === cursor) {
              res.splice()
              setUserRecords(res)
              return
            }
          })
          
          localforage.getItem("friendList").then(list => {
            if (!list) return
            res[cursor] = { "userId": list[cursor].userId, "userName": list[cursor].userName, "avatar": list[cursor].avatar }
            localforage.setItem("recent_contacts", res).then(() => {
              console.log("add success")
            }).then(async () => {
              await localforage.setItem("send_to_" + cursor, [])
              await localforage.setItem(cursor + "_record", [])

            })
          })
        }
      setUserRecords(res)
      })
    })

    //MessageUtil.getNewestMessages(userRecords, setUserRecords, chatRecords, setChatRecords, afterGetting);
  },[]);


  let friendList = [{ username: " ", userAvatar: "", recentMessages: [] }]
  // userId
  return (
    <Stack sx={{ marginLeft: '15%', width: '70%', marginTop: 3, height: height, }} direction="row" justify="center" spacing={2}>
      <SideBar select={sideBarSelector} setSelect={setSideBarSelector} userRecords={userRecords} setUserRecords={setUserRecords} ></SideBar>
      <MessageList select={sideBarSelector} setSelector={setSideBarSelector} ></MessageList>
    </Stack>
  );
}
