import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import dynamic from 'next/dynamic';
import { useSelector } from "react-redux";
import { useThemeMode } from "../../../../contexts/ThemeContext";
import { useNotification } from "../../../../contexts/NotificationProvider";

// Dynamically import components that rely on browser APIs
const Header = dynamic(() => import("./Header"), { ssr: false });
const MessageListComponent = dynamic(() => import("./MessageList"), { ssr: false });
const InputBox = dynamic(() => import("./InputBox"), { ssr: false });

export default function ChatContainer(props) {
  const { select, setSelect, isMobile, markAsRead } = props;
  const [chatRecords, setChatRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageListLoading, setMessageListLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const refresh = useSelector((state) => state.refreshMessages?.value?.refresh || 0);
  const { mode } = useThemeMode();
  const { showNotification } = useNotification();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBackClick = () => {
    setSelect(null);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!isMounted) return;
    
    try {
      // Delete message logic here
      // This would be implemented with your DatabaseManipulator or API calls
    } catch (error) {
      console.error("Error deleting message:", error);
      showNotification("Failed to delete message. Please try again.", "error");
    }
  };

  // If not mounted yet or running on server, return minimal skeleton
  if (!isMounted || typeof window === 'undefined') {
    return (
      <Paper 
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: "100%",
          height: "100%",
          borderRadius: 2,
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          backgroundColor: mode === 'dark' ? '#121212' : '#f5f7fb'
        }}
      >
        <CircularProgress size={28} />
      </Paper>
    );
  }

  // If no selection, show prompt to select a conversation
  if (!select || !select.type) {
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
          <MessageListComponent
            chatRecords={chatRecords}
            setChatRecords={setChatRecords}
            select={select}
            onDeleteError={(error) => {
              showNotification("Failed to delete message: " + error.message, "error");
            }}
            setLoading={setMessageListLoading}
            isLoading={messageListLoading}
            markAsRead={markAsRead}
          />
        </Box>
      )}
      <Box sx={{
        flexShrink: 0,
        p: isMobile ? 1 : 2,
        backgroundColor: 'transparent',
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