import * as React from 'react';
import { Box, Typography, CircularProgress, Paper, List, InputBase, useMediaQuery, useTheme, selectClasses } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from './Header';
// If you have the enhanced Contact component, import it
// Otherwise, continue using the original Contact component
import Contact from './Contact';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
import { useNotification } from '../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../Themes/ThemeContext';

export default function SideBar(props) {
  let { select, setSelect, isMobile,notifications,setNotifications,markAsRead } = props;
  const [userRecords, setUserRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();

  let location = useLocation();
  const refresh = useSelector((state) => state.refreshSideBar.value.refresh);
  
  const onDelete = (type,userId,groupId) => {
    const criteria = {type, groupId}
    DatabaseManipulator.deleteRecentContact(criteria).then(()=>{
      DatabaseManipulator.deleteMessages(criteria).then(() => {
        DatabaseManipulator.deleteUnreadMessage(type,groupId, userId).then(() =>{

        })
      })
    }).catch(e => {
      console.error(e)
      showNotification("error deleting message", "error")

    })
  }


  useEffect(() => {
    if (location && location.type && (location.userId || location.groupId)) {
      setSelect(location);
    }
  }, [location]);

  useEffect(() => {
    setLoading(true);
    DatabaseManipulator.getRecentContacts()
      .then((res) => {
        console.log(res)
        //do not let the current contact has the unread count
        if(select && select.userId && select.type === "single"){
          const user = res.find(item=>item.userId === select.userId && item.type === select.type)
          if (user) {
            user.count = 0;
          }
        } else if (select && select.groupId && select.type === "group") {
          const user = res.find(item=>item.groupId === select.groupId && item.type === select.type)
          if (user) {
            user.count = 0;
          }
        }
        setUserRecords(res || []); // Ensure this is always an array

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setUserRecords([]); // Set to empty array on error
        setLoading(false);
      });


  }, [refresh]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
const filteredContacts = userRecords;

const onClick = (idx) => {
  return () => {
    const mid = userRecords[idx];

    // 构建新的选择对象
    const newSelect = mid.type === "single"
      ? { userId: mid.userId, type: mid.type }
      : { userId: mid.userId, type: mid.type, groupId: mid.groupId };

    // 仅比较指定字段，而非整个对象
    const isEqual = 
      select?.userId === newSelect.userId &&
      select?.type === newSelect.type &&
      (newSelect.type === "group" ? select?.groupId === newSelect.groupId : true);

    if (!isEqual) {
      setSelect(newSelect);
    }

    markAsRead(mid.type, mid.userId, mid.groupId);
  };
};

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%', // Take full width of parent container
        height: isMobile ? "calc(100vh - 64px - 66px)" : "calc(100vh - 64px - 66px)",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
        position: 'relative',
      }}
    >
      <Header />
      
      <Box sx={{ 
        backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f5f7fa',
        borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // 关键点：垂直居中
        height: '70px',
      }}>
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 8,
            boxShadow: mode === 'dark' 
              ? '0 2px 8px rgba(0,0,0,0.3)' 
              : '0 2px 8px rgba(0,0,0,0.08)',
            backgroundColor: mode === 'dark' ? '#333333' : '#ffffff',
            width: '90%', // Changed from fixed pixel value to percentage
            maxWidth: '300px', // Added max-width for larger screens
            height: '70%',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0 4px 12px rgba(0,0,0,0.4)' 
                : '0 4px 12px rgba(0,0,0,0.12)',
            },
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.03)'
          }}
        >
          <SearchIcon sx={{ 
            color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            mr: 1, // Added margin right for better spacing from text
            ml: 1.5,
            fontSize: isMobile ? '1.2rem' : '1.4rem' 
          }} />
          <InputBase
            sx={{ 
              flex: 1,
              fontSize: isMobile ? '0.95rem' : '1rem',
              ml: 0.2, // Reduced margin left from 0.5 to 0.2
              '& .MuiInputBase-input': {
                py: 0.75,
                pl: 0.2, // Reduced padding left from 0.5 to 0.2
                overflow: 'hidden', // Prevent text overflow
                textOverflow: 'ellipsis', // Add ellipsis for overflowing text
                whiteSpace: 'nowrap', // Keep text on one line
                color: mode === 'dark' ? '#ffffff' : '#000000',
                '&::placeholder': {
                  color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  opacity: 1,
                }
              },
            }}
            placeholder="Search recent contents."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Paper>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        backgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
        width: '100%',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: mode === 'dark' ? '#1e1e1e' : '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: mode === 'dark' ? '#555555' : '#c1c1c1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: mode === 'dark' ? '#666666' : '#a8a8a8',
        },
      }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: isMobile ? 'calc(100vh - 64px - 66px - 70px)' : 'auto',
            width: '100%'
          }}>
            <CircularProgress 
              size={isMobile ? 30 : 40} 
              sx={{
                color: mode === 'dark' ? '#ffffff' : '#1976d2'
              }}
            />
          </Box>
        ) : !Array.isArray(userRecords) || userRecords.length === 0 ? (
          <Box sx={{ 
            p: isMobile ? 2 : 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? 'calc(100vh - 64px - 66px - 70px)' : 'auto',
            width: '100%'
          }}>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              sx={{
                color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
              }}
            >
              Start making some friends first
            </Typography>
          </Box>
        ) : filteredContacts.length === 0 ? (
          <Box sx={{ 
            p: isMobile ? 4 : 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? '60vh' : 'auto',
            width: '100%'
          }}>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              sx={{
                color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
              }}
            >
              No contacts found matching "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          <List sx={{ 
            width: '100%', 
            bgcolor: mode === 'dark' ? '#121212' : 'background.paper',
            p: 0.5,
            '& .MuiListItem-root': {
              borderRadius: 1,
              my: 0.5,
              '&:last-child': {
                mb: 0
              }
            }
          }}>
            {filteredContacts.map((content, idx) => (

              <Contact 
                key={content.type + content.userId + content.groupId || idx} 
                onClick={onClick(idx)} 
                content={content} 
                selected={select}
                isMobile={isMobile}
                markAsRead={markAsRead}
                onDelete = {onDelete}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}