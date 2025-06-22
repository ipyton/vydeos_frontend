import * as React from 'react';
import { Box, Typography, CircularProgress, Paper, List, InputBase, useMediaQuery, useTheme, Chip, Tab, Tabs } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import Header from './Header';
import Contact from './Contact';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
import { useNotification } from '../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../Themes/ThemeContext';
import { useSearch } from "../../../../Providers/SearchProvider"

export default function SideBar(props) {
  let { select, setSelect, isMobile, notifications, setNotifications, markAsRead } = props;
  const [userRecords, setUserRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchMode, setSearchMode] = useState(0); // 0: contacts, 1: messages
  const [messageResults, setMessageResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  const { 
    searchContacts, 
    searchMessages, 
    addContact, 
    updateContact, 
    bulkAddContacts,
    ready: searchReady 
  } = useSearch();

  let location = useLocation();
  const refresh = useSelector((state) => state.refreshSideBar.value.refresh);
  
  const onDelete = (type, userId, groupId) => {
    const criteria = { type, groupId }
    DatabaseManipulator.deleteRecentContact(criteria).then(() => {
      DatabaseManipulator.deleteMessages(criteria).then(() => {
        DatabaseManipulator.deleteUnreadMessage(type, groupId, userId).then(() => {
          // Remove from search index
          const contactId = `${type}_${userId}_${groupId || ''}`;
          // Note: You might want to call removeContact here if needed
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
      .then(async (res) => {
        // Do not let the current contact have the unread count
        if (select && select.userId && select.type === "single") {
          const user = res.find(item => item.userId === select.userId && item.type === select.type)
          if (user) {
            user.count = 0;
          }
        } else if (select && select.groupId && select.type === "group") {
          const user = res.find(item => item.groupId === select.groupId && item.type === select.type)
          if (user) {
            user.count = 0;
          }
        }

        setUserRecords(res || []);
        
        // Bulk add contacts to search index when search is ready
        if (searchReady && res && res.length > 0) {
          try {
            await bulkAddContacts(res);
          } catch (error) {
            console.error('Error adding contacts to search index:', error);
          }
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setUserRecords([]);
        setLoading(false);
      });
  }, [refresh, searchReady, bulkAddContacts]);

  // Enhanced search with FlexSearch
  useEffect(() => {
    if (!searchReady) return;
    
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setShowSearchResults(false);
        setFilteredResults([]);
        setMessageResults([]);
        return;
      }

      setSearchLoading(true);
      
      try {
        if (searchMode === 0) {
          // Search contacts using FlexSearch
          const flexResults = await searchContacts(searchQuery, 10);
          
          // Also include traditional filter for immediate results
          const traditionalFiltered = userRecords.filter(contact => {
            const searchTerm = searchQuery.toLowerCase();
            return (
              contact.name?.toLowerCase().includes(searchTerm) ||
              contact.username?.toLowerCase().includes(searchTerm) ||
              contact.email?.toLowerCase().includes(searchTerm) ||
              contact.lastMessage?.toLowerCase().includes(searchTerm) ||
              contact.groupName?.toLowerCase().includes(searchTerm)
            );
          });

          // Combine and deduplicate results, prioritizing exact matches
          const combinedResults = [...traditionalFiltered];
          
          // Add FlexSearch results that aren't already included
          flexResults.forEach(flexResult => {
            const exists = combinedResults.find(contact => 
              contact.userId === flexResult.userId && 
              contact.type === flexResult.type &&
              (contact.groupId || '') === (flexResult.groupId || '')
            );
            
            if (!exists) {
              // Find the actual contact data
              const actualContact = userRecords.find(contact =>
                contact.userId === flexResult.userId && 
                contact.type === flexResult.type &&
                (contact.groupId || '') === (flexResult.groupId || '')
              );
              
              if (actualContact) {
                combinedResults.push(actualContact);
              }
            }
          });

          setFilteredResults(combinedResults);
        } else {
          // Search messages using FlexSearch
          const messageResults = await searchMessages(searchQuery, 20);
          setMessageResults(messageResults);
        }
        
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to traditional search
        const filtered = userRecords.filter(contact => {
          const searchTerm = searchQuery.toLowerCase();
          return (
            contact.name?.toLowerCase().includes(searchTerm) ||
            contact.username?.toLowerCase().includes(searchTerm) ||
            contact.email?.toLowerCase().includes(searchTerm) ||
            contact.lastMessage?.toLowerCase().includes(searchTerm) ||
            contact.groupName?.toLowerCase().includes(searchTerm)
          );
        });
        setFilteredResults(filtered);
        setShowSearchResults(true);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, userRecords, searchMode, searchReady, searchContacts, searchMessages]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== '') {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const handleSearchResultClick = (contact) => {
    const newSelect = contact.type === "single"
      ? { userId: contact.userId, type: contact.type }
      : { userId: contact.userId, type: contact.type, groupId: contact.groupId };

    setSelect(newSelect);
    markAsRead(contact.type, contact.userId, contact.groupId);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleMessageResultClick = (message) => {
    // Navigate to the conversation containing this message
    const newSelect = message.type === "single" || !message.groupId
      ? { userId: message.userId, type: "single" }
      : { userId: message.userId, type: "group", groupId: message.groupId };

    setSelect(newSelect);
    setShowSearchResults(false);
    setSearchQuery('');
    
    // You might want to scroll to the specific message here
    // This would require additional implementation in your chat component
  };

  const handleTabChange = (event, newValue) => {
    setSearchMode(newValue);
  };

  const onClick = (idx) => {
    return () => {
      const mid = userRecords[idx];

      const newSelect = mid.type === "single"
        ? { userId: mid.userId, type: mid.type }
        : { userId: mid.userId, type: mid.type, groupId: mid.groupId };

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

  // Add contact to search index when userRecords change
  useEffect(() => {
    if (!searchReady || !userRecords.length) return;
    
    // Update search index when contacts change
    userRecords.forEach(async (contact) => {
      try {
        await updateContact(contact);
      } catch (error) {
        console.error('Error updating contact in search index:', error);
      }
    });
  }, [userRecords, searchReady, updateContact]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
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
        zIndex: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1,
      }}>
        {/* Search Input */}
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
            width: '90%',
            maxWidth: '300px',
            height: '40px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0 4px 12px rgba(0,0,0,0.4)' 
                : '0 4px 12px rgba(0,0,0,0.12)',
            },
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.03)',
            position: 'relative',
          }}
        >
          <SearchIcon sx={{ 
            color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            mr: 1,
            ml: 1.5,
            fontSize: isMobile ? '1.2rem' : '1.4rem' 
          }} />
          <InputBase
            sx={{ 
              flex: 1,
              fontSize: isMobile ? '0.95rem' : '1rem',
              ml: 0.2,
              '& .MuiInputBase-input': {
                py: 0.75,
                pl: 0.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: mode === 'dark' ? '#ffffff' : '#000000',
                '&::placeholder': {
                  color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  opacity: 1,
                }
              },
            }}
            placeholder={searchMode === 0 ? "Search contacts..." : "Search messages..."}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          {searchLoading && (
            <CircularProgress 
              size={16} 
              sx={{ 
                mr: 1.5,
                color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
              }} 
            />
          )}
        </Paper>

        {/* Search Mode Tabs
        <Tabs 
          value={searchMode} 
          onChange={handleTabChange}
          sx={{
            mt: 1,
            minHeight: '32px',
            '& .MuiTab-root': {
              minHeight: '32px',
              fontSize: '0.8rem',
              color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              '&.Mui-selected': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: mode === 'dark' ? '#ffffff' : '#1976d2',
            }
          }}
        >
          <Tab 
            icon={<PersonIcon sx={{ fontSize: '1rem' }} />} 
            label="Contacts" 
            iconPosition="start"
            sx={{ px: 2 }}
          />
          <Tab 
            icon={<MessageIcon sx={{ fontSize: '1rem' }} />} 
            label="Messages" 
            iconPosition="start"
            sx={{ px: 2 }}
          />
        </Tabs> */}

        {/* Enhanced Search Results */}
        {showSearchResults && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '300px',
              maxHeight: '400px',
              mt: 0.5,
              zIndex: 1000,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              backgroundColor: mode === 'dark' 
                ? 'rgba(28, 28, 30, 0.85)' 
                : 'rgba(255, 255, 255, 0.85)',
              borderRadius: '16px',
              border: mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 0.5px rgba(255, 255, 255, 0.05)'
                : '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              animation: 'slideDown 0.2s ease-out',
              '@keyframes slideDown': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(-50%) translateY(-10px) scale(0.95)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(-50%) translateY(0) scale(1)',
                },
              },
            }}
          >
            <Box
              sx={{
                maxHeight: '400px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '2px',
                },
              }}
            >
              {searchMode === 0 ? (
                // Contact search results
                filteredResults.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.6)' 
                          : 'rgba(0, 0, 0, 0.6)',
                        fontSize: '0.9rem'
                      }}
                    >
                      No contacts found for "{searchQuery}"
                    </Typography>
                  </Box>
                ) : (
                  filteredResults.map((contact, idx) => (
                    <Box
                      key={contact.type + contact.userId + contact.groupId || idx}
                      onClick={() => handleSearchResultClick(contact)}
                      onMouseDown={(e) => e.preventDefault()}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderBottom: idx < filteredResults.length - 1 
                          ? (mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.08)' 
                            : '1px solid rgba(0, 0, 0, 0.08)')
                          : 'none',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          backgroundColor: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.08)' 
                            : 'rgba(0, 0, 0, 0.04)',
                        },
                        '&:active': {
                          backgroundColor: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.12)' 
                            : 'rgba(0, 0, 0, 0.08)',
                          transform: 'scale(0.98)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        {contact.type === 'group' ? <GroupIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> : <PersonIcon sx={{ fontSize: '1rem', mr: 0.5 }} />}
                        <Typography
                          variant="body2"
                          sx={{
                            color: mode === 'dark' ? '#ffffff' : '#000000',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {contact.type === 'group' ? contact.groupName : contact.name || contact.username}
                        </Typography>
                      </Box>
                      {contact.lastMessage && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.6)' 
                              : 'rgba(0, 0, 0, 0.6)',
                            fontSize: '0.8rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {contact.lastMessage}
                        </Typography>
                      )}
                    </Box>
                  ))
                )
              ) : (
                // Message search results
                messageResults.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.6)' 
                          : 'rgba(0, 0, 0, 0.6)',
                        fontSize: '0.9rem'
                      }}
                    >
                      No messages found for "{searchQuery}"
                    </Typography>
                  </Box>
                ) : (
                  messageResults.map((message, idx) => (
                    <Box
                      key={message.id || idx}
                      onClick={() => handleMessageResultClick(message)}
                      onMouseDown={(e) => e.preventDefault()}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderBottom: idx < messageResults.length - 1 
                          ? (mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.08)' 
                            : '1px solid rgba(0, 0, 0, 0.08)')
                          : 'none',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          backgroundColor: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.08)' 
                            : 'rgba(0, 0, 0, 0.04)',
                        },
                        '&:active': {
                          backgroundColor: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.12)' 
                            : 'rgba(0, 0, 0, 0.08)',
                          transform: 'scale(0.98)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <MessageIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: mode === 'dark' ? '#ffffff' : '#000000',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {message.senderName || 'Unknown'}
                        </Typography>
                        <Chip
                          label={message.type === 'group' ? 'Group' : 'Direct'}
                          size="small"
                          sx={{
                            height: '16px',
                            fontSize: '0.7rem',
                            backgroundColor: mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.1)',
                            color: mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.8)' 
                              : 'rgba(0, 0, 0, 0.8)',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'rgba(0, 0, 0, 0.8)',
                          fontSize: '0.8rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        {message.content}
                      </Typography>
                      {message.timestamp && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.5)' 
                              : 'rgba(0, 0, 0, 0.5)',
                            fontSize: '0.7rem',
                          }}
                        >
                          {new Date(message.timestamp).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  ))
                )
              )}
            </Box>
          </Box>
        )}
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
        {!Array.isArray(userRecords) || userRecords.length === 0 ? (
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
        ) : userRecords.length === 0 ? (
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
            {userRecords.map((content, idx) => (
              <Contact 
                key={content.type + content.userId + content.groupId || idx} 
                onClick={onClick(idx)} 
                content={content} 
                selected={select}
                isMobile={isMobile}
                markAsRead={markAsRead}
                onDelete={onDelete}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}