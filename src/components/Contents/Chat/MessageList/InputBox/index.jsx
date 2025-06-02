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

export default function InputBox(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [text, setText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { select, setChatRecords } = props;
  const open = Boolean(anchorEl);
  const inputRef = React.useRef(null);
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();

  // Dynamic styles based on mode
  const paperStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: 20,
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
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
      '& .MuiInputBase-input': {
        color: mode === 'dark' ? '#ffffff' : '#000000',
        '&::placeholder': {
          color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          opacity: 1,
        },
      },
    },
    flexGrow: 1,
  };

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
        const message = {
          userId: userId,
          receiverId: select.userId,
          content: text,
          type: select.type,
          timestamp: response.data.timestamp
        };
        
        const records = await DatabaseManipulator.addContactHistory(message);
        setChatRecords(records);
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
    <Stack direction="row" sx={{ width: "100%", padding: 0 }} alignItems="center" spacing={1}>
      <Paper elevation={0} sx={paperStyles}>
        <IconButton
          sx={iconButtonStyles}
          aria-label="Attach files"
          aria-controls={open ? 'attachment-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleOpenAttachmentMenu}
        >
          <AttachFileIcon />
        </IconButton>
        
        <TextField
          sx={textFieldStyles}
          placeholder="Type a message..."
          multiline
          maxRows={4}
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
          size="medium"
        >
          <SendIcon />
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