import * as React from 'react';
import { Box, List, Typography, Stack, AppBar, Tabs, Tab } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import SearchItem from './SearchItem';
import SearchUtil from '../../../../util/io_utils/SearchUtil';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`search-tabpanel-${index}`}
            aria-labelledby={`search-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography component="div">{children}</Typography>
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
        id: `search-tab-${index}`,
        'aria-controls': `search-tabpanel-${index}`,
    };
}

export default function SearchResults(props) {
    const theme = useTheme();
    const { setSelector } = props;
    
    const [value, setValue] = React.useState(0);
    const [list, setList] = React.useState([]);
    const [states, setState] = React.useState([[], [], [], [], []]);
    
    const search = useSelector((state) => state.search.search);
    const searchType = useSelector((state) => state.search.searchType);
    const changed = useSelector((state) => state.search.changed);

    React.useEffect(() => {
        states[value] = list;
        setState(states);
    }, [list]);

    React.useEffect(() => {
        setValue(searchType);
    }, [searchType]);

    React.useEffect(() => {
        if (searchType === -1) {
            // Do nothing
        } else if (searchType === 0) {
            SearchUtil.searchChatContactById(search, setList);
        } else if (searchType === 1) {
            SearchUtil.searchLocalResult(search, setList);
        } else if (searchType === 2) {
            SearchUtil.searchVideos(search, setList);
        } else if (searchType === 3) {
            SearchUtil.searchMusics(search, setList);
        } else if (searchType === 4) {
            SearchUtil.searchPosts(search, setList);
        }
    }, [changed]);

    React.useEffect(() => {
        if (states[value]) {
            if (states[value].length === 0) {
                if (value === -1) {
                    // Do nothing
                } else if (value === 0) {
                    SearchUtil.searchChatContactById(search, setList);
                } else if (value === 1) {
                    SearchUtil.searchLocalResult(search, setList);
                } else if (value === 2) {
                    SearchUtil.searchVideos(search, setList);
                } else if (value === 3) {
                    SearchUtil.searchMusics(search, setList);
                } else if (value === 4) {
                    SearchUtil.searchPosts(search, setList);
                }
            } else {
                setList(states[value]);
            }
        }
    }, [value]);

    const handleChange = (event, idx) => {
        setValue(idx);
    };

    const handleChangeIndex = (index) => {
        setList(states[index]);
        setValue(index);
    };

    return (
        <Stack 
            sx={{ 
                width: "30%", 
                height: "100%", 
                boxShadow: 3, 
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper
            }}
        >
            <AppBar 
                position="static" 
                color="default" 
                elevation={0}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="search category tabs"
                    sx={{ minHeight: 48 }}
                >
                    <Tab label="Users" {...a11yProps(0)} />
                    <Tab label="Chats" {...a11yProps(1)} />
                    <Tab label="Videos" {...a11yProps(2)} />
                    <Tab label="Musics" {...a11yProps(3)} />
                    <Tab label="Posts" {...a11yProps(4)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
                style={{ flexGrow: 1, display: 'flex' }}
                containerStyle={{ height: '100%' }}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto', width: "100%", padding: 0 }}>
                        {list.map((res, idx) => (
                            <SearchItem 
                                key={idx}
                                setSelector={setSelector} 
                                content={res} 
                                type={"contact"} 
                                idx={0}
                            />
                        ))}
                    </List>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto', width: "100%", padding: 0 }}>
                        {list.map((res, idx) => (
                            <SearchItem 
                                key={idx}
                                setSelector={setSelector} 
                                content={res} 
                                idx={1}
                            />
                        ))}
                    </List>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto', width: "100%", padding: 0 }}>
                        {list.map((res, idx) => (
                            <SearchItem 
                                key={idx}
                                setSelector={setSelector} 
                                content={res} 
                                idx={2}
                            />
                        ))}
                    </List>
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto', width: "100%", padding: 0 }}>
                        {list.map((res, idx) => (
                            <SearchItem 
                                key={idx}
                                setSelector={setSelector} 
                                content={res} 
                                type={"music"} 
                                idx={3}
                            />
                        ))}
                    </List>
                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto', width: "100%", padding: 0 }}>
                        {list.map((res, idx) => (
                            <SearchItem 
                                key={idx}
                                setSelector={setSelector} 
                                content={res} 
                                type={"posts"} 
                                idx={4}
                            />
                        ))}
                    </List>
                </TabPanel>
            </SwipeableViews>
        </Stack>
    );
}