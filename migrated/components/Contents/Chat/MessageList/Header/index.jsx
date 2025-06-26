import React from "react";
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  Chip, 
  Tooltip, 
  useMediaQuery,
  useTheme
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { useThemeMode } from '../../../../../contexts/ThemeContext';
import styles from '../../../../../styles/ChatHeader.module.css';

export default function Header({ selected, onBack }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode } = useThemeMode();
  
  const isGroup = selected && selected.type === 'group';
  const name = isGroup ? selected.groupName : selected.name;
  const avatar = selected.pics || selected.groupAvatar;
  const status = selected.status || (isGroup ? 'Group' : 'User');
  
  const backgroundColor = mode === 'dark' ? '#1e1e1e' : '#ffffff';
  const textColor = mode === 'dark' ? '#ffffff' : '#333333';
  const secondaryTextColor = mode === 'dark' ? '#aaaaaa' : '#666666';
  const borderColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  
  return (
    <Box 
      className={styles.headerContainer}
      sx={{
        backgroundColor: backgroundColor,
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: isMobile ? 1 : 2,
        py: isMobile ? 1 : 1.5,
        flexShrink: 0,
      }}
    >
      {/* Left section with back button and user info */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={onBack} 
            className={styles.backButton}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        
        {/* Avatar */}
        <Avatar 
          src={avatar} 
          className={styles.avatar}
          sx={{
            width: isMobile ? 40 : 44,
            height: isMobile ? 40 : 44,
            mr: 1.5
          }}
        >
          {isGroup ? <GroupIcon /> : <PersonIcon />}
        </Avatar>
        
        {/* Name and Status */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            className={styles.name}
            sx={{ 
              fontWeight: 600, 
              color: textColor,
              lineHeight: 1.2
            }}
          >
            {name || 'Unknown User'}
          </Typography>
          
          <Typography 
            variant="caption" 
            className={styles.status}
            sx={{ 
              color: secondaryTextColor,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isGroup ? (
              <>
                <Chip 
                  size="small" 
                  label={`${selected.memberCount || '?'} members`}
                  className={styles.groupChip}
                  sx={{
                    fontSize: '0.7rem',
                    height: 20,
                    mr: 0.5,
                    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
                  }}
                />
                {selected.isActive === false ? 'Inactive' : 'Active'}
              </>
            ) : (
              status === 'online' ? (
                <>
                  <Box 
                    className={styles.statusIndicator}
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#4caf50',
                      borderRadius: '50%',
                      mr: 0.5
                    }}
                  />
                  Online
                </>
              ) : (
                status
              )
            )}
          </Typography>
        </Box>
      </Box>
      
      {/* Right section with action buttons */}
      <Box 
        className={styles.actionButtons}
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {!isMobile && (
          <>
            <Tooltip title="Voice call" arrow>
              <IconButton className={styles.actionButton}>
                <CallIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Video call" arrow>
              <IconButton className={styles.actionButton}>
                <VideocamIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
          </>
        )}
        
        <Tooltip title="More options" arrow>
          <IconButton className={styles.moreButton}>
            <MoreVertIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
} 