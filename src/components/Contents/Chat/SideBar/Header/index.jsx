import * as React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Chip,
  Alert
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChatIcon from '@mui/icons-material/Chat';
import { useThemeMode } from '../../../../../Themes/ThemeContext';

export default function Header() {
  const { mode } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = React.useState('');
  const [showGroupInfo, setShowGroupInfo] = React.useState(false);
  const [groupInfo, setGroupInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRefs = React.useRef([]);
  const open = Boolean(anchorEl);

  const handleAddClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddGroup = () => {
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setShowGroupInfo(false);
    setCode(['', '', '', '', '', '']);
    setCodeError('');
    setGroupInfo(null);
    setActiveIndex(0);
  };

  const validateCode = (inputCode) => {
    const codeString = Array.isArray(inputCode) ? inputCode.join('') : inputCode;
    const regex = /^[a-zA-Z0-9]{6}$/;
    return regex.test(codeString);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);
    setCodeError('');

    // Auto-focus next input
    if (value && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text').toUpperCase().slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedText.length && i < 6; i++) {
      if (/[A-Z0-9]/.test(pastedText[i])) {
        newCode[i] = pastedText[i];
      }
    }
    
    setCode(newCode);
    const lastFilledIndex = Math.min(pastedText.length - 1, 5);
    setActiveIndex(lastFilledIndex);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const mockGroupData = {
    'ABC123': {
      type: 'group',
      name: 'React Developers',
      introduction: 'A community for React developers to share knowledge, discuss best practices, and collaborate on projects.',
      avatar: 'https://via.placeholder.com/60/4CAF50/white?text=RD',
      memberCount: 1247,
      isPublic: true
    }
  };

  const handleSearchGroup = async () => {
    const codeString = code.join('');
    if (!validateCode(codeString)) {
      setCodeError('Please fill in all 6 characters (letters and numbers only)');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundGroup = mockGroupData[codeString];
      if (foundGroup) {
        setGroupInfo(foundGroup);
        setShowGroupInfo(true);
      } else {
        setCodeError('Group/User not found with this code');
      }
      setLoading(false);
    }, 1000);
  };

  const handleJoin = () => {
    // Add your join logic here
    console.log('Joining:', groupInfo);
    // You might want to call an API to join the group/add the user
    handleDialogClose();
    // Show success message or navigate to the group/conversation
  };

  const handleNewConversation = () => {
    // Add your logic for starting new conversation here
    console.log('Start New Conversation clicked');
    handleClose();
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: mode === 'dark' ? '#333333' : 'primary.main',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PeopleAltIcon sx={{ fontSize: 28, mr: 1.5 }} />
        <Typography variant="h6" component="h1" fontWeight="600">
          Contacts
        </Typography>
      </Box>
           
      <Box>
        <IconButton 
          size="small" 
          sx={{ color: 'white' }}
          onClick={handleAddClick}
          aria-controls={open ? 'add-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <AddCircleOutlineIcon />
        </IconButton>
        
        <Menu
          id="add-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'add-button',
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleAddGroup}>
            <ListItemIcon>
              <GroupAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Group/Friends</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleNewConversation}>
            <ListItemIcon>
              <ChatIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Start New Conversation</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* Add Group/User Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: mode === 'dark' ? '#333333' : '#f5f5f5',
          color: mode === 'dark' ? '#ffffff' : '#000000',
          borderBottom: `1px solid ${mode === 'dark' ? '#444444' : '#e0e0e0'}`
        }}>
          {showGroupInfo ? 'Group/User Information' : 'Enter Group/User Code'}
        </DialogTitle>
        
        <DialogContent sx={{ 
          backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
          color: mode === 'dark' ? '#ffffff' : '#000000'
        }}>
          {!showGroupInfo ? (
            <Box sx={{ pt: 3 }}>
              <Typography variant="body2" sx={{ 
                mb: 3, 
                textAlign: 'center',
                color: mode === 'dark' ? '#b0b0b0' : 'text.secondary'
              }}>
                Enter a 6-character code to find a group or user
              </Typography>
              
              {/* Character Input Boxes */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 1.5, 
                mb: 3 
              }}>
                {code.map((char, index) => (
                  <TextField
                    key={index}
                    inputRef={el => inputRefs.current[index] = el}
                    value={char}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    inputProps={{ 
                      maxLength: 1,
                      style: { 
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: mode === 'dark' ? '#ffffff' : '#000000'
                      }
                    }}
                    sx={{
                      width: 60,
                      '& .MuiOutlinedInput-root': {
                        height: 60,
                        backgroundColor: mode === 'dark' ? '#404040' : '#f8f9fa',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: mode === 'dark' ? 
                            (activeIndex === index ? '#90caf9' : '#555555') : 
                            (activeIndex === index ? '#1976d2' : '#e0e0e0'),
                          borderWidth: activeIndex === index ? 2 : 1,
                        },
                        '&:hover fieldset': {
                          borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: mode === 'dark' ? '#ffffff' : '#000000',
                      }
                    }}
                    variant="outlined"
                    autoFocus={index === 0}
                  />
                ))}
              </Box>

              {codeError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    backgroundColor: mode === 'dark' ? '#3d1a1a' : '#ffebee',
                    color: mode === 'dark' ? '#ffcdd2' : '#c62828',
                    '& .MuiAlert-icon': {
                      color: mode === 'dark' ? '#ffcdd2' : '#c62828'
                    }
                  }}
                >
                  {codeError}
                </Alert>
              )}
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: mode === 'dark' ? '#383838' : '#f8f9fa',
                border: `1px solid ${mode === 'dark' ? '#555555' : '#e0e0e0'}`
              }}>
                <Avatar 
                  src={groupInfo.avatar} 
                  sx={{ width: 70, height: 70, mr: 3 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" component="h3" sx={{ 
                    mb: 1,
                    color: mode === 'dark' ? '#ffffff' : '#000000'
                  }}>
                    {groupInfo.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={groupInfo.type === 'group' ? 'Group' : 'User'} 
                      size="small" 
                      sx={{
                        backgroundColor: mode === 'dark' ? '#1976d2' : '#1976d2',
                        color: '#ffffff'
                      }}
                    />
                    {groupInfo.type === 'group' && (
                      <>
                        <Chip 
                          label={`${groupInfo.memberCount} members`} 
                          size="small" 
                          variant="outlined"
                          sx={{
                            borderColor: mode === 'dark' ? '#666666' : '#cccccc',
                            color: mode === 'dark' ? '#ffffff' : '#000000'
                          }}
                        />
                        <Chip 
                          label={groupInfo.isPublic ? 'Public' : 'Private'} 
                          size="small" 
                          variant="outlined"
                          sx={{
                            borderColor: groupInfo.isPublic ? 
                              (mode === 'dark' ? '#4caf50' : '#4caf50') : 
                              (mode === 'dark' ? '#ff9800' : '#ff9800'),
                            color: groupInfo.isPublic ? 
                              (mode === 'dark' ? '#4caf50' : '#4caf50') : 
                              (mode === 'dark' ? '#ff9800' : '#ff9800')
                          }}
                        />
                      </>
                    )}
                    {groupInfo.type === 'user' && (
                      <>
                        <Chip 
                          label={groupInfo.status} 
                          size="small" 
                          variant="outlined"
                          sx={{
                            borderColor: groupInfo.status === 'online' ? 
                              (mode === 'dark' ? '#4caf50' : '#4caf50') : 
                              (mode === 'dark' ? '#666666' : '#cccccc'),
                            color: groupInfo.status === 'online' ? 
                              (mode === 'dark' ? '#4caf50' : '#4caf50') : 
                              (mode === 'dark' ? '#ffffff' : '#000000')
                          }}
                        />
                        {groupInfo.mutualFriends > 0 && (
                          <Chip 
                            label={`${groupInfo.mutualFriends} mutual friends`} 
                            size="small" 
                            variant="outlined"
                            sx={{
                              borderColor: mode === 'dark' ? '#666666' : '#cccccc',
                              color: mode === 'dark' ? '#ffffff' : '#000000'
                            }}
                          />
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: mode === 'dark' ? '#383838' : '#f8f9fa',
                border: `1px solid ${mode === 'dark' ? '#555555' : '#e0e0e0'}`
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 1.5,
                  color: mode === 'dark' ? '#ffffff' : '#000000'
                }}>
                  About
                </Typography>
                <Typography variant="body1" sx={{
                  color: mode === 'dark' ? '#b0b0b0' : 'text.secondary',
                  lineHeight: 1.6
                }}>
                  {groupInfo.introduction}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          pb: 2,
          backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
          borderTop: `1px solid ${mode === 'dark' ? '#444444' : '#e0e0e0'}`
        }}>
          {!showGroupInfo ? (
            <>
              <Button 
                onClick={handleDialogClose}
                sx={{ color: mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSearchGroup} 
                variant="contained"
                disabled={code.join('').length !== 6 || loading}
                sx={{
                  backgroundColor: mode === 'dark' ? '#1976d2' : '#1976d2',
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? '#1565c0' : '#1565c0',
                  },
                  '&:disabled': {
                    backgroundColor: mode === 'dark' ? '#555555' : '#cccccc',
                  }
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleDialogClose}
                sx={{ color: mode === 'dark' ? '#b0b0b0' : 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleJoin} 
                variant="contained"
                sx={{
                  backgroundColor: mode === 'dark' ? '#4caf50' : '#4caf50',
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? '#388e3c' : '#388e3c',
                  }
                }}
              >
                {groupInfo.type === 'group' ? 'Join Group' : 'Add Friend'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}