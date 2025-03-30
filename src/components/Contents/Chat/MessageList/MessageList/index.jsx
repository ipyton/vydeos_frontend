import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { MessageBox } from "react-chat-elements";

export default function MessageList({ chatRecords, setChatRecords, select }) {
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatRecords]);

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
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },
      }}
    >
      {chatRecords.map((message, index) => (
        <MessageBox
          key={index}
          position={message.position}
          type={message.type}
          text={message.text}
          date={new Date(message.date)}
          title={message.title}
          data={message.data}
          status={message.status}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}