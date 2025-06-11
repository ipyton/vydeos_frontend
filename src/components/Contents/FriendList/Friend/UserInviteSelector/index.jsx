import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Chip,
  Typography,
  InputAdornment,
  Divider,
  Paper,
  Checkbox,
  Stack,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import MessageUtil from '../../../../../util/io_utils/MessageUtil';


import { useNotification } from '../../../../../Providers/NotificationProvider';

// Mock user data - replace with your actual user data source
// const mockUsers = [
//   { id: 1, name: 'Alice Johnson', friendId: 'alice@example.com', avatar: null, online: true },
//   { id: 2, name: 'Bob Smith', friendId: 'bob@example.com', avatar: null, online: false },
//   { id: 3, name: 'Carol Davis', friendId: 'carol@example.com', avatar: null, online: true },
//   { id: 4, name: 'David Wilson', friendId: 'david@example.com', avatar: null, online: true },
//   { id: 5, name: 'Eva Martinez', friendId: 'eva@example.com', avatar: null, online: false },
//   { id: 6, name: 'Frank Brown', friendId: 'frank@example.com', avatar: null, online: true },
//   { id: 7, name: 'Grace Lee', friendId: 'grace@example.com', avatar: null, online: false },
//   { id: 8, name: 'Henry Taylor', friendId: 'henry@example.com', avatar: null, online: true },
// ];

export default function UserInviteSelector({ selectedUsers = [], onSelectionChange, mode = 'light', theme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([])
  const {showNotification} = useNotification()
  useEffect(()=>{
    MessageUtil.getFriends().then((res)=> {
        if (res && res.data.code === 0) {
            const friends = JSON.parse(res.data.message)
            console.log(friends)
            setUsers(friends)
        }
        else {
            showNotification("error fetch users","error")
        }
        console.log(res)
    })
  },[])
  


  useEffect(() => {
    const filtered = users.filter(user =>
      user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.friendId && user.friendId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery,users]);

  const handleUserToggle = (user) => {
    const isSelected = selectedUsers.some(selected => selected.friendId === user.friendId);
    let newSelection;
    
    if (isSelected) {
      newSelection = selectedUsers.filter(selected => selected.friendId !== user.friendId);
    } else {
      newSelection = [...selectedUsers, user];
    }
    
    onSelectionChange(newSelection);
  };

  const handleRemoveUser = (userId) => {
    const newSelection = selectedUsers.filter(user => user.friendId !== userId);
    onSelectionChange(newSelection);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search Field */}
      <TextField
        fullWidth
        placeholder="Search users to invite..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ 
                color: mode === 'dark' ? '#888888' : 'rgba(0, 0, 0, 0.54)' 
              }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: mode === 'dark' ? '#2a2a2a' : 'rgba(0, 0, 0, 0.02)',
            '& fieldset': {
              borderColor: mode === 'dark' ? '#555555' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.04)',
              '& fieldset': {
                borderColor: mode === 'dark' ? '#777777' : 'rgba(0, 0, 0, 0.23)',
              },
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'dark' ? '#2a2a2a' : 'transparent',
              '& fieldset': {
                borderColor: theme?.palette?.secondary?.main || '#9c27b0',
                borderWidth: '2px',
              },
            }
          },
          '& .MuiOutlinedInput-input': {
            color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
            '&::placeholder': {
              color: mode === 'dark' ? '#888888' : 'rgba(0, 0, 0, 0.6)',
              opacity: 1,
            }
          }
        }}
      />

      {/* Selected Users Chips */}
      {selectedUsers.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{
            color: mode === 'dark' ? '#cccccc' : 'rgba(0, 0, 0, 0.6)',
            mb: 1,
            display: 'block'
          }}>
            Selected ({selectedUsers.length})
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {selectedUsers.map(user => (
              <Chip
                key={user.friendId}
                avatar={
                  <Avatar 
                    sx={{ 
                      width: 24, 
                      height: 24,
                      fontSize: '0.75rem',
                      bgcolor: theme?.palette?.secondary?.main || '#9c27b0'
                    }}
                  >
                    {getInitials(user.name || user.friendId)}
                  </Avatar>
                }
                label={user.friendId}
                onDelete={() => handleRemoveUser(user.friendId)}
                deleteIcon={<CloseIcon sx={{ fontSize: '16px !important' }} />}
                variant="outlined"
                sx={{
                  backgroundColor: mode === 'dark' ? '#2a2a2a' : 'rgba(156, 39, 176, 0.08)',
                  borderColor: mode === 'dark' ? '#555555' : 'rgba(156, 39, 176, 0.3)',
                  color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
                  '& .MuiChip-deleteIcon': {
                    color: mode === 'dark' ? '#cccccc' : 'rgba(0, 0, 0, 0.6)',
                    '&:hover': {
                      color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
                    }
                  }
                }}
              />
            ))}
          </Stack>
          <Divider sx={{
            borderColor: mode === 'dark' ? '#404040' : 'rgba(0, 0, 0, 0.12)'
          }} />
        </Box>
      )}

      {/* User List */}
      <Paper
        sx={{
          maxHeight: 320,
          overflow: 'auto',
          backgroundColor: mode === 'dark' ? '#2a2a2a' : '#ffffff',
          border: `1px solid ${mode === 'dark' ? '#555555' : 'rgba(0, 0, 0, 0.12)'}`,
          borderRadius: 2,
        }}
      >
        <List sx={{ p: 0 }}>
          {filteredUsers.length === 0 ? (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{
                    color: mode === 'dark' ? '#888888' : 'rgba(0, 0, 0, 0.6)',
                    textAlign: 'center',
                    py: 2
                  }}>
                    {searchQuery ? 'No users found' : 'No users available'}
                  </Typography>
                }
              />
            </ListItem>
          ) : (
            filteredUsers.map((user, index) => {
                console.log(selectedUsers)
                console.log(user)
              const isSelected = selectedUsers.some(selected => selected.friendId === user.friendId);
              console.log(isSelected)
              return (
                <React.Fragment key={user.id}>
                  <ListItemButton
                    onClick={() => handleUserToggle(user)}
                    sx={{
                      py: 1.5,
                      backgroundColor: isSelected 
                        ? (mode === 'dark' ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.05)')
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: isSelected
                          ? (mode === 'dark' ? 'rgba(156, 39, 176, 0.15)' : 'rgba(156, 39, 176, 0.08)')
                          : (mode === 'dark' ? '#404040' : 'rgba(0, 0, 0, 0.04)'),
                      }
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      edge="start"
                      tabIndex={-1}
                      color="secondary"
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: mode === 'dark' ? '#cccccc' : 'rgba(0, 0, 0, 0.54)',
                        }
                      }}
                    />
                    <ListItemAvatar sx={{ ml: 1 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: user.online ? '#4caf50' : '#757575',
                              border: `2px solid ${mode === 'dark' ? '#2a2a2a' : '#ffffff'}`,
                            }}
                          />
                        }
                      >
                        <Avatar
                          sx={{
                            bgcolor: theme?.palette?.secondary?.main || '#9c27b0',
                            width: 40,
                            height: 40
                          }}
                        >
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name || user.friendId} style={{ width: '100%', height: '100%' }} />
                          ) : (
                            getInitials(user.name || user.friendId)
                          )}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{
                          color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
                          fontWeight: isSelected ? 600 : 400
                        }}>
                          {user.name || user.friendId}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{
                          color: mode === 'dark' ? '#888888' : 'rgba(0, 0, 0, 0.6)'
                        }}>
                          {user.friendId}
                        </Typography>
                      }
                    />
                    {user.online && (
                      <Chip
                        label="Online"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4caf50',
                          fontSize: '0.7rem',
                          height: 20,
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    )}
                  </ListItemButton>
                  {index < filteredUsers.length - 1 && (
                    <Divider sx={{
                      borderColor: mode === 'dark' ? '#404040' : 'rgba(0, 0, 0, 0.12)'
                    }} />
                  )}
                </React.Fragment>
              );
            })
          )}
        </List>
      </Paper>


    </Box>
  );
}