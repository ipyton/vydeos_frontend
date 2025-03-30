import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import IOUtil from "../../../util/ioUtil";
import PostUtil from "../../../util/io_utils/PostUtil";
import Article from "./Article";

// Material UI imports
import {
  Box, List, ListItem, TextField, Typography, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  ImageList, ImageListItem, Accordion, AccordionSummary, AccordionDetails,
  ListItemText, ListItemAvatar, ListItemButton, ListItemIcon,
  Fab, Button, Checkbox, FormGroup, FormControlLabel, Stack, Switch,
  IconButton, Divider
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

// Import createSvgIcon from the correct location
import { createSvgIcon } from '@mui/material/utils';
import { styled } from '@mui/material/styles';

// Create custom Plus icon
const PlusIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>,
  'Plus',
);

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

function Item(props) {
  const { login, setLogin, barState, setBarState } = props;

  // State variables
  const [articles, setArticles] = useState([]);
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState([0]);
  const [picsUrl, setPicsUrl] = useState([]);
  const [postPics, setPostPics] = useState([]);
  const [notice, setNotice] = useState([]);
  const [whoCanSee, setWhoCanSee] = useState([]);
  const [location, setLocation] = useState("");
  const [page, setPage] = useState("friend");
  const [open, setOpen] = useState(false);

  // Handler functions
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleDelete = () => {
    // Logic to delete chips
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setPostPics([]);
    setPicsUrl([]);
    setOpen(false);
  };

  const handleSend = () => {
    PostUtil.sendPost(content, picsUrl, notice, whoCanSee, location, articles, setArticles);
    handleClose();
  };

  const handlePicUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setPostPics([
          ...postPics, 
          { 
            pic: URL.createObjectURL(file), 
            width: img.width, 
            height: img.height 
          }
        ]);
      };
      PostUtil.uploadPicture(file, picsUrl, setPicsUrl);
    };
    reader.readAsDataURL(file);
  };

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

      {/* Create post dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleSend();
          },
        }}
      >
        <DialogTitle>Share Your Thoughts</DialogTitle>
        
        <DialogContent>
          <TextField
            id="post-content"
            label="Say Something"
            multiline
            rows={4}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            variant="filled"
            sx={{ width: "100%", mb: 2 }}
          />
          
          <ImageList sx={{ width: "100%" }} cols={3} rowHeight={164}>
            {postPics.map((item, idx) => (
              <ImageListItem key={idx} sx={{ overflow: 'hidden', padding: 0 }}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  src={item.pic}
                  alt={`Upload ${idx + 1}`}
                />
              </ImageListItem>
            ))}

            {postPics.length < 9 && (
              <ImageListItem>
                <Button
                  component="label"
                  variant="contained"
                  sx={{ width: 1, height: 1 }}
                >
                  <PlusIcon />
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*"
                    onChange={handlePicUpload}
                  />
                </Button>
              </ImageListItem>
            )}
          </ImageList>
        </DialogContent>

        {/* Location accordion */}
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              Location
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Configure a location
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id="location-search"
              label="Search Location"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </AccordionDetails>
        </Accordion>

        {/* Mentions accordion */}
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              Mention Someone
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              <Stack direction="row" spacing={1} sx={{ overflow: "auto" }}>
                {notice.map((person, idx) => (
                  <Chip
                    key={idx}
                    avatar={<Avatar alt={person.name} src={person.avatar} />}
                    label={person.name}
                    variant="outlined"
                    onDelete={() => {
                      setNotice(notice.filter((_, i) => i !== idx));
                    }}
                    sx={{ my: 0.5 }}
                  />
                ))}
              </Stack>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id="people-search"
              label="Search People"
              fullWidth
              sx={{ mb: 2 }}
            />
            <List sx={{ maxHeight: 200, overflow: "auto" }}>
              {articles.slice(0, 5).map((_, idx) => (
                <ListItem key={idx} button onClick={() => {
                  // Add to mentions
                  setNotice([...notice, { name: `Friend ${idx + 1}`, avatar: "" }]);
                }}>
                  <ListItemAvatar>
                    <Avatar alt={`Friend ${idx + 1}`} />
                  </ListItemAvatar>
                  <ListItemText primary={`Friend ${idx + 1}`} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Privacy accordion */}
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              Who Can See
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Public By Default
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Typography>Exclude</Typography>
              <AntSwitch defaultChecked inputProps={{ 'aria-label': 'privacy switch' }} />
              <Typography>Include</Typography>
            </Stack>
            <List sx={{ maxHeight: 200, overflow: "auto" }}>
              {[0, 1, 2, 3].map((value) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  <ListItem
                    key={value}
                    secondaryAction={
                      <IconButton edge="end" aria-label="info">
                        <CommentIcon />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`Friend Group ${value + 1}`} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSend} type="submit" variant="contained" color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>

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
          >
            <EditIcon sx={{ mr: 1 }} />
            Friends
          </Fab>
          
          <Fab 
            variant="extended" 
            onClick={handleMy} 
            color={page === "my" ? "secondary" : "default"}
            aria-label="my posts"
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