import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SideBar from './SideBar';
import MessageList from './MessageList';
import { fireEvent } from '@testing-library/react';
import MessageUtil from '../../../util/io_utils/MessageUtil';
import localforage from 'localforage';
import { useLocation } from 'react-router-dom';
import { useNotification } from '../../../Providers/NotificationProvider';
import { useTheme, useMediaQuery, Fade, Slide } from '@mui/material';

export default function BotChat(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const [select, setSelect] = useState(null);
  const { showNotification } = useNotification();
  
  const [sessions, setSessions] = useState([
    { "sessionId": "aaaa", "title": "give me some suggestions", "timestamp": 19990816 }, 
    { "sessionId": "bbbb", "title": "give me some suggestions", "timestamp": 19990816 }
  ]);
  
  const [currentChatList, setCurrentList] = useState([
    { "role": "user", "content": "ask", "timestamp": 12312312 },
    { "role": "system", "content": "asaf", "timestamp": 12312312 }
  ]);

  useEffect(() => {
    // Effect logic when select changes
  }, [select]);

  return (
    <Stack 
      sx={{ 
        margin: isMobile ? '0' : '0px',
        marginTop: isMobile ? '0' : '20px',
        width: isMobile ? '100%' : '100%',
        height: isMobile ? "calc(100vh - 64px - 66px)" : "calc(100vh - 64px - 66px)",
        padding: isMobile ? '0' : '0 5px',
      }} 
      direction={isMobile ? "column" : "row"} 
      spacing={2}
    >
      {/* Sidebar with session list */}
      {!(!!isMobile && !!select) && (
        <Fade in={true} timeout={500}>
          <div style={{ width: isMobile ? '100%' : '40%' }}>
            <SideBar 
              select={select} 
              setSelect={setSelect} 
              sessions={sessions} 
              setSessions={setSessions}
              isMobile={isMobile}
            />
          </div>
        </Fade>
      )}
      
      {/* Message list/chat content */}
      {!!select && (
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <div style={{ flexGrow: 1, width: isMobile ? '100%' : '50%' }}>
            <MessageList 
              select={select} 
              setSelector={setSelect} 
              currentChatList={currentChatList} 
              setCurrentList={setCurrentList}
              isMobile={isMobile}
            />
          </div>
        </Slide>
      )}
    </Stack>
  );
}