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

export default function Downloads() {
    const [checked, setChecked] = React.useState([]);
    const [downloadsRecords, setDownloadsRecords] = React.useState([])
    const { showNotification } = useNotification();
    const { mode } = useThemeMode();

    // React.useEffect(() => {
    //     VideoUtil.check_current_download_status(setDownloadsRecords)
    // })

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            console.log("checking interval")
            VideoUtil.check_current_download_status(setDownloadsRecords)
        }, 1000)
        return () => clearInterval(intervalId);

    }, [])  


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

    const handleStop = () => {
        VideoUtil.batchStop(checked, downloadsRecords, setDownloadsRecords)
        console.log(checked)
    }

    const handlePause = () => {
        console.log(checked)
        // for (let i = 0; i < checked.length; i++) {

        //     list.push(downloadsRecords[checked[i]])
        // }
        VideoUtil.batchPause(checked, downloadsRecords, setDownloadsRecords)
    }

    const handleContinue = () => {
        VideoUtil.batchContinue(checked, downloadsRecords, setDownloadsRecords)
    }


    const handleRemove = () => {
        VideoUtil.batchRemove(checked, downloadsRecords, setDownloadsRecords)
    }

    console.log(downloadsRecords)
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
            <Stack spacing={2} direction="row">
                <Button 
                    variant="contained" 
                    onClick={handleStop}
                    sx={{
                        ...(mode === 'dark' && {
                            backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                            '&:hover': {
                                backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                            }
                        })
                    }}
                >
                    stop
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handlePause}
                    sx={{
                        ...(mode === 'dark' && {
                            backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                            '&:hover': {
                                backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                            }
                        })
                    }}
                >
                    pause
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleContinue}
                    sx={{
                        ...(mode === 'dark' && {
                            backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                            '&:hover': {
                                backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                            }
                        })
                    }}
                >
                    continue
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleRemove}
                    sx={{
                        ...(mode === 'dark' && {
                            backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                            '&:hover': {
                                backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.default',
                            }
                        })
                    }}
                >
                    remove
                </Button>

            </Stack>

            <List 
                dense 
                sx={{ 
                    width: '80%', 
                    marginLeft: "10%", 
                    bgcolor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
                    // Enhanced styling for dark mode
                    ...(mode === 'dark' && {
                        border: `1px solid ${mode === 'dark' ? '#2c2c2c' : 'grey[800]'}`,
                        borderRadius: 2,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    })
                }}
            >
                {downloadsRecords.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value}`;
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
                                            color: mode === 'dark' ? '#fff' : 'primary.main',
                                        },
                                    }}
                                />
                            }
                            spacing={2}
                            sx={{
                                // Add hover effect for better UX
                                '&:hover': {
                                    backgroundColor: mode === 'dark' ? '#1e1e1e' : 'action.hover',
                                },
                                // Add slight border between items in dark mode
                                ...(mode === 'dark' && {
                                    borderBottom: `1px solid ${mode === 'dark' ? '#2c2c2c' : 'divider'}`,
                                    '&:last-child': {
                                        borderBottom: 'none',
                                    }
                                })
                            }}
                        >


                            <Box sx={{ position: 'relative', display: 'inline-flex', }}>
                                <CircularProgress 
                                    variant="determinate" 
                                    value={value.total_size === 0 ? 0 : value.complete_size / value.total_size * 100}
                                    sx={{
                                        color: mode === 'dark' ? '#fff' : 'primary.main',
                                        // Add a subtle background circle in dark mode
                                        ...(mode === 'dark' && {
                                            '& .MuiCircularProgress-circle': {
                                                backgroundColor: `${mode === 'dark' ? '#fff' : 'primary.main'}`,
                                            }
                                        })
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
                                            color: mode === 'dark' ? '#fff' : 'text.secondary',
                                            fontWeight: 600
                                        }}
                                    >
                                        {`${Math.round(value.total_size === 0 ? 0 : value.complete_size / value.total_size * 100)}%`}
                                    </Typography>
                                </Box>
                            </Box>

                            <ListItemText 
                                id={labelId} 
                                primary={
                                    <Typography 
                                        sx={{ 
                                            color: mode === 'dark' ? '#fff' : 'white',
                                            fontWeight: 500
                                        }}
                                    >
                                        {value.name}
                                    </Typography>
                                }
                                sx={{ paddingLeft: 2 }} 
                                secondary={
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: mode === 'dark' ? '#fff' : 'white',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {value.speed / 1000 + "kbps   " + value.complete_size / 1000000 + "MB/" + value.total_size / 1000000 + "MB" + "      " + value.status}
                                    </Typography>
                                }
                            />

                        </ListItem>
                    );
                })}
            </List>
        </Stack>


    );
}