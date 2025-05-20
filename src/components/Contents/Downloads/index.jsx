import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import VideoUtil from '../../../util/io_utils/VideoUtil';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNotification } from '../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../Themes/ThemeContext';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

export default function Downloads() {
    const [checked, setChecked] = React.useState([]);
    const [downloadsRecords, setDownloadsRecords] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const { showNotification } = useNotification();
    const { mode } = useThemeMode();

    const fetchDownloadStatus = React.useCallback(async () => {
        try {
            const response = await VideoUtil.check_current_download_status(setDownloadsRecords);
            if (response === undefined || !response.data) {
                throw new Error("Failed to fetch download data");
            }
            setDownloadsRecords(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to check download status:", err);
            setError(err.message || "Error checking download status");
            
            // Don't show notification for regular interval checks to avoid spamming
            if (!loading) {
                showNotification("Failed to update download status", "error");
            }
        } finally {
            setLoading(false);
        }
    }, [showNotification, loading]);

    React.useEffect(() => {
        // Initial fetch
        fetchDownloadStatus();
        
        const intervalId = setInterval(() => {
            fetchDownloadStatus();
        }, 1000);
        
        return () => clearInterval(intervalId);
    }, [fetchDownloadStatus]);

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

    const handleStop = async () => {
        if (checked.length === 0) {
            showNotification("Please select downloads to stop", "warning");
            return;
        }
        
        try {
            const response = await VideoUtil.batchStop(checked, downloadsRecords, setDownloadsRecords);
            if (response === undefined) {
                throw new Error("Failed to stop downloads");
            }
            showNotification("Downloads stopped successfully", "success");
        } catch (err) {
            console.error("Failed to stop downloads:", err);
            showNotification("Failed to stop downloads: " + (err.message || "Unknown error"), "error");
        }
    };

    const handlePause = async () => {
        if (checked.length === 0) {
            showNotification("Please select downloads to pause", "warning");
            return;
        }
        
        try {
            const response = await VideoUtil.batchPause(checked, downloadsRecords, setDownloadsRecords);
            if (response === undefined) {
                throw new Error("Failed to pause downloads");
            }
            showNotification("Downloads paused successfully", "success");
        } catch (err) {
            console.error("Failed to pause downloads:", err);
            showNotification("Failed to pause downloads: " + (err.message || "Unknown error"), "error");
        }
    };

    const handleContinue = async () => {
        if (checked.length === 0) {
            showNotification("Please select downloads to continue", "warning");
            return;
        }
        
        try {
            const response = await VideoUtil.batchContinue(checked, downloadsRecords, setDownloadsRecords);
            if (response === undefined) {
                throw new Error("Failed to continue downloads");
            }
            showNotification("Downloads resumed successfully", "success");
        } catch (err) {
            console.error("Failed to continue downloads:", err);
            showNotification("Failed to continue downloads: " + (err.message || "Unknown error"), "error");
        }
    };

    const handleRemove = async () => {
        if (checked.length === 0) {
            showNotification("Please select downloads to remove", "warning");
            return;
        }
        
        try {
            const response = await VideoUtil.batchRemove(checked, downloadsRecords, setDownloadsRecords);
            if (response === undefined) {
                throw new Error("Failed to remove downloads");
            }
            
            // Update the checked and downloadsRecords state
            const newDownloads = downloadsRecords.filter(item => !checked.includes(item));
            setDownloadsRecords(newDownloads);
            setChecked([]);
            
            showNotification("Downloads removed successfully", "success");
        } catch (err) {
            console.error("Failed to remove downloads:", err);
            showNotification("Failed to remove downloads: " + (err.message || "Unknown error"), "error");
        }
    };

    const handleRetry = () => {
        setLoading(true);
        fetchDownloadStatus();
    };

    // Format file size to human-readable format
    const formatFileSize = (sizeInBytes) => {
        if (sizeInBytes < 1000000) {
            return (sizeInBytes / 1000).toFixed(2) + " KB";
        } else if (sizeInBytes < 1000000000) {
            return (sizeInBytes / 1000000).toFixed(2) + " MB";
        } else {
            return (sizeInBytes / 1000000000).toFixed(2) + " GB";
        }
    };

    // Format download speed to human-readable format
    const formatSpeed = (speedInBytes) => {
        if (speedInBytes < 1000) {
            return speedInBytes.toFixed(2) + " B/s";
        } else if (speedInBytes < 1000000) {
            return (speedInBytes / 1000).toFixed(2) + " KB/s";
        } else {
            return (speedInBytes / 1000000).toFixed(2) + " MB/s";
        }
    };

    return (
        <Stack 
            spacing={2} 
            direction="column" 
            alignItems="center"
            justifyContent="center"
            sx={{
                minHeight: '100vh',
                backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                paddingY: 3
            }}
        >
            <Typography 
                variant="h5" 
                component="h1" 
                sx={{ 
                    mb: 2, 
                    color: mode === 'dark' ? '#fff' : 'text.primary',
                    fontWeight: 600
                }}
            >
                Downloads Manager
            </Typography>

            <Stack 
                spacing={2} 
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ mb: 3 }}
            >
                <Button 
                    variant="contained" 
                    onClick={handleStop}
                    color="error"
                    sx={{
                        minWidth: '100px',
                        ...(mode === 'dark' && {
                            backgroundColor: '#d32f2f',
                            '&:hover': {
                                backgroundColor: '#b71c1c',
                            }
                        })
                    }}
                >
                    Stop
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handlePause}
                    color="warning"
                    sx={{
                        minWidth: '100px',
                        ...(mode === 'dark' && {
                            backgroundColor: '#ed6c02',
                            '&:hover': {
                                backgroundColor: '#e65100',
                            }
                        })
                    }}
                >
                    Pause
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleContinue}
                    color="success"
                    sx={{
                        minWidth: '100px',
                        ...(mode === 'dark' && {
                            backgroundColor: '#2e7d32',
                            '&:hover': {
                                backgroundColor: '#1b5e20',
                            }
                        })
                    }}
                >
                    Continue
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleRemove}
                    color="primary"
                    sx={{
                        minWidth: '100px',
                        ...(mode === 'dark' && {
                            backgroundColor: '#0288d1',
                            '&:hover': {
                                backgroundColor: '#01579b',
                            }
                        })
                    }}
                >
                    Remove
                </Button>
            </Stack>

            {loading ? (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '300px' 
                    }}
                >
                    <CircularProgress size={60} />
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mt: 2,
                            color: mode === 'dark' ? '#fff' : 'text.primary' 
                        }}
                    >
                        Loading downloads...
                    </Typography>
                </Box>
            ) : error ? (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '300px' 
                    }}
                >
                    <Alert 
                        severity="error" 
                        sx={{ 
                            width: '80%', 
                            mb: 2,
                            backgroundColor: mode === 'dark' ? '#402020' : undefined,
                            color: mode === 'dark' ? '#fff' : undefined
                        }}
                    >
                        {error}
                    </Alert>
                    <Button 
                        variant="contained" 
                        startIcon={<RefreshIcon />}
                        onClick={handleRetry}
                    >
                        Retry
                    </Button>
                </Box>
            ) : downloadsRecords.length === 0 ? (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '300px' 
                    }}
                >
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: mode === 'dark' ? '#fff' : 'text.secondary',
                            fontStyle: 'italic'
                        }}
                    >
                        No active downloads
                    </Typography>
                </Box>
            ) : (
                <List 
                    dense 
                    sx={{ 
                        width: '90%', 
                        maxWidth: '900px',
                        bgcolor: mode === 'dark' ? '#262626' : 'background.paper',
                        borderRadius: 2,
                        boxShadow: mode === 'dark' ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.12)'
                    }}
                >
                    {downloadsRecords.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value.gid}`;
                        const progress = value.total_size === 0 ? 0 : Math.round((value.complete_size / value.total_size) * 100);
                        
                        return (
                            <ListItem
                                key={value.gid}
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={handleToggle(value)}
                                        checked={checked.indexOf(value) !== -1}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                        sx={{
                                            color: mode === 'dark' ? '#fff' : 'primary.main',
                                            '&.Mui-checked': {
                                                color: mode === 'dark' ? '#90caf9' : 'primary.main',
                                            },
                                        }}
                                    />
                                }
                                sx={{
                                    padding: 2,
                                    '&:hover': {
                                        backgroundColor: mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.04)',
                                    },
                                    borderBottom: `1px solid ${mode === 'dark' ? '#333333' : '#f0f0f0'}`,
                                    '&:last-child': {
                                        borderBottom: 'none',
                                    }
                                }}
                            >
                                <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                                    <CircularProgress 
                                        variant="determinate" 
                                        value={progress}
                                        size={48}
                                        thickness={4}
                                        sx={{
                                            color: (() => {
                                                if (value.status === 'paused') return mode === 'dark' ? '#ffb74d' : 'warning.main';
                                                if (value.status === 'error') return mode === 'dark' ? '#ef5350' : 'error.main';
                                                return mode === 'dark' ? '#4fc3f7' : 'primary.main';
                                            })(),
                                            backgroundColor: mode === 'dark' ? '#424242' : '#e0e0e0',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography 
                                            variant="caption" 
                                            component="div" 
                                            sx={{ 
                                                color: mode === 'dark' ? '#fff' : 'text.primary',
                                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {`${progress}%`}
                                        </Typography>
                                    </Box>
                                </Box>

                                <ListItemText 
                                    id={labelId} 
                                    primary={
                                        <Typography 
                                            sx={{ 
                                                color: mode === 'dark' ? '#fff' : 'text.primary',
                                                fontWeight: 500,
                                                display: 'block',
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {value.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: mode === 'dark' ? '#bbdefb' : 'text.secondary',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '8px'
                                                }}
                                            >
                                                <span style={{ 
                                                    display: 'inline-block', 
                                                    backgroundColor: mode === 'dark' ? '#37474f' : '#e3f2fd',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {formatSpeed(value.speed)}
                                                </span>
                                                <span style={{ 
                                                    display: 'inline-block', 
                                                    backgroundColor: mode === 'dark' ? '#37474f' : '#e3f2fd',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {formatFileSize(value.complete_size)}/{formatFileSize(value.total_size)}
                                                </span>
                                                <span style={{ 
                                                    display: 'inline-block', 
                                                    backgroundColor: (() => {
                                                        switch(value.status) {
                                                            case 'active': return mode === 'dark' ? '#1b5e20' : '#e8f5e9';
                                                            case 'paused': return mode === 'dark' ? '#e65100' : '#fff3e0';
                                                            case 'error': return mode === 'dark' ? '#b71c1c' : '#ffebee';
                                                            default: return mode === 'dark' ? '#263238' : '#eceff1';
                                                        }
                                                    })(),
                                                    color: (() => {
                                                        switch(value.status) {
                                                            case 'active': return mode === 'dark' ? '#a5d6a7' : '#2e7d32';
                                                            case 'paused': return mode === 'dark' ? '#ffcc80' : '#e65100';
                                                            case 'error': return mode === 'dark' ? '#ef9a9a' : '#b71c1c';
                                                            default: return mode === 'dark' ? '#b0bec5' : '#37474f';
                                                        }
                                                    })(),
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {value.status}
                                                </span>
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Stack>
    );
}