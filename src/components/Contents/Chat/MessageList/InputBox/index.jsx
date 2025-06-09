import TextField from '@mui/material/TextField';
import * as React from 'react';
import { Button, IconButton, Menu, MenuItem, Paper, Stack } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import YouTubeIcon from '@mui/icons-material/YouTube';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import MessageUtil from '../../../../../util/io_utils/MessageUtil';
import localforage from 'localforage';
import DatabaseManipulator from '../../../../../util/io_utils/DatabaseManipulator';
import { useNotification } from '../../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../../Themes/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import {update} from "../../../../redux/refreshMessages"


function compareStrings(str1, str2) {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') {
    throw new Error('Both inputs must be strings');
  }

  if (str1 < str2) {
    return { smaller: str1, larger: str2 };
  } else {
    return { smaller: str2, larger: str1 };
  }
}

export default function InputBox(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [text, setText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { select, setChatRecords,isMobile, chatRecords} = props;
  const open = Boolean(anchorEl);
  const inputRef = React.useRef(null);
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  const dispatcher = useDispatch()

  // Dynamic styles based on mode
  const paperStyles = {
    display: 'flex',
    alignItems: 'center',
  padding: isMobile ? '0px 6px' : '4px 8px',
  borderRadius: isMobile ? 16 : 20,
    minHeight: isMobile ? 36 : 'auto',

    boxShadow: mode === 'dark' 
      ? '0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(255,255,255,0.05)' 
      : '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    backgroundColor: mode === 'dark' ? '#2a2a2a' : '#ffffff',
    border: mode === 'dark' 
      ? '1px solid rgba(255,255,255,0.12)' 
      : '1px solid rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: mode === 'dark' ? '#323232' : '#fafafa',
      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
    }
  };

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    minHeight: isMobile ? '32px' : '40px',
    // Add padding control for the root
    padding: isMobile ? '3px 5px' : '4px 8px',
    '& fieldset': {
      border: 'none',
    },
    // ... rest of fieldset styles
    '& .MuiInputBase-input': {
      color: mode === 'dark' ? '#ffffff' : '#000000',
      // This targets the textarea specifically
      padding: isMobile ? '2px 2px' : '4px 0', // Reduce this even more
      margin: 0, // Remove any margin
      lineHeight: isMobile ? '1.1' : '1.4',
      '&::placeholder': {
        color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        opacity: 1,
      },
    },
    // Target the multiline input specifically
    '& .MuiInputBase-inputMultiline': {
      padding: isMobile ? '10px 0' : '16px 0',
      minHeight: isMobile ? '16px' : '20px',
      resize: 'none',
    }
  },
  flexGrow: 1,
}

  const iconButtonStyles = {
    color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    '&:hover': {
      backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
      color: mode === 'dark' ? '#ffffff' : '#1976d2',
    },
    transition: 'all 0.2s ease-in-out',
  };

  const sendButtonStyles = {
    backgroundColor: mode === 'dark' ? '#1565c0' : '#1976d2',
    color: 'white',
    marginLeft: 1,
    '&:hover': {
      backgroundColor: mode === 'dark' ? '#1976d2' : '#1565c0',
      transform: 'scale(1.05)',
    },
    '&:disabled': {
      backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
      color: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.26)',
    },
    transition: 'all 0.2s ease-in-out',
  };

  const menuStyles = {
    '& .MuiPaper-root': {
      backgroundColor: mode === 'dark' ? '#2a2a2a' : '#ffffff',
      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
      boxShadow: mode === 'dark' 
        ? '0 8px 32px rgba(0,0,0,0.5)' 
        : '0 8px 32px rgba(0,0,0,0.15)',
    },
    '& .MuiMenuItem-root': {
      color: mode === 'dark' ? '#ffffff' : '#000000',
      '&:hover': {
        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
      },
    },
  };

  const handleOpenAttachmentMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAttachmentMenu = () => {
    setAnchorEl(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!text.trim()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userId = await localforage.getItem("userId");
      
      if (!userId || !select) {
        console.error("Missing user ID or selected contact");
        return;
      }
      
      const response = await MessageUtil.sendMessage(userId, select, text, "text");

      if (response.data.result === true) {
  
        let direction = true
        const result = compareStrings(userId, select.userId)
        if (result.larger === userId) {
          direction = false
        }
        const message = {
          userId1: result.smaller,
          userId2: select.larger,
          direction:direction,
          content: text,
          type: select.type,
          timestamp: response.data.timestamp,
          messageId:response.data.messageId,
          sessionMessageId: response.data.sessionMessageId,
        };
        await DatabaseManipulator.addContactHistory(message);
        const senderId = direction ? result.larger : result.smaller
        message.senderId = senderId
        message.count = 0
        await DatabaseManipulator.addRecentContacts([message])
        dispatcher(update())

        setChatRecords([...chatRecords, message]); // Update chat records
        setText("");
        
        // Focus back on input
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        console.error("Failed to send message:", response.data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (type) => {
    setText(`{${type} attachment}`);
    handleCloseAttachmentMenu();
  };

  return (
    <Stack direction="row" sx={{ width: "100%", padding: isMobile ? '4px' : 0, // Reduce padding
 }} alignItems="center"   spacing={isMobile ? 0.5 : 1} // Reduce spacing between elements
>
      <Paper elevation={0} sx={paperStyles}>
        <IconButton
          sx={iconButtonStyles}
          aria-label="Attach files"
          aria-controls={open ? 'attachment-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleOpenAttachmentMenu}
            size={isMobile ? "small" : "medium"} // Add this line

        >
          <AttachFileIcon   size={isMobile ? "small" : "medium"}   />
        </IconButton>
        
        <TextField
          sx={textFieldStyles}
          placeholder="Type a message..."
          multiline
          maxRows={isMobile?1 : 4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyPress}
          inputRef={inputRef}
          fullWidth
          variant="outlined"
        />
        
        <IconButton
          sx={sendButtonStyles}
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          size={isMobile ? "small" : "medium"} 
        >
          <SendIcon size={isMobile ? "small" : "medium"} />
        </IconButton>
      </Paper>

      <Menu
        id="attachment-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseAttachmentMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={menuStyles}
      >
        <input id="uploadPic" type="file" accept="image/*" onChange={() => handleFileUpload('picture')} hidden />
        <input id="uploadVid" type="file" accept="video/*" onChange={() => handleFileUpload('video')} hidden />
        <input id="uploadVoi" type="file" accept="audio/*" onChange={() => handleFileUpload('voice')} hidden />

        <label htmlFor="uploadPic">
          <MenuItem>
            <AddPhotoAlternateIcon color="primary" sx={{ mr: 1 }} />
            Pictures
          </MenuItem>
        </label>

        <label htmlFor="uploadVid">
          <MenuItem>
            <YouTubeIcon color="error" sx={{ mr: 1 }} />
            Videos
          </MenuItem>
        </label>

        <label htmlFor="uploadVoi">
          <MenuItem>
            <KeyboardVoiceIcon color="success" sx={{ mr: 1 }} />
            Voice Messages
          </MenuItem>
        </label>
      </Menu>
    </Stack>
  );
}