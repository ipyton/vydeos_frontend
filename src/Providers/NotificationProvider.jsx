import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Create Notification Context
const NotificationContext = createContext(null);

// Custom Hook for consuming notifications
export const useNotification = () => {return useContext(NotificationContext)};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
    vertical: "top", // Default position
    horizontal: "right", // Default position
  });

  // Function to show a notification with customizable position
  const showNotification = (message, type = "info", vertical = "top", horizontal = "right") => {
    setNotification({ open: true, message, type, vertical, horizontal });
  };

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: notification.vertical, horizontal: notification.horizontal }}
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleClose}
        key={notification.vertical + notification.horizontal}
      >
        <Alert onClose={handleClose} severity={notification.type} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
