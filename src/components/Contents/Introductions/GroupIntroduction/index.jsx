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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Settings as SettingsIcon,
    ExitToApp as ExitIcon,
    Chat as ChatIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
import { update } from '../../../redux/refresh';
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
    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedDetails, setEditedDetails] = useState({});

    const handleChat = () => {
        const contact = {
            type: "group",
            groupId: details.groupId,
            name: details.groupName,
            count: 0
        };

        DatabaseManipulator.addRecentContacts([contact]).then(() => {
            console.log(contact)
            navigate("/chat", { ...contact });
            dispatch(update());
        });
    };

    const handleQuit = () => {
        // Add your quit group logic here
        showNotification("Left the group", "success");
        navigate(-1); // Go back to previous page
    };

    const handleSaveChanges = () => {
        // Add your save changes logic here
        setDetails(prev => ({
            ...prev,
            groupName: editedDetails.groupName || prev.groupName,
            groupDescription: editedDetails.groupDescription || prev.groupDescription,
            allow_invite_by_token: editedDetails.allow_invite_by_token ?? prev.allow_invite_by_token
        }));
        setEditMode(false);
        showNotification("Group details updated successfully", "success");
    };

    const handleCancelEdit = () => {
        setEditedDetails({});
        setEditMode(false);
    };

    useEffect(() => {
        MessageUtil.getGroupDetails(props.groupId).then(response => {
            if (response === undefined || response.data === undefined || response.data.code !== 0) {
                console.log("login error");
                return;
            }
            console.log(response.data.message)
            const details = JSON.parse(response.data.message)
            setDetails(details);
            setEditedDetails(details);

            // Check if current user is the owner
            const currentUserEmail = localStorage.getItem("userId");
            setIsOwner(currentUserEmail === details.ownerId);
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
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
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
        '& .MuiInputBase-input.Mui-disabled': {
            color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            WebkitTextFillColor: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)',
        }
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
                        <Avatar
                            src={details.avatar}
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: isDark ? "#1976d2" : "primary.main",
                                border: isDark ? "3px solid rgba(255, 255, 255, 0.3)" : "3px solid rgba(0, 0, 0, 0.1)",
                                boxShadow: isDark ? '0 0 20px rgba(25, 118, 210, 0.3)' : 'none'
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
                    }
                    title={
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
                        <Stack direction={{ xs: "column", sm: "row" }}  spacing={1}>
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
                            {isOwner && (
                                <IconButton
                                    onClick={() => setConfigDialogOpen(true)}
                                    sx={{
                                        color: isDark ? "#90caf9" : "primary.main",
                                        bgcolor: isDark ? "rgba(144, 202, 249, 0.15)" : "rgba(25, 118, 210, 0.05)",
                                        border: isDark ? "1px solid rgba(144, 202, 249, 0.3)" : "1px solid rgba(25, 118, 210, 0.2)",
                                        '&:hover': {
                                            bgcolor: isDark ? "rgba(144, 202, 249, 0.25)" : "rgba(25, 118, 210, 0.1)",
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <SettingsIcon />
                                </IconButton>
                            )}
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
                    <Typography variant="body1" sx={{
                        minHeight: 40,
                        color: isDark ? "rgba(255, 255, 255, 0.8)" : "text.secondary",
                        lineHeight: 1.6,
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "transparent",
                        p: 1.5,
                        borderRadius: 1,
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "none"
                    }}>
                        {details.groupDescription || "No description available"}
                    </Typography>
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
                                wordBreak: 'break-all' // Helps with long IDs on narrow screens
                            }}>
                                {details.ownerId || "N/A"}
                            </Typography>
                        </Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={details.allow_invite_by_token || false}
                                    disabled
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
                            label="Allow Invite by Token"
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    color: isDark ? 'rgba(255, 255, 255, 0.9) !important' : 'text.primary !important',
                                    fontWeight: 600
                                },
                                '& .MuiFormControlLabel-label.Mui-disabled': {
                                    color: isDark ? 'rgba(255, 255, 255, 0.7) !important' : 'rgba(0, 0, 0, 0.38) !important',
                                }
                            }}
                        />
                    </Stack>
                </CardContent>
            </Card>

            {/* Members Card */}
            <Card sx={{
                ...cardStyles
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{
                        color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                        fontWeight: 600
                    }}>
                        Members ({members.length})
                    </Typography>
                    <List>
                        {members.map((user, index) => (
                            <ListItem key={index} sx={{
                                px: 0,
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                                    transform: 'translateX(4px)',
                                    transition: 'all 0.2s ease'
                                }
                            }}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        sx={{
                                            bgcolor: isDark ? "#ff9800" : "secondary.main",
                                            border: isDark ? "2px solid rgba(255, 255, 255, 0.2)" : "2px solid rgba(0, 0, 0, 0.1)",
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {user.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.userId || user.name || "Unknown User"}
                                    secondary={user.name !== user.userId ? user.name : null}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                                            fontWeight: 500
                                        },
                                        '& .MuiListItemText-secondary': {
                                            color: isDark ? "rgba(255, 255, 255, 0.6)" : "text.secondary"
                                        }
                                    }}
                                />
                            </ListItem>
                        ))}
                        {members.length === 0 && (
                            <Typography variant="body2" sx={{
                                p: 2,
                                textAlign: 'center',
                                color: isDark ? "rgba(255, 255, 255, 0.6)" : "text.secondary",
                                fontStyle: 'italic'
                            }}>
                                No members to display
                            </Typography>
                        )}
                    </List>
                </CardContent>
            </Card>

            {/* Owner Configuration Dialog */}
            <Dialog
                open={configDialogOpen}
                onClose={() => setConfigDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: isDark ? "#1a1a1a" : "background.paper",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
                        boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.7)' : 24
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{
                            color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                            fontWeight: 600
                        }}>
                            Group Configuration
                        </Typography>
                        {!editMode ? (
                            <IconButton
                                onClick={() => setEditMode(true)}
                                sx={{
                                    color: isDark ? "#90caf9" : "primary.main",
                                    bgcolor: isDark ? "rgba(144, 202, 249, 0.15)" : "rgba(25, 118, 210, 0.05)",
                                    border: isDark ? "1px solid rgba(144, 202, 249, 0.3)" : "none",
                                    '&:hover': {
                                        bgcolor: isDark ? "rgba(144, 202, 249, 0.25)" : "rgba(25, 118, 210, 0.1)"
                                    }
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        ) : (
                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    onClick={handleSaveChanges}
                                    sx={{
                                        color: isDark ? "#81c784" : "success.main",
                                        bgcolor: isDark ? "rgba(129, 199, 132, 0.15)" : "rgba(76, 175, 80, 0.05)",
                                        border: isDark ? "1px solid rgba(129, 199, 132, 0.3)" : "none",
                                        '&:hover': {
                                            bgcolor: isDark ? "rgba(129, 199, 132, 0.25)" : "rgba(76, 175, 80, 0.1)"
                                        }
                                    }}
                                >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleCancelEdit}
                                    sx={{
                                        color: isDark ? "#f44336" : "error.main",
                                        bgcolor: isDark ? "rgba(244, 67, 54, 0.15)" : "rgba(244, 67, 54, 0.05)",
                                        border: isDark ? "1px solid rgba(244, 67, 54, 0.3)" : "none",
                                        '&:hover': {
                                            bgcolor: isDark ? "rgba(244, 67, 54, 0.25)" : "rgba(244, 67, 54, 0.1)"
                                        }
                                    }}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Stack>
                        )}
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Group Name"
                            value={editMode ? (editedDetails.groupName || '') : details.groupName}
                            onChange={(e) => setEditedDetails(prev => ({ ...prev, groupName: e.target.value }))}
                            variant="outlined"
                            fullWidth
                            disabled={!editMode}
                            sx={textFieldStyles}
                        />
                        <TextField
                            label="Group Description"
                            value={editMode ? (editedDetails.groupDescription || '') : details.groupDescription}
                            onChange={(e) => setEditedDetails(prev => ({ ...prev, groupDescription: e.target.value }))}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            disabled={!editMode}
                            sx={textFieldStyles}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editMode ? (editedDetails.allow_invite_by_token ?? details.allow_invite_by_token) : details.allow_invite_by_token}
                                    onChange={(e) => setEditedDetails(prev => ({ ...prev, allow_invite_by_token: e.target.checked }))}
                                    disabled={!editMode}
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
                            label="Allow Invite by Token"
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    color: isDark ? 'rgba(255, 255, 255, 0.9) !important' : 'text.primary !important',
                                    fontWeight: 600
                                },
                                '& .MuiFormControlLabel-label.Mui-disabled': {
                                    color: isDark ? 'rgba(255, 255, 255, 0.7) !important' : 'rgba(0, 0, 0, 0.38) !important',
                                }
                            }}
                        />

                        <Divider sx={{
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
                            borderWidth: '1px'
                        }} />

                        <Typography variant="subtitle1" sx={{
                            fontWeight: 'bold',
                            color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary"
                        }}>
                            Additional Configuration
                        </Typography>

                        {/* Display config object */}
                        {Object.entries(details.config || {}).length > 0 ? (
                            <Stack spacing={2}>
                                {Object.entries(details.config).map(([key, value]) => (
                                    <TextField
                                        key={key}
                                        label={key}
                                        value={String(value)}
                                        variant="outlined"
                                        size="small"
                                        disabled={!editMode}
                                        fullWidth
                                        sx={textFieldStyles}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body2" sx={{
                                color: isDark ? "rgba(255, 255, 255, 0.6)" : "text.secondary",
                                fontStyle: 'italic',
                                textAlign: 'center',
                                p: 2
                            }}>
                                No additional configuration available
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setConfigDialogOpen(false)}
                        sx={{
                            color: isDark ? "rgba(255, 255, 255, 0.8)" : "text.primary",
                            '&:hover': {
                                bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"
                            }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}