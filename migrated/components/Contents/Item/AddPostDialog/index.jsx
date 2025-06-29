import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box, List, ListItem, TextField, Typography, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  ImageList, ImageListItem, Accordion, AccordionSummary, AccordionDetails,
  ListItemText, ListItemAvatar, ListItemButton, ListItemIcon,
  Fab, Button, Checkbox, FormGroup, FormControlLabel, Stack, Switch,
  IconButton, Divider
} from "@mui/material";
import { useThemeMode } from "../../../../contexts/ThemeContext";
import {
  Comment as CommentIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Send as SendIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon
} from "@mui/icons-material";
import { createSvgIcon } from '@mui/material/utils';
import { styled } from '@mui/material/styles';
import styles from '../../../../styles/AddPostDialog.module.css';

// Dynamically import PostUtil to avoid SSR issues
const PostUtil = dynamic(() => import('../../../../utils/PostUtil'), { ssr: false });

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

export default function AddPostDialog({ open, setOpen, articles, setArticles }) {
  const { mode } = useThemeMode();
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState([]);
  const [whoCanSee, setWhoCanSee] = useState([]);
  const [picsUrl, setPicsUrl] = useState([]);
  const [postPics, setPostPics] = useState([]);
  const [location, setLocation] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState([0]);
  const [isClient, setIsClient] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handleDelete = (chipToDelete) => {
    // Logic to delete chips
    if (chipToDelete.type === 'notice') {
      setNotice(notice.filter(item => item !== chipToDelete.value));
    } else if (chipToDelete.type === 'whoCanSee') {
      setWhoCanSee(whoCanSee.filter(item => item !== chipToDelete.value));
    }
  };

  const handleClose = () => {
    setPostPics([]);
    setPicsUrl([]);
    setContent("");
    setLocation("");
    setNotice([]);
    setWhoCanSee([]);
    setExpanded(false);
    
    setOpen(false);
  }; 

  // Delete photo handler
  const handleDeletePhoto = (indexToDelete) => {
    // Remove the photo at the specified index
    const newPostPics = postPics.filter((_, index) => index !== indexToDelete);
    const newPicsUrl = picsUrl.filter((_, index) => index !== indexToDelete);
    
    setPostPics(newPostPics);
    setPicsUrl(newPicsUrl);
  };

  const handlePicUpload = async (event) => {
    if (!isClient) return;
    
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = async () => {
          setPostPics([
            ...postPics,
            {
              pic: URL.createObjectURL(file),
              width: img.width,
              height: img.height
            }
          ]);
          
          try {
            const response = await PostUtil.uploadPicture(file);
            if (response && response.data) {
              setPicsUrl([...picsUrl, response.data.message]);
            }
          } catch (error) {
            console.error("Error uploading picture:", error);
          } finally {
            setIsUploading(false);
          }
        };
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      setIsUploading(false);
    }
  };

  const handleSend = () => {
    if (!isClient || !content.trim()) return;
    
    PostUtil.sendPost(content, picsUrl, notice, whoCanSee, location, articles, setArticles);
    handleClose();
  };

  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Share Your Thoughts</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={`${styles.dialogContent} ${mode === 'dark' ? styles.dialogContentDark : styles.dialogContentLight}`}>
        <TextField
          id="post-content"
          label="Say Something"
          multiline
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          variant="filled"
          className={`${styles.textField} ${mode === 'dark' ? styles.textFieldDark : styles.textFieldLight}`}
          InputProps={{
            className: mode === 'dark' ? styles.input : '',
          }}
          InputLabelProps={{
            className: mode === 'dark' ? styles.label : '',
          }}
        />

        <ImageList className={styles.imageList} cols={3} rowHeight={164}>
          {postPics.map((item, idx) => (
            <ImageListItem key={idx} className={styles.imageListItem}>
              <Box
                component="img"
                className={styles.imagePreview}
                src={item.pic}
                alt={`Upload ${idx + 1}`}
              />
              <IconButton
                size="small"
                onClick={() => handleDeletePhoto(idx)}
                className={styles.deleteButton}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>

        <Accordion 
          expanded={expanded === 'panel1'} 
          onChange={handleChange('panel1')}
          className={`${styles.accordion} ${mode === 'dark' ? styles.accordionDark : styles.accordionLight}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            className={`${styles.accordionSummary} ${mode === 'dark' ? styles.accordionSummaryDark : styles.accordionSummaryLight}`}
          >
            <Typography>Advanced Options</Typography>
          </AccordionSummary>
          <AccordionDetails className={`${styles.accordionDetails} ${mode === 'dark' ? styles.accordionDetailsDark : styles.accordionDetailsLight}`}>
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />,
              }}
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle', color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />
                Who can see this post
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {whoCanSee.map((person, index) => (
                  <Chip
                    key={index}
                    label={person}
                    onDelete={() => handleDelete({ type: 'whoCanSee', value: person })}
                    className={`${styles.chip} ${mode === 'dark' ? styles.chipDark : styles.chipLight}`}
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle', color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />
                Notify these people
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {notice.map((person, index) => (
                  <Chip
                    key={index}
                    label={person}
                    onDelete={() => handleDelete({ type: 'notice', value: person })}
                    className={`${styles.chip} ${mode === 'dark' ? styles.chipDark : styles.chipLight}`}
                  />
                ))}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </DialogContent>

      <DialogActions sx={{ 
        padding: '16px 24px', 
        borderTop: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }}>
        <Button 
          component="label" 
          variant="contained" 
          startIcon={<ImageIcon />}
          disabled={isUploading}
          className={`${styles.uploadButton} ${mode === 'dark' ? styles.uploadButtonDark : styles.uploadButtonLight}`}
        >
          {isUploading ? 'Uploading...' : 'Add Photo'}
          <VisuallyHiddenInput type="file" accept="image/*" onChange={handlePicUpload} />
        </Button>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Button 
          onClick={handleClose}
          className={styles.cancelButton}
        >
          Cancel
        </Button>
        
        <Button 
          onClick={handleSend} 
          variant="contained" 
          endIcon={<SendIcon />}
          disabled={!content.trim() || isUploading}
          className={`${styles.sendButton} ${mode === 'dark' ? styles.sendButtonDark : styles.sendButtonLight}`}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
} 