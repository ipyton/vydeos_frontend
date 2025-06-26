import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector, useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';

// Base components
import NotFound from "../Errors/NotFoundError";
import NetworkError from "../Errors/NetworkError";
import Header from "../Header";

// CSS
import styles from "../../styles/Contents.module.css";

// Material UI imports
import { Snackbar as MuiSnackbar } from '@mui/material';

// Redux
import { update as updateSideBar } from "../redux/refreshSideBar";
import { update as updateMailBox } from "../redux/refreshMailBox";
import { update as updateMessages } from "../redux/refreshMessages";

// Dynamic imports for client-side only components
const UserInfo = dynamic(() => import('./UserInfo'), { ssr: false });
const TextEditor = dynamic(() => import('./TextEditor'), { ssr: false });
const Chat = dynamic(() => import('./Chat'), { ssr: false });
const Settings = dynamic(() => import('./Settings'), { ssr: false });
const AppStore = dynamic(() => import('./AppStore'), { ssr: false });

// Context
import { useNotification } from '../../contexts/NotificationProvider';

const defaultTheme = createTheme();

export default function Contents(props) {
  // Router
  const router = useRouter();
  const { pathname } = router;

  // State
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: "helloworld"
  });

  const { setLogin } = props;
  const [avatar, setAvatar] = React.useState(null);
  const [badgeContent, setBadgeContent] = React.useState([]);
  const [networkStatus, setNetworkStatus] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [userRecords, setUserRecords] = React.useState([]);
  const [sideBarSelector, setSideBarSelector] = React.useState();

  // Redux
  const refresh = useSelector((state) => state.refreshMessages?.value?.refresh);
  const dispatcher = useDispatch();

  // Notification context
  const { showNotification } = useNotification();

  // Destructure state
  const { vertical, horizontal, open, message } = state;
  
  // Handle snackbar close
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  // Message handlers
  const singleMessageHandler = (message) => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const senderId = message.direction === true ? message.userId1 : message.userId2;
    const receiverId = message.direction === true ? message.userId2 : message.userId1;
    message.senderId = senderId;
    message.receiverId = receiverId;

    // Import DatabaseManipulator dynamically to avoid SSR issues
    import('../../utils/DatabaseManipulator').then((module) => {
      const DatabaseManipulator = module.default;
      DatabaseManipulator.addContactHistories([message]).then(() => {
        DatabaseManipulator.insertUnreadMessages([message]).then(() => {
          DatabaseManipulator.addRecentContacts([message]).then(() => {
            dispatcher(updateMailBox());
            dispatcher(updateMessages());
            dispatcher(updateSideBar());
          });
        });
      });
    });
  };

  const groupMessageHandler = (message) => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const sender = message.userId;
    const receiver = localStorage.getItem("userEmail");
    message.receiver = receiver;
    message.groupId = message.groupId;
    
    // Import DatabaseManipulator dynamically to avoid SSR issues
    import('../../utils/DatabaseManipulator').then((module) => {
      const DatabaseManipulator = module.default;
      DatabaseManipulator.addContactHistories([message]).then(() => {
        DatabaseManipulator.insertUnreadMessages([message]).then(() => {
          DatabaseManipulator.addRecentContacts([message]).then(() => {
            dispatcher(updateMailBox());
            dispatcher(updateMessages());
            dispatcher(updateSideBar());
          });
        });
      });
    });
  };

  const handleMessage = (message) => {
    if (message.type === "single") {
      singleMessageHandler(message);
    } else if (message.type === "group") {
      groupMessageHandler(message);
    }
  };

  // WebWorker setup for notifications
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const worker = new Worker("/webworkers/NotificationReceiver.js", { type: 'module' });

    // Set token
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      worker.postMessage({ action: "setToken", key: userId, value: token });
    }

    // Listen for messages
    worker.onmessage = (event) => {
      const { action, data } = event.data;

      if (action === "messageReceived") {
        handleMessage(JSON.parse(data));
      }
    };

    // Error handling
    worker.onerror = (event) => {
      console.error("Worker error:", event);
    };

    // Cleanup
    return () => {
      worker.terminate();
    };
  }, []);

  // Mark messages as read
  const markAsRead = (type, userId, groupId) => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Import MessageUtil dynamically
    import('../../utils/MessageUtil').then((module) => {
      const MessageUtil = module.default;
      MessageUtil.markAsRead(type, userId, groupId).then((res) => {
        if (res && res.data && res.data.code === 0) {
          // Import DatabaseManipulator dynamically
          import('../../utils/DatabaseManipulator').then((module) => {
            const DatabaseManipulator = module.default;
            DatabaseManipulator.changeCountOfRecentContact(type, userId, groupId, 0).then(() => {
              DatabaseManipulator.deleteUnreadMessage(type, groupId, userId).then(() => {
                dispatcher(updateMailBox());
                dispatcher(updateSideBar());
              });
            });
          });
        } else {
          showNotification("Failed to mark as read", "error");
        }
      });
    });
  };

  // Initialize messages
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Import MessageUtil dynamically
    import('../../utils/MessageUtil').then((module) => {
      const MessageUtil = module.default;
      MessageUtil.getUnreadMessages().then((res) => {
        if (res && res.data && res.data.code === 0) {
          // Import DatabaseManipulator dynamically
          import('../../utils/DatabaseManipulator').then((module) => {
            const DatabaseManipulator = module.default;
            DatabaseManipulator.clearUnreadMessages().then(() => {
              const messages = JSON.parse(res.data.message);
              DatabaseManipulator.initUnreadMessages(messages).then(() => {
                DatabaseManipulator.initRecentContacts(messages).then(() => {
                  setNotifications(messages);
                  dispatcher(updateMailBox());
                  dispatcher(updateSideBar());
                });
              });
            });
          });
        } else {
          showNotification("Failed to fetch unread messages", "error");
        }
      });
    });
  }, []);

  // Render appropriate component based on route
  const renderContent = () => {
    const path = router.pathname;
    
    switch (path) {
      case '/':
        return <Item barState={state} setBarState={setState} status={props} />;
      case '/userinfo':
        return <UserInfo barState={state} setBarState={setState} status={props} />;
      case '/editor':
        return <TextEditor barState={state} setBarState={setState} status={props} />;
      case '/chat':
        return <Chat 
          barState={state} 
          setBarState={setState} 
          status={props}
          sideBarSelector={sideBarSelector} 
          setSideBarSelector={setSideBarSelector}  
          markAsRead={markAsRead}
        />;
      case '/settings':
        return <Settings barState={state} setBarState={setState} status={props} />;
      case '/appstore':
        return <AppStore barState={state} setBarState={setState} status={props} />;
      case '/notfound':
      case '/error':
        return <NetworkError barState={state} setBarState={setState} status={props} />;
      default:
        return <NotFound barState={state} setBarState={setState} status={props} />;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <Header 
          avatar={avatar} 
          setAvatar={setAvatar} 
          setLogin={setLogin} 
          markAsRead={markAsRead}
        />
        <Box width="calc(100% - 64px)" justifyContent="center" alignItems="center" marginTop="64px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
              <div>
                {renderContent()}
              </div>
              <div>
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={open}
                  onClose={handleClose}
                  message={message}
                  key={vertical + horizontal}
                />
              </div>
            </div>
          </LocalizationProvider>
        </Box>
      </Box>
    </ThemeProvider>
  );
} 