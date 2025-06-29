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
import styles from '../../../../../styles/FriendList.module.css';
import { useState, useEffect } from 'react';

export default function FriendItem(props) {
    const { content, idx, setSelector } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mode, setMode] = useState('light');
    const [isClient, setIsClient] = useState(false);

    // Check if we're on the client-side and get the theme mode
    useEffect(() => {
        setIsClient(true);
        
        // Get theme mode from localStorage or system preference
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('themeMode') || 
                            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            setMode(savedMode);
        }
    }, []);

    const handleClick = (idx) => {
        return () => {
            if (idx === 0 || idx === 1) {
                setSelector({ type: "contact", userId: content.friendId });
            }
            else if (idx === 2){
                setSelector({ type: "contact", userId: content.userId });
            } else if (idx === 3) {
                setSelector({ type: "groupId", content: content.groupId });
            } else if (idx === 4) {
                setSelector({ type: "invitationId", content: content.invitationId });
            } else if (idx === 5) {
                setSelector({ type: "userId", content: content.friendId });
            }
        };
    };

    // Don't render on server-side
    if (!isClient) {
        return null;
    }

    // Common render function to reduce code duplication
    const renderListItem = (displayName, id) => (
        <React.Fragment>
            <ListItemButton 
                onClick={handleClick(idx)} 
                className={`${styles.friendItem} ${mode === 'dark' ? styles.friendItemDark : styles.friendItemLight}`}
            >
                <ListItem 
                    alignItems="flex-start" 
                    className={`${styles.friendItemContent} ${isMobile ? styles.friendItemContentMobile : ''}`}
                >
                    <ListItemAvatar>
                        <Avatar 
                            alt={displayName} 
                            src={`/api/account/getAvatar/${(idx===3?"group_":"single_")}${id}`}
                            className={`${styles.avatar} ${isMobile ? styles.avatarMobile : styles.avatarDesktop} ${mode === 'dark' ? styles.avatarDark : styles.avatarLight}`}
                        >
                            {/* Fallback to first letter if image fails */}
                            {displayName?.charAt(0).toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography 
                                component="span" 
                                variant={isMobile ? "body1" : "body2"}
                                className={`${styles.friendItemText} ${mode === 'dark' ? styles.friendItemTextDark : styles.friendItemTextLight}`}
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
                className={`${styles.divider} ${mode === 'dark' ? styles.dividerDark : styles.dividerLight}`}
            />
        </React.Fragment>
    );

    // Handle different tab types
    if (idx === 0 || idx === 1) {
        return renderListItem(content.friendId, content.friendId || "User");
    } else if (idx === 2) {
        return renderListItem(content.userId, content.userId || "User");
    } else if (idx === 3) {
        return renderListItem(content.groupName, content.groupName || "Group");
    } else if (idx === 4 || idx === 5) {
        return renderListItem(content.friendId || "User", "User");
    }
    
    return null;
} 