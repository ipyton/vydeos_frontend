import TextField from '@mui/material/TextField';
import * as React from 'react';
import { Button, IconButton, Menu, MenuItem, Paper, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import YouTubeIcon from '@mui/icons-material/YouTube';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import MessageUtil from '../../../../../util/io_utils/MessageUtil';
import localforage from 'localforage';
import DatabaseManipulator from '../../../../../util/io_utils/DatabaseManipulator';
import { useNotification } from '../../../../../Providers/NotificationProvider';

// Styled components
const StyledPaper = styled(Paper)(({ theme, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: 20,
  boxShadow: theme => theme.palette.mode === 'dark' ? '0 2px 5px rgba(255,255,255,0.05)' : '0 2px 5px rgba(0,0,0,0.1)',
  width: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
  borderTop: isMobile ? `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` : 'none'
}));

const StyledTextField = styled(TextField)({
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
  },
  flexGrow: 1,
});

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  marginLeft: theme.spacing(1),
}));

export default function InputBox(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [text, setText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { select, setChatRecords } = props;
  const open = Boolean(anchorEl);
  const inputRef = React.useRef(null);
  const { showNotification } = useNotification();

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
    <Stack direction="row" sx={{ width: "100%", padding: 2 }} alignItems="center" spacing={1}>
      <StyledPaper elevation={0} isMobile={window.innerWidth <= 768}>
        <IconButton
          color="primary"
          aria-label="Attach files"
          aria-controls={open ? 'attachment-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleOpenAttachmentMenu}
        >
          <AttachFileIcon />
        </IconButton>
        
        <StyledTextField
          placeholder="Type a message..."
          multiline
          maxRows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyPress}
          inputRef={inputRef}
          fullWidth
        />
        
        <SendButton
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          size="medium"
        >
          <SendIcon />
        </SendButton>
      </StyledPaper>

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