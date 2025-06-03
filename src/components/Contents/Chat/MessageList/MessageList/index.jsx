import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { MessageBox } from "react-chat-elements";
import { useThemeMode } from "../../../../../Themes/ThemeContext";
import MessageBubble from "./ImprovedMessage";
export default function MessageList({ chatRecords, setChatRecords, select }) {
  const messagesEndRef = useRef(null);
  const { mode, toggleMode } = useThemeMode();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatRecords]);

  const handleDelete = (message) => {
    console.log("MessageList: handleDelete", message);
  }

  const handleWithdraw = (message) => {
    console.log("MessageList: handleWithdraw", message);
  }


  console.log("MessageList: chatRecords", chatRecords);
  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: mode === 'dark' ? '#2d2d2d' : '#f1f1f1',
        },
        "&::-webkit-scrollbar-thumb": {
          background: mode === 'dark' ? '#555' : '#888',
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: mode === 'dark' ? '#777' : '#555',
        },
      }}
    >
      {/* //  message, 
  isOwn = false, 
  timestamp, 
  senderName,
  darkMode = false,
  onDelete,
  onWithdraw */}
      {chatRecords.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          timestamp={message.timestamp}
          isOwn={message.userId !== select.userId}
          onDelete={handleDelete}
          onWithdraw={handleWithdraw}
          senderName={message.userId}
          darkMode={mode === 'dark'}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}