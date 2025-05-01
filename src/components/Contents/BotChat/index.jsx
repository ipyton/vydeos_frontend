import Chat from "../Chat";
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
import { useNotification } from '../../../Providers/NotificationProvider'; 


export default function BotChat(props) {
    let height = window.innerHeight * 0.8
    //const isFocused = useIsFocused();
  const { showNotification } = useNotification();

    let [select,setSelect] = useState()
    useEffect(()=> {
        
    },[select])
    let [sessions, setSessions] = useState([{ "sessionId": "aaaa", "title": "give me some suggestions","timestamp":19990816 }, { "sessionId": "bbbb", "title": "give me some suggestions", "timestamp":19990816 }])
    let [currentChatList, setCurrentList] = useState([{ "role": "user", "content": "ask", "timestamp": 12312312 },{ "role": "system", "content": "asaf", "timestamp": 12312312 }])


    return (
        <Stack sx={{ marginLeft: '15%', width: '70%', height: height, }} direction="row" justify="center" spacing={2}>
            <SideBar select={select} setSelect={setSelect} sessions={sessions} setSessions={setSessions} ></SideBar>
            <MessageList select={select} setSelector={setSelect}  currentChatList={currentChatList} setCurrentList={setCurrentList}></MessageList>
        </Stack>
    );
}