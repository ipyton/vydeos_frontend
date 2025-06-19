import React, { useEffect, useState } from "react";
import PostUtil from "../../../util/io_utils/PostUtil";
import Article from "./Article";
import { useNotification } from '../../../Providers/NotificationProvider';

// Material UI imports
import {
  Box, List, ListItem,Fab,Stack
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


function Item(props) {
  const { login, setLogin, barState, setBarState } = props;

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

  const fabStyle = {
    margin: 1,
    position: 'fixed',
    bottom: 40,
    right: 40,
  };

  return (
    <Box sx={{ width: "80%", margin: "0 auto" }}>
      {/* Posts list */}
      <List>
        {articles && articles.map((article, idx) => (
          <ListItem key={idx}>
            <Article content={article} />
          </ListItem>
        ))}
      </List>
      <AddPostDialog open={open} setOpen={setOpen} articles={articles} setArticles={setArticles} ></AddPostDialog>

      {/* Floating action buttons */}
      <Box sx={fabStyle}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Fab 
            color="primary" 
            onClick={handleClickOpen} 
            aria-label="create post"
          >
            <AddIcon />
          </Fab>
          
          <Fab 
            variant="extended" 
            onClick={handleFriends} 
            color={page === "friend" ? "secondary" : "default"}
            aria-label="friends posts"
            sx={{
              bgcolor: page === "friend" 
                ? 'secondary.main' 
                : mode === 'dark' ? 'background.paper' : undefined,
              color: page === "friend" 
                ? 'secondary.contrastText' 
                : mode === 'dark' ? 'text.primary' : undefined,
            }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Friends
          </Fab>
          
          <Fab 
            variant="extended" 
            onClick={handleMy} 
            color={page === "my" ? "secondary" : "default"}
            aria-label="my posts"
            sx={{
              bgcolor: page === "friend" 
                ? 'secondary.main' 
                : mode === 'dark' ? 'background.paper' : undefined,
              color: page === "friend" 
                ? 'secondary.contrastText' 
                : mode === 'dark' ? 'text.primary' : undefined,
            }}
          >
            <NavigationIcon sx={{ mr: 1 }} />
            My Posts
          </Fab>
        </Stack>
      </Box>
    </Box>
  );
}

export default Item;