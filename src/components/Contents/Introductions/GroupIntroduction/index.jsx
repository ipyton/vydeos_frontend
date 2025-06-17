import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageUtil from "../../../../util/io_utils/MessageUtil";
import { useEffect } from "react";
import Members from './Members';
import {
    List,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Switch,
    FormControlLabel,
    Box,
    Chip,
    IconButton,
    Fade,
    Tooltip,
    ClickAwayListener,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Collapse
} from '@mui/material';
import {
    ExitToApp as ExitIcon,
    Chat as ChatIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    PhotoCamera as PhotoCameraIcon,
    ContentCopy as CopyIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
// import { update } from '../../../redux/refresh';
import { useNotification } from '../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../Themes/ThemeContext';

export default function GroupDetailsComponent(props) {
    const { showNotification } = useNotification();
    const { mode } = useThemeMode();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isDark = mode === 'dark';

    const [details, setDetails] = useState({
        groupId: "",
        groupName: "",
        groupDescription: "",
        createTime: null,
        config: {},
        avatar: "",
        ownerId: "",
        allow_invite_by_token: false
    });

    const [members, setMembers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    
    // Editing states
    const [editingField, setEditingField] = useState(null); // 'name', 'description', or null
    const [editedValues, setEditedValues] = useState({
        groupName: "",
        groupDescription: "",
        allow_invite_by_token: false
    });

    // Avatar upload states
    const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    // Invitation code state
    const [invitationCode, setInvitationCode] = useState("");

    const handleChat = () => {
        const contact = {
            type: "group",
            groupId: details.groupId,
            name: details.groupName,
            count: 0
        };

        DatabaseManipulator.addRecentContacts([contact]).then(() => {
            navigate("/chat", { ...contact });
            // dispatch(update());
        });
    };

    const handleQuit = () => {
        // Add your quit group logic here
        showNotification("Left the group", "success");
        navigate(-1); // Go back to previous page
    };

    const startEditing = (field) => {
        setEditingField(field);
        setEditedValues({
            groupName: details.groupName,
            groupDescription: details.groupDescription,
            allow_invite_by_token: details.allow_invite_by_token
        });
    };

    const cancelEditing = () => {
        setEditingField(null);
        setEditedValues({
            groupName: details.groupName,
            groupDescription: details.groupDescription,
            allow_invite_by_token: details.allow_invite_by_token
        });
    };

    const saveChanges = async () => {
        try {
            // Add your save logic here
            setDetails(prev => ({
                ...prev,
                groupName: editedValues.groupName,
                groupDescription: editedValues.groupDescription,
                allow_invite_by_token: editedValues.allow_invite_by_token
            }));
            
            setEditingField(null);
            showNotification("Group details updated successfully", "success");
        } catch (error) {
            showNotification("Failed to update group details", "error");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            saveChanges();
        } else if (event.key === 'Escape') {
            cancelEditing();
        }
    };

    // Avatar handling functions
    const handleAvatarClick = () => {
        if (isOwner) {
            setAvatarDialogOpen(true);
            setAvatarPreview(details.avatar);
        }
    };

    const handleAvatarFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showNotification("Avatar file size must be less than 5MB", "error");
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                showNotification("Please select a valid image file", "error");
                return;
            }

            setSelectedAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarSave = async () => {
        try {
            if (selectedAvatar) {
                // Add your avatar upload logic here
                // const uploadResponse = await MessageUtil.uploadGroupAvatar(details.groupId, selectedAvatar);
                
                // For now, just use the preview URL
                setDetails(prev => ({ ...prev, avatar: avatarPreview }));
                showNotification("Avatar updated successfully", "success");
            }
            setAvatarDialogOpen(false);
            setSelectedAvatar(null);
            setAvatarPreview("");
        } catch (error) {
            showNotification("Failed to update avatar", "error");
        }
    };

    const handleAvatarCancel = () => {
        setAvatarDialogOpen(false);
        setSelectedAvatar(null);
        setAvatarPreview("");
    };

    // Invitation code functions
    const generateInvitationCode = async () => {
        try {
            // Add your invitation code generation logic here
            // const response = await MessageUtil.generateInvitationCode(details.groupId);
            
            // For demo purposes, generate a random code
            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
            setInvitationCode(code);
            showNotification("Invitation code generated", "success");
        } catch (error) {
            showNotification("Failed to generate invitation code", "error");
        }
    };

    const copyInvitationCode = () => {
        if (invitationCode) {
            navigator.clipboard.writeText(invitationCode).then(() => {
                showNotification("Invitation code copied to clipboard", "success");
            }).catch(() => {
                showNotification("Failed to copy invitation code", "error");
            });
        }
    };

    useEffect(() => {
        MessageUtil.getGroupDetails(props.groupId).then(response => {
            if (response === undefined || response.data === undefined || response.data.code !== 0) {
                console.log("login error");
                return;
            }
            const details = JSON.parse(response.data.message)
            setDetails(details);
            setEditedValues({
                groupName: details.groupName,
                groupDescription: details.groupDescription,
                allow_invite_by_token: details.allow_invite_by_token
            });

            // Check if current user is the owner
            const currentUserEmail = localStorage.getItem("userId");
            setIsOwner(currentUserEmail === details.ownerId);

            // Generate invitation code if invite by token is enabled
            if (details.allow_invite_by_token) {
                generateInvitationCode();
            }
        });
    }, [props.groupId]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    // Enhanced styling for dark mode
    const cardStyles = {
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.5)' : 3,
        bgcolor: isDark ? "#1a1a1a" : "background.paper",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: 2
    };

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            '& fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.87)',
            },
            '&.Mui-focused fieldset': {
                borderColor: isDark ? '#90caf9' : 'primary.main',
                borderWidth: '2px',
            },
        },
        '& .MuiInputLabel-root': {
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
            '&.Mui-focused': {
                color: isDark ? '#90caf9' : 'primary.main',
            },
        },
        '& .MuiInputBase-input': {
            color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'text.primary',
        },
    };

    const editableTextStyles = {
        cursor: isOwner ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        borderRadius: 1,
        padding: '8px 12px',
        border: `1px solid transparent`,
        '&:hover': isOwner ? {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)'}`,
        } : {},
        position: 'relative'
    };

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            bgcolor: isDark ? "#0a0a0a" : "background.default",
            p: 2,
            minHeight: "100vh"
        }}>
            {/* Header Card */}
            <Card sx={{
                mb: 3,
                ...cardStyles
            }}>
                <CardHeader
                    avatar={
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={details.avatar}
                                onClick={handleAvatarClick}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: isDark ? "#1976d2" : "primary.main",
                                    border: isDark ? "3px solid rgba(255, 255, 255, 0.3)" : "3px solid rgba(0, 0, 0, 0.1)",
                                    boxShadow: isDark ? '0 0 20px rgba(25, 118, 210, 0.3)' : 'none',
                                    cursor: isOwner ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    '&:hover': isOwner ? {
                                        boxShadow: isDark ? '0 0 25px rgba(25, 118, 210, 0.5)' : '0 4px 15px rgba(0, 0, 0, 0.2)',
                                        transform: 'scale(1.05)'
                                    } : {}
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: isDark ? 'white' : 'white'
                                }}>
                                    {details.groupName && details.groupName.charAt(0).toUpperCase()}
                                </Typography>
                            </Avatar>
                            {isOwner && (
                                <Tooltip title="Click to change avatar" arrow>
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: -5,
                                            right: -5,
                                            bgcolor: isDark ? '#1976d2' : 'primary.main',
                                            color: 'white',
                                            width: 32,
                                            height: 32,
                                            boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.5)' : 2,
                                            '&:hover': {
                                                bgcolor: isDark ? '#1565c0' : 'primary.dark',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                        size="small"
                                        onClick={handleAvatarClick}
                                    >
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    }
                    title={
                        <Box sx={{ position: 'relative' }}>
                            {editingField === 'name' ? (
                                <ClickAwayListener onClickAway={cancelEditing}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TextField
                                            value={editedValues.groupName}
                                            onChange={(e) => setEditedValues(prev => ({ ...prev, groupName: e.target.value }))}
                                            onKeyDown={handleKeyPress}
                                            variant="outlined"
                                            size="small"
                                            autoFocus
                                            sx={{
                                                ...textFieldStyles,
                                                '& .MuiInputBase-input': {
                                                    fontSize: '2rem',
                                                    fontWeight: 'bold',
                                                    color: isDark ? "rgba(255, 255, 255, 0.95)" : "text.primary",
                                                }
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                onClick={saveChanges}
                                                sx={{
                                                    color: isDark ? "#81c784" : "success.main",
                                                    bgcolor: isDark ? "rgba(129, 199, 132, 0.15)" : "rgba(76, 175, 80, 0.05)",
                                                }}
                                            >
                                                <SaveIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={cancelEditing}
                                                sx={{
                                                    color: isDark ? "#f44336" : "error.main",
                                                    bgcolor: isDark ? "rgba(244, 67, 54, 0.15)" : "rgba(244, 67, 54, 0.05)",
                                                }}
                                            >
                                                <CancelIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </ClickAwayListener>
                            ) : (
                                <Tooltip title={isOwner ? "Click to edit group name" : ""} arrow>
                                    <Box
                                        onClick={() => isOwner && startEditing('name')}
                                        sx={{
                                            ...editableTextStyles,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            component="h1"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: isDark ? "rgba(255, 255, 255, 0.95)" : "text.primary",
                                                textShadow: isDark ? '0 0 10px rgba(255, 255, 255, 0.1)' : 'none'
                                            }}
                                        >
                                            {details.groupName || "Group Name"}
                                        </Typography>
                                        {isOwner && (
                                            <Fade in={true}>
                                                <EditIcon 
                                                    sx={{ 
                                                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                                        fontSize: '1.2rem',
                                                        opacity: 0.7,
                                                        '&:hover': { opacity: 1 }
                                                    }} 
                                                />
                                            </Fade>
                                        )}
                                    </Box>
                                </Tooltip>
                            )}
                        </Box>
                    }
                    subheader={
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{
                                mb: 1,
                                color: isDark ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                                fontWeight: 500
                            }}>
                                Group ID:
                            </Typography>
                            <Chip
                                label={details.groupId || "N/A"}
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontFamily: 'monospace',
                                    maxWidth: '100%',
                                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                                    borderColor: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.2)",
                                    color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                                    fontWeight: 600,
                                    '& .MuiChip-label': {
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }}
                            />
                        </Box>
                    }
                    action={
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <Button
                                variant="contained"
                                startIcon={<ChatIcon />}
                                onClick={handleChat}
                                sx={{
                                    bgcolor: isDark ? "#1976d2" : "primary.main",
                                    color: 'white',
                                    fontWeight: 600,
                                    boxShadow: isDark ? '0 4px 15px rgba(25, 118, 210, 0.4)' : 'none',
                                    '&:hover': {
                                        bgcolor: isDark ? "#1565c0" : "primary.dark",
                                        boxShadow: isDark ? '0 6px 20px rgba(25, 118, 210, 0.6)' : 'none'
                                    }
                                }}
                            >
                                Chat
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<ExitIcon />}
                                onClick={handleQuit}
                                color="error"
                                sx={{
                                    borderColor: isDark ? "#f44336" : "error.main",
                                    color: isDark ? "#f44336" : "error.main",
                                    fontWeight: 600,
                                    borderWidth: '2px',
                                    '&:hover': {
                                        borderColor: isDark ? "#d32f2f" : "error.dark",
                                        bgcolor: isDark ? "rgba(244, 67, 54, 0.15)" : "rgba(244, 67, 54, 0.05)",
                                        borderWidth: '2px'
                                    }
                                }}
                            >
                                Quit
                            </Button>
                        </Stack>
                    }
                />
            </Card>

            {/* Description Card */}
            <Card sx={{
                mb: 3,
                ...cardStyles
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{
                        color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                        fontWeight: 600
                    }}>
                        Description
                    </Typography>
                    
                    {editingField === 'description' ? (
                        <ClickAwayListener onClickAway={cancelEditing}>
                            <Box>
                                <TextField
                                    value={editedValues.groupDescription}
                                    onChange={(e) => setEditedValues(prev => ({ ...prev, groupDescription: e.target.value }))}
                                    onKeyDown={handleKeyPress}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    autoFocus
                                    placeholder="Enter group description..."
                                    sx={textFieldStyles}
                                />
                                <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                                    <Button
                                        size="small"
                                        onClick={saveChanges}
                                        startIcon={<SaveIcon />}
                                        sx={{
                                            color: isDark ? "#81c784" : "success.main",
                                            bgcolor: isDark ? "rgba(129, 199, 132, 0.15)" : "rgba(76, 175, 80, 0.05)",
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={cancelEditing}
                                        startIcon={<CancelIcon />}
                                        sx={{
                                            color: isDark ? "#f44336" : "error.main",
                                            bgcolor: isDark ? "rgba(244, 67, 54, 0.15)" : "rgba(244, 67, 54, 0.05)",
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </ClickAwayListener>
                    ) : (
                        <Tooltip title={isOwner ? "Click to edit description" : ""} arrow>
                            <Box
                                onClick={() => isOwner && startEditing('description')}
                                sx={{
                                    ...editableTextStyles,
                                    minHeight: 60,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1
                                }}
                            >
                                <Typography variant="body1" sx={{
                                    color: isDark ? "rgba(255, 255, 255, 0.8)" : "text.secondary",
                                    lineHeight: 1.6,
                                    flex: 1,
                                    minHeight: 24
                                }}>
                                    {details.groupDescription || (isOwner ? "Click to add description..." : "No description available")}
                                </Typography>
                                {isOwner && (
                                    <Fade in={true}>
                                        <EditIcon 
                                            sx={{ 
                                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                                fontSize: '1rem',
                                                opacity: 0.7,
                                                mt: 0.2,
                                                '&:hover': { opacity: 1 }
                                            }} 
                                        />
                                    </Fade>
                                )}
                            </Box>
                        </Tooltip>
                    )}
                </CardContent>
            </Card>

            {/* Group Info Card */}
            <Card sx={{
                mb: 3,
                ...cardStyles
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{
                        color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                        fontWeight: 600
                    }}>
                        Group Information
                    </Typography>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="body2" sx={{
                                color: isDark ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                                fontWeight: 500,
                                mb: 0.5
                            }}>
                                Created
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                                bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "transparent",
                                p: 1.5,
                                borderRadius: 1,
                                border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.12)"
                            }}>
                                {formatDate(details.createTime)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{
                                color: isDark ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                                fontWeight: 500,
                                mb: 0.5
                            }}>
                                Owner ID
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                                bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "transparent",
                                p: 1.5,
                                borderRadius: 1,
                                border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.12)",
                                fontFamily: 'monospace',
                                wordBreak: 'break-all'
                            }}>
                                {details.ownerId || "N/A"}
                            </Typography>
                        </Box>
                        
                        {/* Editable Allow Invite by Token */}
                        <Box sx={{
                            ...editableTextStyles,
                            ...(isOwner && {
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)'}`,
                                }
                            })
                        }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editingField ? editedValues.allow_invite_by_token : details.allow_invite_by_token}
                                        onChange={async (e) => {
                                            if (isOwner) {
                                                const newValue = e.target.checked;
                                                setEditedValues(prev => ({ ...prev, allow_invite_by_token: newValue }));
                                                // Auto-save for switch
                                                setDetails(prev => ({ ...prev, allow_invite_by_token: newValue }));
                                                showNotification("Invite setting updated", "success");
                                                
                                                // Generate invitation code if enabled
                                                if (newValue) {
                                                    await generateInvitationCode();
                                                } else {
                                                    setInvitationCode("");
                                                }
                                            }
                                        }}
                                        disabled={!isOwner}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: isDark ? '#90caf9' : 'primary.main',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: isDark ? '#1976d2' : 'primary.light',
                                            },
                                            '& .MuiSwitch-track': {
                                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.38)',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-disabled': {
                                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.26)',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
                                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{
                                            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'text.primary',
                                            fontWeight: 600
                                        }}>
                                            Allow Invite by Token
                                        </Typography>
                                        {isOwner && (
                                            <Typography variant="caption" sx={{
                                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                                fontStyle: 'italic'
                                            }}>
                                                (Auto-saves)
                                            </Typography>
                                        )}
                                    </Box>
                                }
                                sx={{
                                    m: 0,
                                    '& .MuiFormControlLabel-label.Mui-disabled': {
                                        color: isDark ? 'rgba(255, 255, 255, 0.7) !important' : 'rgba(0, 0, 0, 0.38) !important',
                                    }
                                }}
                            />
                        </Box>

                        {/* Invitation Code Section */}
                        <Collapse in={details.allow_invite_by_token}>
                            <Box sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: isDark ? "rgba(25, 118, 210, 0.1)" : "rgba(25, 118, 210, 0.05)",
                                border: isDark ? "1px solid rgba(25, 118, 210, 0.3)" : "1px solid rgba(25, 118, 210, 0.2)",
                                borderRadius: 2
                            }}>
                                <Typography variant="subtitle2" sx={{
                                    color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                                    fontWeight: 600,
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    Invitation Code
                                    {isOwner && (
                                        <Tooltip title="Generate new code" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={generateInvitationCode}
                                                sx={{
                                                    color: isDark ? '#90caf9' : 'primary.main',
                                                    '&:hover': {
                                                        bgcolor: isDark ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)'
                                                    }
                                                }}
                                            >
                                                <RefreshIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Typography>
                                
                                {invitationCode ? (
                                    <TextField
                                        value={invitationCode}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={copyInvitationCode}
                                                        edge="end"
                                                        sx={{
                                                            color: isDark ? '#90caf9' : 'primary.main'
                                                        }}
                                                    >
                                                        <CopyIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            sx: {
                                                fontFamily: 'monospace',
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                                '& fieldset': {
                                                    borderColor: isDark ? 'rgba(144, 202, 249, 0.5)' : 'rgba(25, 118, 210, 0.5)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: isDark ? 'rgba(144, 202, 249, 0.7)' : 'rgba(25, 118, 210, 0.7)',
                                                },
                                            }
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'text.primary',
                                                textAlign: 'center',
                                                letterSpacing: '0.1em'
                                            }
                                        }}
                                    />
                                ) : (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 2,
                                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                        borderRadius: 1,
                                        border: isDark ? '1px dashed rgba(255, 255, 255, 0.3)' : '1px dashed rgba(0, 0, 0, 0.3)'
                                    }}>
                                        {isOwner ? (
                                            <Button
                                                variant="outlined"
                                                startIcon={<RefreshIcon />}
                                                onClick={generateInvitationCode}
                                                sx={{
                                                    color: isDark ? '#90caf9' : 'primary.main',
                                                    borderColor: isDark ? '#90caf9' : 'primary.main'
                                                }}
                                            >
                                                Generate Code
                                            </Button>
                                        ) : (
                                            <Typography sx={{
                                                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                                                fontStyle: 'italic'
                                            }}>
                                                No invitation code available
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                                
                                <Typography variant="caption" sx={{
                                    color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                                    mt: 1,
                                    display: 'block',
                                    fontStyle: 'italic'
                                }}>
                                    Share this code with others to let them join the group
                                </Typography>
                            </Box>
                        </Collapse>
                    </Stack>
                </CardContent>
            </Card>

            {/* Avatar Upload Dialog */}
            <Dialog
                open={avatarDialogOpen}
                onClose={handleAvatarCancel}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: isDark ? "#1a1a1a" : "background.paper",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "none"
                    }
                }}
            >
                <DialogTitle sx={{
                    color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                    borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.12)"
                }}>
                    Change Group Avatar
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3
                    }}>
                        {/* Avatar Preview */}
                        <Avatar
                            src={avatarPreview || details.avatar}
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: isDark ? "#1976d2" : "primary.main",
                                border: isDark ? "3px solid rgba(255, 255, 255, 0.3)" : "3px solid rgba(0, 0, 0, 0.1)",
                                boxShadow: isDark ? '0 0 20px rgba(25, 118, 210, 0.3)' : 'none'
                            }}
                        >
                            <Typography sx={{
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                {details.groupName && details.groupName.charAt(0).toUpperCase()}
                            </Typography>
                        </Avatar>

                        {/* File Input */}
                        <Box sx={{ width: '100%' }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="avatar-upload-input"
                                type="file"
                                onChange={handleAvatarFileChange}
                            />
                            <label htmlFor="avatar-upload-input">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<PhotoCameraIcon />}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        color: isDark ? '#90caf9' : 'primary.main',
                                        borderColor: isDark ? '#90caf9' : 'primary.main',
                                        '&:hover': {
                                            borderColor: isDark ? '#1976d2' : 'primary.dark',
                                            bgcolor: isDark ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.05)'
                                        }
                                    }}
                                >
                                    Choose Image
                                </Button>
                            </label>
                        </Box>

                        {/* Upload Guidelines */}
                        <Typography variant="caption" sx={{
                            color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                            textAlign: 'center',
                            lineHeight: 1.4
                        }}>
                            Supported formats: JPG, PNG, GIF<br/>
                            Maximum file size: 5MB<br/>
                            Recommended size: 400x400 pixels
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.12)",
                    p: 2,
                    gap: 1
                }}>
                    <Button
                        onClick={handleAvatarCancel}
                        sx={{
                            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAvatarSave}
                        variant="contained"
                        disabled={!selectedAvatar}
                        sx={{
                            bgcolor: isDark ? "#1976d2" : "primary.main",
                            '&:hover': {
                                bgcolor: isDark ? "#1565c0" : "primary.dark"
                            }
                        }}
                    >
                        Save Avatar
                    </Button>
                </DialogActions>
            </Dialog>

            <Members></Members>

        </Box>
    );
}