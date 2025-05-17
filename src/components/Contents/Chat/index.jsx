import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SideBar from './SideBar';
import MessageList from './MessageList';
import { useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
export default function Chat(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  let height = window.innerHeight * 0.8;
  
  let { refresh, sideBarSelector, setSideBarSelector } = props;

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
      {!(!!isMobile && (!!sideBarSelector)) && (
        <Fade in={true} timeout={500}>
          <div style={{ width: isMobile ? '100%' : '40%' }}> {/* Fixed width for sidebar container */}
            <SideBar
              select={sideBarSelector}
              setSelect={setSideBarSelector}
              isMobile={isMobile}
            />
          </div>
        </Fade>
      )}
      
      {!!(sideBarSelector) && (
        <Slide
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <div style={{ flexGrow: 1, width: isMobile ? '100%' : '50%' }}> {/* Adjusted width for message list */}
            <MessageList
              select={sideBarSelector}
              setSelect={setSideBarSelector}
              refresh={refresh}
              isMobile={isMobile}
            />
          </div>
        </Slide>
      )}
    </Stack>
  );
}