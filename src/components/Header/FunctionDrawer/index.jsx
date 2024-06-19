import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MessageIcon from '@mui/icons-material/Message'; 
import TuneIcon from '@mui/icons-material/Tune';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import HomeIcon from '@mui/icons-material/Home';
// import * as babel from "babel-standalone";
import * as ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom"


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function FunctionDrawer(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const {open, setOpen} = props
  const toggleDrawer = () => {
    setOpen(!open);
  };

  let items = [{name:'Inbox', icon:"Inbox", direct:"www.baidu.com"}]
  let iconName = "MessageIcon"

  let predefined_list = {"Inbox":"InboxIcon", "Message":"MessageIcon", "Settings":"TuneIcon", "Trending":"WhatshotIcon", "Posts":"HomeIcon"}

  // let iconList = {}
  // for (const [key,value] of Object.entries(predefined_list)) {
  //   let iconFunctionString = "()=>{return (<" + value + "></" + value + ">)}"
  //   iconList[key] = eval(babel.transform(iconFunctionString,{presets:["react", "es2017",]}).code)
  // }

// const jsxString = '<div>Hello World!</div>'; 
// const element = React.createElement(eval('(' + jsxString + ')'));

  // const func = new Function("React", "MessageIcon", `return ${iconList["Message"]}`)
  // const Component = func(MessageIcon)
  // const Component = eval("MessageIcon")
  
  // console.log(iconList)
  //return eval(iconList["Message"])
  //return <Component></Component>
  // functionName: method to create this component.

  //let iconList = {"Inbox":function(){return (<InboxIcon></InboxIcon>)}, "Message":"eval(iconFunctionString)", "Settings":TuneIcon, "Trending":WhatshotIcon, "Posts":HomeIcon}

  let functions = ['Chat', 'Trending', 'Posts', 'Videos', 'Edit', 'Friend', 'Settings', "Download"]
  let routeTable = ['/chat', '/trending', '/', '/videolist', '/edit', '/friends', '/settings', "/download"]
  // let routeTable = {'Chat': '/chat', 'Settings': 'settings', 'Trending': 'trending', 'Posts': 'home'}

  let handleMessageJump = (index) => {
    console.log(functions[index])
    navigate(routeTable[index])
  }  



  return (
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {functions.map((text, index) => (
            <ListItem onClick={()=> handleMessageJump(index)} key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {/* {iconList["Inbox"]()} */}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
     
  );
}