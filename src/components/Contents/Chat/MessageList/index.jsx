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

export default function ChatContainer(props) {
  const { select, setSelect, isMobile } = props;
  const [chatRecords, setChatRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const refresh = useSelector((state) => state.refreshMessages.value.refresh);
  const theme = useTheme();

  const handleBackClick = () => {
    setSelect(null);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      // Validate if we have a valid selection
      if (!select || !select.type || !select.userId || select.type === "" || select.userId === "") {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: isMobile ? 2 : 4,
              backgroundColor: '#f5f7fb',
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [select.type, select.userId, refresh]);

  if (!select || !select.type || !select.userId) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
        height: isMobile ? "100vh" : "100%",
        borderRadius: 0,
        position: 'relative',
        backgroundColor: '#ffffff'
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
            color: 'error.main',
            height: isMobile ? 'calc(100vh - 120px)' : 'auto'
          }}
        >
          <Typography>{error}</Typography>
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
          />
        </Box>
      )}
      
      <Box sx={{ 
        flexShrink: 0, 
        p: isMobile ? 1 : 2,
        backgroundColor: '#ffffff',
        borderTop: isMobile ? '1px solid rgba(0,0,0,0.08)' : 'none'
      }}>
        <InputBox
          chatRecords={chatRecords}
          setChatRecords={setChatRecords}
          select={select}
        />
      </Box>
    </Paper>
  );
}