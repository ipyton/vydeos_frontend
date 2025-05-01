import * as React from 'react';
import { Box, Typography, CircularProgress, Paper, List, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from './Header';
import Contact from './Contact';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
import { useNotification } from '../../../../Providers/NotificationProvider';

export default function SideBar(props) {
  let { select, setSelect } = props;
  const [userRecords, setUserRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();
  
  
  let location = useLocation();
  const refresh = useSelector((state) => state.refresh.value.refresh);
  
  useEffect(() => {
    setSelect(location);
  }, [location.type, location.userId, setSelect]);

  useEffect(() => {
    setLoading(true);
    DatabaseManipulator.getRecentContact()
      .then((res) => {
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

  // Safely filter the contacts, ensuring userRecords is an array
  const filteredContacts = Array.isArray(userRecords) 
    ? userRecords.filter(record => 
        (record.name && record.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (record.userId && record.userId.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const onClick = (idx) => {
    return () => {
      let mid = filteredContacts[idx];
      setSelect({ "userId": mid.userId, "type": mid.type });
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "30%",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      <Header />
      
      <Box sx={{ p: 2, backgroundColor: '#f5f7fa' }}>
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}
        >
          <SearchIcon sx={{ color: 'action.active', ml: 1, mr: 1 }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search contacts"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Paper>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        backgroundColor: '#ffffff',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        },
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={40} />
          </Box>
        ) : !Array.isArray(userRecords) || userRecords.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Start making some friends first
            </Typography>
          </Box>
        ) : filteredContacts.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No contacts found matching "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', py: 1 }}>
            {filteredContacts.map((content, idx) => (
              <Contact 
                key={content.userId || idx} 
                onClick={onClick(idx)} 
                content={content} 
                selected={select} 
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}