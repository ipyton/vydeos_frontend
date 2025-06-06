import React, { useEffect, useRef, useState } from "react";
import { Box, Fab } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { MessageBox } from "react-chat-elements";
import { useThemeMode } from "../../../../../Themes/ThemeContext";
import MessageBubble from "./ImprovedMessage";

export default function MessageList({ chatRecords, setChatRecords, select }) {
  const messagesEndRef = useRef(null);
  const messagesStartRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { mode, toggleMode } = useThemeMode();
  
  // State for scroll position tracking
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isNearTop, setIsNearTop] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrollPosition = scrollTop;
    const maxScroll = scrollHeight - clientHeight;
    
    // Check if near top (within 100px)
    const nearTop = scrollPosition < 100;
    setIsNearTop(nearTop);
    
    // Check if near bottom (within 100px)
    const nearBottom = scrollPosition > maxScroll - 100;
    setIsNearBottom(nearBottom);
    
    // Show scroll to top button when scrolled down significantly
    setShowScrollToTop(scrollPosition > 300);
  };

  // Auto-scroll to bottom when new messages arrive, but only if user is near bottom
  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [chatRecords, isNearBottom]);

  // Load more messages when user scrolls to top
  useEffect(() => {
    if (isNearTop && chatRecords.length > 0) {
      // You can add logic here to load more historical messages
      console.log("Near top - could load more messages");
      // Example: loadMoreMessages();
    }
  }, [isNearTop, chatRecords.length]);

  const handleDelete = (message) => {
    console.log("MessageList: handleDelete", message);
  };

  const handleWithdraw = (message) => {
    console.log("MessageList: handleWithdraw", message);
  };

  console.log("MessageList: chatRecords", chatRecords);
  
  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
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
        {/* Invisible element to scroll to top */}
        <div ref={messagesStartRef} />
        
        {/* Loading indicator for top scroll */}
        {isNearTop && chatRecords.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              color: mode === 'dark' ? '#888' : '#666',
              fontSize: "0.8rem"
            }}
          >
            Scroll up to load more messages...
          </Box>
        )}

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
        
        {/* Invisible element to scroll to bottom */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Fab
          size="small"
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            opacity: 0.8,
            "&:hover": {
              opacity: 1,
            },
            backgroundColor: mode === 'dark' ? '#424242' : '#1976d2',
            color: mode === 'dark' ? '#fff' : '#fff',
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}

      {/* Optional: Scroll to Bottom Button (shows when not at bottom) */}
      {!isNearBottom && (
        <Fab
          size="small"
          color="secondary"
          aria-label="scroll to bottom"
          onClick={scrollToBottom}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            opacity: 0.8,
            "&:hover": {
              opacity: 1,
            },
            backgroundColor: mode === 'dark' ? '#616161' : '#dc004e',
            color: '#fff',
          }}
        >
          <KeyboardArrowUp sx={{ transform: 'rotate(180deg)' }} />
        </Fab>
      )}
    </Box>
  );
}