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

    // Larger touch targets on mobile
    const touchFriendlyStyles = {
        py: isMobile ? 1.5 : 1,
        '& .MuiListItemText-primary': {
            fontSize: isMobile ? '1rem' : 'inherit'
        }
    };

    // Enhanced feedback for touch devices
    const enhancedButtonStyles = {
        width: "100%",
        borderRadius: 1,
        transition: 'background-color 0.2s ease',
        '&:active': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        }
    };

    if (idx === 0 || idx === 1 || idx === 2) {
        return (
            <React.Fragment>
                <ListItemButton 
                    onClick={handleClick(idx)} 
                    sx={enhancedButtonStyles}
                    touchRippleProps={{ 
                        center: false 
                    }}
                >
                    <ListItem alignItems="flex-start" sx={touchFriendlyStyles}>
                        <ListItemAvatar>
                            <Avatar 
                                alt={content.friendId || "User"} 
                                src="/static/images/avatar/1.jpg"
                                sx={{ width: isMobile ? 40 : 32, height: isMobile ? 40 : 32 }} 
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography 
                                    component="span" 
                                    variant={isMobile ? "body1" : "body2"}
                                    sx={{ fontWeight: 500 }}
                                >
                                    {content.friendId}
                                </Typography>
                            }
                        />
                    </ListItem>
                </ListItemButton>
                <Divider variant="fullWidth" component="li" />
            </React.Fragment>
        );
    } else if (idx === 3) {
        return (
            <React.Fragment>
                <ListItemButton 
                    onClick={handleClick(idx)}
                    sx={enhancedButtonStyles}
                >
                    <ListItem alignItems="flex-start" sx={touchFriendlyStyles}>
                        <ListItemAvatar>
                            <Avatar 
                                alt={content.groupName || "Group"} 
                                src="/static/images/avatar/1.jpg"
                                sx={{ width: isMobile ? 40 : 32, height: isMobile ? 40 : 32 }} 
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography 
                                    component="span" 
                                    variant={isMobile ? "body1" : "body2"}
                                    sx={{ fontWeight: 500 }}
                                >
                                    {content.groupName}
                                </Typography>
                            }
                        />
                    </ListItem>
                </ListItemButton>
                <Divider variant="fullWidth" component="li" />
            </React.Fragment>
        );
    } else if (idx === 4 || idx === 5) {
        return (
            <React.Fragment>
                <ListItemButton 
                    onClick={handleClick(idx)}
                    sx={enhancedButtonStyles}
                >
                    <ListItem alignItems="flex-start" sx={touchFriendlyStyles}>
                        <ListItemAvatar>
                            <Avatar 
                                alt="User" 
                                src="/static/images/avatar/1.jpg"
                                sx={{ width: isMobile ? 40 : 32, height: isMobile ? 40 : 32 }} 
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography 
                                    component="span" 
                                    variant={isMobile ? "body1" : "body2"}
                                    sx={{ fontWeight: 500 }}
                                >
                                    {content.friendId || "Tim"}
                                </Typography>
                            }
                        />
                    </ListItem>
                </ListItemButton>
                <Divider variant="fullWidth" component="li" />
            </React.Fragment>
        );
    }
    
    return null;
}