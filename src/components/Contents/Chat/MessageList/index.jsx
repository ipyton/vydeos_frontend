import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme, CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from "./Header";
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import 'react-chat-elements/dist/main.css';
import MessageUtil from "../../../../util/io_utils/MessageUtil";
import DatabaseManipulator from "../../../../util/io_utils/DatabaseManipulator";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useThemeMode } from "../../../../Themes/ThemeContext";
import { useNotification } from "../../../../Providers/NotificationProvider";


export default function ChatContainer(props) {
  const { select, setSelect, isMobile } = props;
  const [chatRecords, setChatRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageListLoading,setMessageListLoading] = useState(false)
  const location = useLocation();
  const refresh = useSelector((state) => state.refreshMessages.value.refresh);
  const { mode, toggleMode } = useThemeMode();
  const { showNotification } = useNotification();

  const handleBackClick = () => {
    setSelect(null);
  };

  // useEffect( () => {
  //   MessageUtil.markAsRead(select.type, select.userId,select.groupId);
  // }, [select, refresh, showNotification]);


  const handleDeleteMessage = async (messageId) => {
    try {
      // Delete message logic here
    } catch (error) {
      console.error("Error deleting message:", error);
      showNotification("Failed to delete message. Please try again.", "error");
    }
  };

  if (!select || !select.type ) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: isMobile ? 2 : 4,
          backgroundColor: mode === 'dark' ? '#121212' : '#f5f7fb',
          width: "100%",
          height: "100%",
          borderRadius: 1
        }}
      >
        <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary" gutterBottom>
          Select a conversation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose a contact from the list to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
        height: isMobile ? "calc(100vh - 64px - 2px)" : "calc(100vh - 64px - 66px)",
        paddingTop: isMobile ? 2 : 0,
        borderRadius: 2,
        position: 'relative',
        backgroundColor: mode === 'dark' ? '#121212' : '#f5f7fb'
      }}
    >
      <Header selected={select} onBack={handleBackClick} />
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            height: isMobile ? 'calc(100vh - 120px)' : 'auto'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: isMobile ? 'calc(100vh - 128px)' : 'auto',
            paddingBottom: isMobile ? '10px' : '0',
            borderRadius: "8px",
          }}
        >
          <MessageList
            chatRecords={chatRecords}
            setChatRecords={setChatRecords}
            select={select}
            onDeleteError={(error) => {
              showNotification("Failed to delete message: " + error.message, "error");
            }}
            setLoading={setMessageListLoading}
            isLoading={messageListLoading}
          />
        </Box>
      )}
      <Box sx={{
        flexShrink: 0,
        p: isMobile ? 1 : 2,
        backgroundColor: 'transparent', // 或者 'rgba(255, 255, 255, 0.5)' 之类的透明色
        borderTop: isMobile ? '1px solid rgba(0,0,0,0.08)' : 'none'
      }}>
        <InputBox
          chatRecords={chatRecords}
          setChatRecords={setChatRecords}
          select={select}
          isMobile={isMobile}
          onSendError={(error) => {
            showNotification("Failed to send message: " + error.message, "error");
          }}
        />
      </Box>
    </Paper>
  );
}