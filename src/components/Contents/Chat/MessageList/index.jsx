import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import Header from "./Header";
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import 'react-chat-elements/dist/main.css';
import MessageUtil from "../../../../util/io_utils/MessageUtil";
import DatabaseManipulator from "../../../../util/io_utils/DatabaseManipulator";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ChatContainer(props) {
  const { select, setSelect } = props;
  const [chatRecords, setChatRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const refresh = useSelector((state) => state.refreshMessages.value.refresh);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleBackClick = () => {
    // Handle back button click for mobile view
    if (typeof props.onBack === 'function') {
      props.onBack();
    }
  };

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [select.type, select.userId, refresh]);

  if (!select || !select.type || !select.userId) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          backgroundColor: '#f5f7fb',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
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
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: isMobile ? "100%" : "70%",
        borderRadius: isMobile ? 0 : 2
      }}
    >
      <Header selected={select} onBack={handleBackClick} />
      
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1
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
            p: 3,
            color: 'error.main'
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <MessageList
            chatRecords={chatRecords}
            setChatRecords={setChatRecords}
            select={select}
          />
        </Box>
      )}
      
      <Box sx={{ flexShrink: 0 }}>
        <InputBox
          chatRecords={chatRecords}
          setChatRecords={setChatRecords}
          select={select}
        />
      </Box>
    </Paper>
  );
}