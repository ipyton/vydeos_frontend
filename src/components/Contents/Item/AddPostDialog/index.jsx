import {
    Box, List, ListItem, TextField, Typography, Chip, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    ImageList, ImageListItem, Accordion, AccordionSummary, AccordionDetails,
    ListItemText, ListItemAvatar, ListItemButton, ListItemIcon,
    Fab, Button, Checkbox, FormGroup, FormControlLabel, Stack, Switch,
    IconButton, Divider
} from "@mui/material";
import { useThemeMode } from "../../../../Themes/ThemeContext";
import PostUtil from "../../../../util/io_utils/PostUtil";
import { useState } from "react";
import {
    Comment as CommentIcon,
    ExpandMore as ExpandMoreIcon,
    Close as CloseIcon,
} from "@mui/icons-material";

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

// Delete button overlay styled component
const DeleteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    width: 24,
    height: 24,
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    zIndex: 1,
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

    const handleClose = () => {
        setPostPics([]);
        setPicsUrl([]);
        
        setOpen(false);
    }; 

    // 删除照片的处理函数
    const handleDeletePhoto = (indexToDelete) => {
        // 移除对应索引的照片
        const newPostPics = postPics.filter((_, index) => index !== indexToDelete);
        const newPicsUrl = picsUrl.filter((_, index) => index !== indexToDelete);
        
        setPostPics(newPostPics);
        setPicsUrl(newPicsUrl);
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
            PostUtil.uploadPicture(file).then(response => {
            if (response) {
                setPicsUrl([...picsUrl, response.data.message]);
                console.log(postPics)
            }
        });
        };
        reader.readAsDataURL(file);

    };

    const handleSend = () => {
        PostUtil.sendPost(content, picsUrl, notice, whoCanSee, location, articles, setArticles);
        handleClose();
    };

    return (<Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
            sx: {
                bgcolor: mode === 'dark' ? '#121212' : 'white',
                color: mode === 'dark' ? '#fff' : 'inherit',
            }
        }}
    >
        <DialogTitle>Share Your Thoughts</DialogTitle>

        <DialogContent sx={{
            bgcolor: mode === 'dark' ? '#121212' : 'white',
            color: mode === 'dark' ? '#fff' : 'inherit'
        }}>
            <TextField
                id="post-content"
                label="Say Something"
                multiline
                rows={4}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                variant="filled"
                sx={{
                    width: "100%",
                    mb: 2,
                    bgcolor: mode === 'dark' ? '#121212' : 'white',
                    '& .MuiFilledInput-root': {
                        bgcolor: mode === 'dark' ? '#1e1e1e' : 'rgba(0, 0, 0, 0.06)',
                    },
                    '& .MuiInputLabel-root': {
                        color: mode === 'dark' ? '#aaa' : 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .MuiFilledInput-input': {
                        color: mode === 'dark' ? '#fff' : 'inherit',
                    }
                }}
            />

            <ImageList sx={{ width: "100%" }} cols={3} rowHeight={164}>
                {postPics.map((item, idx) => (
                    <ImageListItem key={idx} sx={{ 
                        overflow: 'visible', 
                        padding: 0,
                        position: 'relative'
                    }}>
                        <Box
                            component="img"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 1,
                            }}
                            src={item.pic}
                            alt={`Upload ${idx + 1}`}
                        />
                        <DeleteButton
                            size="small"
                            onClick={() => handleDeletePhoto(idx)}
                            aria-label={`Delete image ${idx + 1}`}
                        >
                            <CloseIcon fontSize="small" />
                        </DeleteButton>
                    </ImageListItem>
                ))}

                {postPics.length < 9 && (
                    <ImageListItem sx={{
                        overflow: 'hidden',
                        padding: 0,
                        bgcolor: mode === 'dark' ? '#1e1e1e' : 'white',
                        '& .MuiImageListItem-img': {
                            bgcolor: mode === 'dark' ? '#1e1e1e' : 'white',
                        }
                    }}>
                        <Button
                            component="label"
                            variant={mode === 'dark' ? "outlined" : "contained"}
                            label="Search Location"
                            sx={{
                                width: 1,
                                height: 1,
                                bgcolor: mode === 'dark' ? '#1e1e1e' : 'primary.main',
                                color: mode === 'dark' ? '#fff' : 'white',
                                border: mode === 'dark' ? '1px dashed rgba(255, 255, 255, 0.3)' : 'none',
                                '&:hover': {
                                    bgcolor: mode === 'dark' ? '#333' : 'primary.dark',
                                }
                            }}
                        >
                            <PlusIcon color={mode === 'dark' ? "#fff" : "white"} />
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
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{
            bgcolor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
            color: mode === 'dark' ? '#fff' : 'inherit',
            '& .MuiAccordionSummary-root': {
                bgcolor: mode === 'dark' ? '#121212' : 'background.paper',
            }
        }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: mode === 'dark' ? '#fff' : 'inherit' }} />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0, color: mode === 'dark' ? '#fff' : 'inherit' }}>
                    Location
                </Typography>
                <Typography sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
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
                    sx={{
                        '& .MuiInputBase-root': {
                            color: mode === 'dark' ? '#fff' : 'inherit',
                        },
                        '& .MuiInputLabel-root': {
                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            }
                        }
                    }}
                />
            </AccordionDetails>
        </Accordion>

        {/* Mentions accordion */}
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{
            bgcolor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
            color: mode === 'dark' ? '#fff' : 'inherit',
            '& .MuiAccordionSummary-root': {
                bgcolor: mode === 'dark' ? '#121212' : 'background.paper',
            }
        }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: mode === 'dark' ? '#fff' : 'inherit' }} />}
                aria-controls="panel2-content"
                id="panel2-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0, color: mode === 'dark' ? '#fff' : 'inherit' }}>
                    Mention Someone
                </Typography>
                <Typography sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
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
                    sx={{
                        '& .MuiInputBase-root': {
                            color: mode === 'dark' ? '#fff' : 'inherit',
                        },
                        '& .MuiInputLabel-root': {
                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            }
                        }
                    }}
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
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{
            bgcolor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
            color: mode === 'dark' ? '#fff' : 'inherit',
            '& .MuiAccordionSummary-root': {
                bgcolor: mode === 'dark' ? '#121212' : 'background.paper',
            }
        }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: mode === 'dark' ? '#fff' : 'inherit' }} />}
                aria-controls="panel3-content"
                id="panel3-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0, color: mode === 'dark' ? '#fff' : 'inherit' }}>
                    Who Can See
                </Typography>
                <Typography sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
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
                                            sx={{
                                                '& .MuiSvgIcon-root': {
                                                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)',
                                                },
                                            }}
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
    </Dialog>)

}