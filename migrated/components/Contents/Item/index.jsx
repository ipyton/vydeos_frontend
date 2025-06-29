import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { Box, List, ListItem, Stack, ButtonBase, Typography, Backdrop } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Favorite as FavoriteIcon, 
         Navigation as NavigationIcon, Comment as CommentIcon, 
         ExpandMore as ExpandMoreIcon, Fingerprint } from "@mui/icons-material";
import { useThemeMode } from '../../../contexts/ThemeContext';
import Article from "./Article";
import { useTheme, useMediaQuery, Fade, Slide } from '@mui/material';
import styles from '../../../styles/Item.module.css';

// Dynamically import components that rely on browser APIs
const PostUtil = dynamic(() => import('../../../utils/PostUtil'), { ssr: false });
const AddPostDialog = dynamic(() => import('./AddPostDialog'), { ssr: false });
const NotificationProvider = dynamic(() => import('../../../contexts/NotificationProvider'), {
  ssr: false,
  loading: () => null
});

export default function Item(props) {
  const { login, setLogin, barState, setBarState } = props;
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State variables
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState("friend");
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { mode } = useThemeMode();

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    if (!isClient) return;
    
    if (page === "friend") {
      PostUtil.getFriendPosts(articles, setArticles);
    } else if (page === "my") {
      PostUtil.getPostsById(localStorage.getItem("userId"), articles, setArticles);
    }
  }, [page, isClient]);

  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isClient]);

  // Load more data when scrolling to bottom
  const loadMoreData = () => {
    console.log("Loading more content...");
    // Implement pagination logic here
    if (page === "friend") {
      PostUtil.getFriendPosts(articles, setArticles);
    } else if (page === "my") {
      PostUtil.getPostsById(localStorage.getItem("userId"), articles, setArticles);
    }
  };

  // Load initial data if needed
  useEffect(() => {
    if (isClient && articles.length === 0) {
      loadMoreData();
    }
  }, [isClient, articles.length]);

  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }

  return (
    <Box className={styles.container}>
      {/* Posts list */}
      <List className={styles.list}>
        {articles && articles.map((article, idx) => (
          <ListItem key={idx} sx={{ padding: 0, marginBottom: 2 }}>
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
      <Box className={`${styles.buttonGroup} ${mode === 'dark' ? styles.buttonGroupDark : styles.buttonGroupLight}`}>
        {/* Add Post Button */}
        <ButtonBase
          onClick={handleClickOpen}
          className={`${styles.button} ${styles.addButton} ${mode === 'dark' ? styles.buttonDark : styles.buttonLight}`}
          aria-label="create post"
        >
          <AddIcon fontSize={isMobile ? 'small' : 'medium'} />
        </ButtonBase>
        
        {/* Friends Button */}
        <ButtonBase
          onClick={handleFriends}
          className={`
            ${styles.button} 
            ${page === "friend" ? styles.activeButton : ''} 
            ${page === "friend" && mode === 'dark' ? styles.activeDark : ''}
            ${page === "friend" && mode === 'light' ? styles.activeLight : ''}
            ${page !== "friend" && mode === 'dark' ? styles.buttonDark : ''}
            ${page !== "friend" && mode === 'light' ? styles.buttonLight : ''}
          `}
          aria-label="friends posts"
        >
          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
          <Typography variant="body2" sx={{ fontSize: isMobile ? '11px' : '14px', fontWeight: 600 }}>
            Friends
          </Typography>
        </ButtonBase>
        
        {/* My Posts Button */}
        <ButtonBase
          onClick={handleMy}
          className={`
            ${styles.button} 
            ${page === "my" ? styles.activeButton : ''} 
            ${page === "my" && mode === 'dark' ? styles.activeDark : ''}
            ${page === "my" && mode === 'light' ? styles.activeLight : ''}
            ${page !== "my" && mode === 'dark' ? styles.buttonDark : ''}
            ${page !== "my" && mode === 'light' ? styles.buttonLight : ''}
          `}
          aria-label="my posts"
        >
          <NavigationIcon fontSize={isMobile ? 'small' : 'medium'} />
          <Typography variant="body2" sx={{ fontSize: isMobile ? '11px' : '14px', fontWeight: 600 }}>
            My Posts
          </Typography>
        </ButtonBase>
      </Box>
    </Box>
  );
} 