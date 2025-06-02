import * as React from 'react';
import { ListItemButton } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useThemeMode } from '../../../../../Themes/ThemeContext';

export default function FriendItem(props) {
    const { content, idx, setSelector } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { mode } = useThemeMode();

    const handleClick = (idx) => {
        return () => {
            if (idx === 0 || idx === 1 || idx === 2) {
                setSelector({ type: "contact", userId: content.friendId });
            } else if (idx === 3) {
                setSelector({ type: "groupId", content: content.groupId });
            } else if (idx === 4) {
                setSelector({ type: "invitationId", content: content.invitationId });
            } else if (idx === 5) {
                setSelector({ type: "userId", content: content.friendId });
            }
        };
    };

    // Enhanced touch-friendly styles with better dark mode support
    const touchFriendlyStyles = {
        py: isMobile ? 1.5 : 1,
        px: 0, // Remove horizontal padding since ListItemButton handles it
        '& .MuiListItemText-primary': {
            fontSize: isMobile ? '1rem' : 'inherit',
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'
        }
    };

    // Enhanced button styles with improved dark mode feedback
    const enhancedButtonStyles = {
        width: "100%",
        borderRadius: 1,
        px: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
            transform: 'translateX(2px)'
        },
        '&:active': {
            backgroundColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.12)' 
                : 'rgba(0, 0, 0, 0.08)',
            transform: 'translateX(1px)'
        },
        '&:focus-visible': {
            outline: `2px solid ${mode === 'dark' ? theme.palette.secondary.main : theme.palette.primary.main}`,
            outlineOffset: '2px'
        }
    };

    // Enhanced divider styles for better dark mode visibility
    const dividerStyles = {
        borderColor: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(0, 0, 0, 0.12)',
        mx: 2 // Add margin to align with content
    };

    // Enhanced avatar styles
    const avatarStyles = {
        width: isMobile ? 44 : 36,
        height: isMobile ? 44 : 36,
        border: mode === 'dark' 
            ? '2px solid rgba(255, 255, 255, 0.1)' 
            : '2px solid rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease'
    };

    // Enhanced typography styles for better readability
    const typographyStyles = {
        fontWeight: 500,
        color: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(0, 0, 0, 0.87)',
        letterSpacing: '0.01em'
    };

    // Common render function to reduce code duplication
    const renderListItem = (displayName, altText = "User") => (
        <React.Fragment>
            <ListItemButton 
                onClick={handleClick(idx)} 
                sx={enhancedButtonStyles}
                touchRippleProps={{ 
                    center: false,
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                }}
            >
                <ListItem alignItems="flex-start" sx={touchFriendlyStyles}>
                    <ListItemAvatar>
                        <Avatar 
                            alt={altText} 
                            src="/static/images/avatar/1.jpg"
                            sx={avatarStyles}
                        >
                            {/* Fallback to first letter if image fails */}
                            {!"/static/images/avatar/1.jpg" && displayName?.charAt(0).toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography 
                                component="span" 
                                variant={isMobile ? "body1" : "body2"}
                                sx={typographyStyles}
                            >
                                {displayName}
                            </Typography>
                        }
                    />
                </ListItem>
            </ListItemButton>
            <Divider 
                variant="fullWidth" 
                component="li" 
                sx={dividerStyles}
            />
        </React.Fragment>
    );

    // Handle different tab types
    if (idx === 0 || idx === 1 || idx === 2) {
        return renderListItem(content.friendId, content.friendId || "User");
    } else if (idx === 3) {
        return renderListItem(content.groupName, content.groupName || "Group");
    } else if (idx === 4 || idx === 5) {
        return renderListItem(content.friendId || "Tim", "User");
    }
    
    return null;
}