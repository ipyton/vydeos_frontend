import * as React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import FriendItem from './FriendItem';
import { Box, useMediaQuery } from '@mui/material';
import Stack from '@mui/material/Stack';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SocialMediaUtil from '../../../../util/io_utils/SocialMediaUtil';
import { useThemeMode } from '../../../../Themes/ThemeContext';
import { useEffect, useState } from 'react';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function Friend(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [value, setValue] = React.useState(0);
    const [list, setList] = React.useState([]);
    const { setSelector } = props;
    const { mode } = useThemeMode();

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isLoading, setIsLoading] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initial data load
    React.useEffect(() => {
        setIsLoading(true);
        SocialMediaUtil.getRelationships(value, setValue, (data) => {
            setList(data);
            setIsLoading(false);
        });
    }, []);

    const handleChange = (event, newValue) => {
        setIsLoading(true);
        SocialMediaUtil.getRelationships(newValue, setValue, (data) => {
            setList(data);
            setIsLoading(false);
        });
    };
    
    const handleChangeIndex = (index) => {
        setValue(index);
    };

    // Calculate optimal list height for different devices
    const listHeight = isMobile ? 
        windowHeight * 0.4 : // Smaller height on mobile
        windowHeight * 0.6;  // Larger height on desktop

    return (
        <Stack sx={{ 
            boxShadow: 1, 
            borderRadius: 2, 
            maxHeight: '100%',
            overflow: 'hidden'
        }} spacing={1}>
            <Box sx={{ 
                bgcolor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
                width: '100%'
            }}>
                <AppBar position="static">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant={isMobile ? "scrollable" : "fullWidth"}
                        scrollButtons={isMobile ? "auto" : false}
                        aria-label="Relationship tabs"
                    >
                        <Tab label="Friends" {...a11yProps(0)} />
                        <Tab label="Follows" {...a11yProps(1)} />
                        <Tab label="Followers" {...a11yProps(2)} />
                        <Tab label="Groups" {...a11yProps(3)} />
                        <Tab label="Invites" {...a11yProps(4)} sx={{ display: isMobile ? 'none' : 'flex' }} />
                        <Tab label="Block" {...a11yProps(5)} sx={{ display: isMobile ? 'none' : 'flex' }} />
                    </Tabs>
                </AppBar>
                
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                    enableMouseEvents={true} // Better touch support
                    resistance={true} // Add resistance for better feel
                >
                    {[0, 1, 2, 3, 4, 5].map((tabIndex) => (
                        <TabPanel value={value} index={tabIndex} dir={theme.direction} key={tabIndex}>
                            <Box sx={{
                                height: listHeight,
                                overflowY: 'auto',
                                WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
                                msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
                                scrollbarWidth: 'none', // Hide scrollbar in Firefox
                                '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar in Chrome/Safari
                            }}>
                                {isLoading ? (
                                    <Typography align="center" sx={{ py: 2 }}>Loading...</Typography>
                                ) : list.length === 0 ? (
                                    <Typography align="center" sx={{ py: 2 }}>No items to display</Typography>
                                ) : (
                                    <List disablePadding>
                                        {list.map((res, idx) => (
                                            <FriendItem 
                                                key={idx}
                                                setSelector={setSelector} 
                                                content={res} 
                                                idx={tabIndex} 
                                            />
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </TabPanel>
                    ))}
                </SwipeableViews>
            </Box>
        </Stack>
    );
}