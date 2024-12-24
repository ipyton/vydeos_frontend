import * as React from 'react';
import List from '@mui/material/List';

import Typography from '@mui/material/Typography';
import SearchItem from './SearchItem';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SocialMediaUtil from '../../../../util/io_utils/SocialMediaUtil';
import { useLocation } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import SearchUtil from '../../../../util/io_utils/SearchUtil';
import { useSelector } from 'react-redux';

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
                <Box sx={{ p: 3 }}>
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


export default function (props) {

    const theme = useTheme();

    const [value, setValue] = React.useState(0)
    const [list, setList] = React.useState([])
    const { setSelector } = props
    const search = useSelector((state) => state.search.search)
    const searchType = useSelector((state) => state.search.searchType)
    const changed = useSelector((state) => state.search.changed)
    const [states, setState] = React.useState([[], [], [], [], []])
    console.log(changed)
    console.log(search)
    React.useEffect(() => {
        states[value] = list
        setState(states)
    }, [list])

    React.useEffect(()=>{
        setValue(searchType)
    }, [searchType])

    React.useEffect(() => {
        if (searchType === -1) {

        } else if (searchType === 0) {
            SearchUtil.searchChatContactById(search, setList)
        } else if (searchType === 1) {
            SearchUtil.searchLocalResult(search, setList)
        } else if (searchType === 2) {
            SearchUtil.searchVideos(search, setList)
        } else if (searchType === 3) {
            SearchUtil.searchMusics(search, setList)
        } else if (searchType === 4) {
            SearchUtil.searchPosts(search, setList)
        }
        //setValue(searchType)

    }, [changed])


    React.useEffect(() => {
        if (states[value]) {
            if (states[value].length === 0) {
                if (value === -1) {

                } else if (value === 0) {
                    SearchUtil.searchChatContactById(search, setList)
                } else if (value === 1) {
                    SearchUtil.searchLocalResult(search, setList)
                } else if (value === 2) {
                    SearchUtil.searchVideos(search, setList)
                } else if (value === 3) {
                    SearchUtil.searchMusics(search, setList)
                } else if (value === 4) {
                    SearchUtil.searchPosts(search, setList)
                }
            } else {
                setList(states[value])
            }
        }

    }, [value])




    const handleChange = (event, idx) => {
        setValue(idx)
    }

    const handleChangeIndex = (event, index) => {
        console.log("errors")
        setList(states[index])
        setValue(index);
    };

    return (<Stack sx={{ width: "30%", height: "100%", boxShadow: 1, borderRadius: 2 }} >
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    aria-label="full width tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
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
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto',width:"100%"}}>
                        {list.map((res, idx) => {
                            return (<SearchItem setSelector={setSelector} content={res} type={"contact"} idx={0}></SearchItem>)
                        })}
                    </List>

                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto',width: "100%" }}>
                        {list.map((res, idx) => {
                            return (<SearchItem setSelector={setSelector} content={res} type={"chatRecords"} idx={1}></SearchItem>)
                        })}

                    </List>

                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}  >
                    <List overflow="scroll" sx={{ maxHeight: '100%', overflow: 'auto', width: "100%" }}>
                        {list.map((res, idx) => {
                            return (<SearchItem setSelector={setSelector} content={res} type={"movie"} idx={2}></SearchItem>)
                        })}

                    </List>

                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto', width: "100%" }}>
                        {list.map((res, idx) => {
                            return (<SearchItem setSelector={setSelector} content={res} type={"music"} idx={3}></SearchItem>)
                        })}

                    </List>

                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto', width: "100%" }}>
                        {list.map((res, idx) => {
                            return (<SearchItem setSelector={setSelector} content={res} type={"posts"} idx={4}></SearchItem>)
                        })}

                    </List>

                </TabPanel>
            </SwipeableViews>



    </Stack>)

}