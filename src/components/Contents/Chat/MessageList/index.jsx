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
import RefreshIcon from '@mui/icons-material/Refresh';


export default function ChatContainer(props) {
  const { select, setSelect, isMobile } = props;
  const [chatRecords, setChatRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const refresh = useSelector((state) => state.refreshMessages.value.refresh);
  const { mode, toggleMode } = useThemeMode();
  const { showNotification } = useNotification();

  const handleBackClick = () => {
    setSelect(null);
  };

      const fetchMessages = async () => {
      // Validate if we have a valid selection
      if (!select || !select.type || !select.userId || select.type === "" || select.userId === "") {
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch message history
        const history = await DatabaseManipulator.getContactHistory(select.type, select.userId);
        setChatRecords(history);
        
        // Mark messages as read
        if (history.length > 0) {
          await MessageUtil.markAsRead(select.type, select.userId);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again.");
        
        // Show appropriate notification based on error type
        if (err.name === 'NetworkError' || err.message?.includes('network')) {
          showNotification("Network Error: Please check your connection", "error");
        } else if (err.name === 'DatabaseError' || err.message?.includes('database')) {
          showNotification("Database Error: Could not retrieve messages", "error");
        } else if (err.name === 'AuthorizationError' || err.message?.includes('permission')) {
          showNotification("Authorization Error: You don't have permission to view these messages", "error");
        } else {
          showNotification("Error loading messages. Please try again later.", "error");
        }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    
    fetchMessages();
  }, [select, refresh, showNotification]);

  const handleSendMessage = async (message) => {
    try {
      // Sending message logic here
      // This would be passed to your InputBox component
    } catch (error) {
      console.error("Error sending message:", error);
      showNotification("Failed to send message. Please try again.", "error");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      // Delete message logic here
    } catch (error) {
      console.error("Error deleting message:", error);
      showNotification("Failed to delete message. Please try again.", "error");
    }
  };
  
  if (!select || !select.type || !select.userId) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: isMobile ? 2 : 4,
          backgroundColor: mode === 'dark' ? '#121212' : '#f5f7fb',
          borderRadius: isMobile ? 0 : 2,
          width: "100%",
          height: "100%",
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
        height: isMobile ? "calc(100vh - 64px - 66px)" : "calc(100vh - 64px - 66px)",
        borderRadius: 0,
        position: 'relative',
        backgroundColor: mode === 'dark' ? '#121212' : '#f5f7fb'
      }}
    >
      {isMobile && (
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      
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
      ) : error ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            p: isMobile ? 2 : 3,
            height: isMobile ? 'calc(100vh - 120px)' : 'auto'
          }}
        >
          <Typography color="error.main">{error}</Typography>
          <Box sx={{ mt: 2 }}>
            <IconButton 
              onClick={() => {
                setLoading(true);
                setError(null);
                // Retry loading messages
                fetchMessages();
              }}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: isMobile ? 'calc(100vh - 120px)' : 'auto',
            paddingBottom: isMobile ? '20px' : '0'
          }}
        >
          <MessageList
            chatRecords={chatRecords}
            setChatRecords={setChatRecords}
            select={select}
            onDeleteError={(error) => {
              showNotification("Failed to delete message: " + error.message, "error");
            }}
          />
        </Box>
      )}
      
      <Box sx={{ 
        flexShrink: 0, 
        p: isMobile ? 1 : 2,
        backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        borderTop: isMobile ? '1px solid rgba(0,0,0,0.08)' : 'none'
      }}>
        <InputBox
          chatRecords={chatRecords}
          setChatRecords={setChatRecords}
          select={select}
          onSendError={(error) => {
            showNotification("Failed to send message: " + error.message, "error");
          }}
        />
      </Box>
    </Paper>
  );
}