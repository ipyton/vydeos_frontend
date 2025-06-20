import React, { useEffect, useState } from "react";
import PostUtil from "../../../util/io_utils/PostUtil";
import Article from "./Article";
import { useNotification } from '../../../Providers/NotificationProvider';

// Material UI imports
import {
  Box, List, ListItem, Stack, ButtonBase, Typography, Backdrop
} from "@mui/material";

// Material UI icons
import {
  Add as AddIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Navigation as NavigationIcon,
  Comment as CommentIcon,
  ExpandMore as ExpandMoreIcon,
  Fingerprint
} from "@mui/icons-material";

import { useThemeMode } from '../../../Themes/ThemeContext';
import AddPostDialog from "./AddPostDialog";

import { useTheme, useMediaQuery, Fade, Slide } from '@mui/material';

function Item(props) {
  const { login, setLogin, barState, setBarState } = props;
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State variables
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState("friend");
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();

  // Handler functions
  const handleClickOpen = () => setOpen(true);

  const handleFriends = () => {
    if (page !== "friend") {
      setArticles([]);
      setPage("friend");
    }
  };

  const handleMy = () => {
    if (page !== "my") {
      setArticles([]);
      setPage("my");
    }
  };

  // Effect hooks
  useEffect(() => {
    if (page === "friend") {
      PostUtil.getFriendPosts(articles, setArticles);
    } else if (page === "my") {
      PostUtil.getPostsById(localStorage.getItem("userId"), articles, setArticles);
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      
      if ((windowHeight + scrollTop + 2) >= documentHeight) {
        console.log('Reached bottom of page');
        loadMoreData();
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  // Load more data when scrolling to bottom
  const loadMoreData = () => {
    console.log("Loading more content...");
    // Implement pagination logic here
  };

  // Load initial data if needed
  if (articles.length === 0) {
    loadMoreData();
  }

  // iOS-style button group styles
  const buttonGroupStyle = {
    position: 'fixed',
    bottom: isMobile ? 20 : 30,
    right: isMobile ? 20 : 30,
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: 1,
    padding: '8px',
    borderRadius: '20px',
    backgroundColor: mode === 'dark' 
      ? 'rgba(44, 44, 46, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: mode === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
  };

  const buttonStyle = (isActive = false, isAddButton = false) => ({
    minWidth: isAddButton ? (isMobile ? '44px' : '56px') : (isMobile ? '80px' : '100px'),
    height: isMobile ? '40px' : '48px',
    borderRadius: isMobile ? '12px' : '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? 0.5 : 1,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: isActive 
      ? (mode === 'dark' ? 'rgba(10, 132, 255, 0.9)' : 'rgba(0, 122, 255, 0.9)')
      : (mode === 'dark' ? 'rgba(58, 58, 60, 0.6)' : 'rgba(242, 242, 247, 0.8)'),
    color: isActive 
      ? '#ffffff' 
      : (mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'),
    border: isActive 
      ? 'none' 
      : (mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'),
    fontWeight: 600,
    fontSize: isMobile ? '12px' : '14px',
    textTransform: 'none',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: isActive 
        ? (mode === 'dark' ? 'rgba(10, 132, 255, 1)' : 'rgba(0, 122, 255, 1)')
        : (mode === 'dark' ? 'rgba(72, 72, 74, 0.8)' : 'rgba(229, 229, 234, 0.9)'),
      boxShadow: mode === 'dark'
        ? '0 4px 16px rgba(0, 0, 0, 0.3)'
        : '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  });

  const iconStyle = {
    fontSize: isMobile ? '16px' : '20px',
  };

  return (
    <Box sx={{ width: isMobile ? "100%" : "80%", margin: "0 auto" }}>
      {/* Posts list */}
      <List>
        {articles && articles.map((article, idx) => (
          <ListItem key={idx}>
            <Article content={article} />
          </ListItem>
        ))}
      </List>
      
      <AddPostDialog 
        open={open} 
        setOpen={setOpen} 
        articles={articles} 
        setArticles={setArticles} 
      />

      {/* iOS-style floating button group */}
      <Box sx={buttonGroupStyle}>
        {/* Add Post Button */}
        <ButtonBase
          onClick={handleClickOpen}
          sx={buttonStyle(false, true)}
          aria-label="create post"
        >
          <AddIcon sx={iconStyle} />
        </ButtonBase>
        
        {/* Friends Button */}
        <ButtonBase
          onClick={handleFriends}
          sx={buttonStyle(page === "friend")}
          aria-label="friends posts"
        >
          <EditIcon sx={iconStyle} />
          <Typography variant="body2" sx={{ fontSize: isMobile ? '11px' : '14px', fontWeight: 600 }}>
            Friends
          </Typography>
        </ButtonBase>
        
        {/* My Posts Button */}
        <ButtonBase
          onClick={handleMy}
          sx={buttonStyle(page === "my")}
          aria-label="my posts"
        >
          <NavigationIcon sx={iconStyle} />
          <Typography variant="body2" sx={{ fontSize: isMobile ? '11px' : '14px', fontWeight: 600 }}>
            My Posts
          </Typography>
        </ButtonBase>
      </Box>
    </Box>
  );
}

export default Item;