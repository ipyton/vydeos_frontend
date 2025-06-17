import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import {
    ExitToApp as ExitIcon,
    Chat as ChatIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Delete as DeleteIcon,
    PersonRemove as PersonRemoveIcon
} from '@mui/icons-material';
// import { update } from '../../../redux/refresh';
import { useNotification } from '../../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../../Themes/ThemeContext';

export default function Members(props) {
    const { showNotification } = useNotification();
    const { mode } = useThemeMode();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [removeDialog, setRemoveDialog] = useState({ open: false, user: null });
    const [removingUserId, setRemovingUserId] = useState(null);
    
    const isDark = mode === 'dark';
    const cardStyles = {
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.5)' : 3,
        bgcolor: isDark ? "#1a1a1a" : "background.paper",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: 2
    };

    const handleRemoveUser = (user) => {
        setRemoveDialog({ open: true, user });
    };

    const confirmRemoveUser = async () => {
        const userToRemove = removeDialog.user;
        setRemovingUserId(userToRemove.userId || userToRemove.id);
        
        try {
            // Replace this with your actual API call
            // await removeUserFromGroup(userToRemove.userId);
            
            // Update local state
            setMembers(prevMembers => 
                prevMembers.filter(member => 
                    (member.userId || member.id) !== (userToRemove.userId || userToRemove.id)
                )
            );
            showNotification(`${userToRemove.name || userToRemove.userId} has been removed`, 'success');
        } catch (error) {
            showNotification('Failed to remove user', 'error');
        } finally {
            setRemovingUserId(null);
            setRemoveDialog({ open: false, user: null });
        }
    };

    const cancelRemoveUser = () => {
        setRemoveDialog({ open: false, user: null });
    };

    return (
        <>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Tooltip title="Remove user">
                                        <IconButton
                                            onClick={() => handleRemoveUser(user)}
                                            disabled={removingUserId === (user.userId || user.id)}
                                            sx={{
                                                color: isDark ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                                                '&:hover': {
                                                    color: isDark ? "#ff5252" : "error.main",
                                                    bgcolor: isDark ? "rgba(255, 82, 82, 0.1)" : "rgba(211, 47, 47, 0.1)"
                                                }
                                            }}
                                        >
                                            <PersonRemoveIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
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

            {/* Remove User Confirmation Dialog */}
            <Dialog
                open={removeDialog.open}
                onClose={cancelRemoveUser}
                PaperProps={{
                    sx: {
                        bgcolor: isDark ? "#1a1a1a" : "background.paper",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.12)",
                    }
                }}
            >
                <DialogTitle sx={{
                    color: isDark ? "rgba(255, 255, 255, 0.9)" : "text.primary"
                }}>
                    Remove Member
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{
                        color: isDark ? "rgba(255, 255, 255, 0.7)" : "text.secondary"
                    }}>
                        Are you sure you want to remove {removeDialog.user?.name || removeDialog.user?.userId} from this group?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={cancelRemoveUser}
                        sx={{
                            color: isDark ? "rgba(255, 255, 255, 0.7)" : "text.secondary"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmRemoveUser}
                        color="error"
                        disabled={removingUserId !== null}
                        sx={{
                            color: isDark ? "#ff5252" : "error.main"
                        }}
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}