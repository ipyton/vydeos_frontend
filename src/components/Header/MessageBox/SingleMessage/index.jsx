import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { MenuItem, IconButton, Badge, Box } from "@mui/material";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { useThemeMode } from '../../../../Themes/ThemeContext';
import CheckIcon from '@mui/icons-material/Check';


export function SingleMessage(props) {
    const navigate = useNavigate();
    const { notification, marksAsRead } = props;
    console.log(notification)
    const [unreadCount,setUnreadCount] = useState(notification.count)

    console.log("SingleMessage", unreadCount)
    let handleMessageJump = (event, target) => {
        // Prevent navigation when delete button is clicked
        if (event.target.closest('.delete-button')) {
            return;
        }
        navigate("/chat")
    }

    const handleDelete = (event) => {
        event.stopPropagation(); // Prevent the menu item click
        marksAsRead(notification.type, notification.senderId)
    }

    const { mode } = useThemeMode();
    
    return (
        <MenuItem 
            onClick={handleMessageJump} 
            sx={{
                backgroundColor: mode === 'dark' ? '#333' : '#fff',
                color: mode === 'dark' ? '#fff' : '#000',
                '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
                display: 'flex',
                alignItems: 'center',
                paddingRight: '8px',
            }}
        >
            <ListItemAvatar>
                <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    invisible={unreadCount === 0}
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.75rem',
                            minWidth: '18px',
                            height: '18px',
                        }
                    }}
                >
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </Badge>
            </ListItemAvatar>
            
            <ListItemText 
                primary = {notification.senderId}
                secondary={
                    <React.Fragment>
                        {notification.content}
                    </React.Fragment>
                }
                primaryTypographyProps={{
                    sx: { 
                        color: mode === 'dark' ? '#fff' : '#000',
                        fontWeight: unreadCount > 0 ? 'bold' : 'normal', // Bold if unread
                    },
                }}
                secondaryTypographyProps={{
                    sx: { 
                        color: mode === 'dark' ? '#ccc' : '#555',
                        fontWeight: unreadCount > 0 ? 'bold' : 'normal', // Bold if unread
                    },
                }}
                sx={{ flex: 1 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                
                {/* Delete button */}
                <IconButton
                    className="delete-button"
                    size="small"
                    onClick={handleDelete}
                    sx={{
                        color: mode === 'dark' ? '#ccc' : '#666',
                        opacity: 0.7,
                        '&:hover': {
                            color: mode === 'dark' ? '#f44336' : '#f44336',
                            opacity: 1,
                            backgroundColor: mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    <CheckIcon fontSize="small" />
                </IconButton>
            </Box>
        </MenuItem>
    )
}