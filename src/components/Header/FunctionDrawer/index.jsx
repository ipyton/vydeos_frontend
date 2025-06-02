import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip'; // 添加Tooltip导入
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import AuthUtil from '../../../util/io_utils/AuthUtil';
import localforage from 'localforage';
// Import all Material UI icons dynamically
import * as MuiIcons from '@mui/icons-material';
import { useThemeMode } from '../../../Themes/ThemeContext'; 

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : theme.palette.background.default,
  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
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
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : theme.palette.background.default,
  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : theme.palette.background.default,
  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : theme.palette.background.default,
      color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
    },
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

// Helper function to get Material UI icon component by name
const DynamicIcon = ({ iconName }) => {
  const { mode } = useThemeMode(); // Access theme mode
  // Material UI exports icons without the "Icon" suffix
  // Convert "MessageIcon" to "Message" for proper lookup
  const iconNameWithoutSuffix = iconName.replace(/Icon$/, '');
  
  // Default to Inbox if the requested icon doesn't exist
  const IconComponent = MuiIcons[iconNameWithoutSuffix] || MuiIcons['Inbox'];
  return <IconComponent sx={{ color: mode === 'dark' ? '#ffffff' : 'inherit' }} />;
};

export default function FunctionDrawer(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { open, setOpen } = props;
  const [navigationItems, setNavigationItems] = useState([]);
  const { mode } = useThemeMode(); // Access theme mode
  
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const paths = localforage.getItem("paths")
  console.log(paths)

  // Default navigation map with icon names as strings
  const defaultNavigationMap = [
    { name: 'Chat', route: '/chat', iconName: 'Message' },
    { name: 'Trending', route: '/trending', iconName: 'Whatshot' },
    { name: 'Posts', route: '/', iconName: 'Home' },
    { name: 'Videos', route: '/videolist', iconName: 'VideoLibrary' },
    { name: 'Edit', route: '/editor', iconName: 'Edit' },
    { name: 'Friend', route: '/friends', iconName: 'People' },
    { name: 'Settings', route: '/settings', iconName: 'Tune' },
    { name: 'Download', route: '/download', iconName: 'Download' },
    { name: 'Ask', route: '/qa', iconName: 'QuestionAnswer' },
    { name: 'Handle Download Request', route: '/downloadRequestsManager', iconName: 'DownloadForOffline' },
    { name: 'User Management', route: '/userManage', iconName: 'ManageAccounts' },
    { name: 'Role Management', route: '/role', iconName: 'AdminPanelSettings' },
    { name: 'Version Log', route: '/logs', iconName: 'History' },
    { name: 'About', route: '/about', iconName: 'Info' }
  ];
  const iconMap = {
    '/chat': 'Message',
    '/trending': 'Whatshot',
    '/': 'Home',
    '/videolist': 'VideoLibrary',
    '/editor': 'Edit',
    '/friends': 'People',
    '/settings': 'Tune',
    '/download': 'Download',
    '/qa': 'QuestionAnswer',
    '/downloadRequestsManager': 'DownloadForOffline',
    '/userManage': 'ManageAccounts',
    '/role': 'AdminPanelSettings',
    '/logs': 'History',
    '/about': 'Info'
  };
  useEffect(() => {
    // Initialize with default navigation
    localforage.getItem("paths").then(
      (response) => {
        console.log(response)
        let tmp = []
        console.log(response)
        if (!response || response.length === 0) {
          setNavigationItems([]);
          return;
        }
        response.forEach(element => {
          console.log(element.route == "/**")
          if (element.route === "/**") {
            setNavigationItems(defaultNavigationMap);
            return;
          }
          else {
            tmp.push({ name: element.name, route: element.route, iconName: iconMap[element.route] })
            setNavigationItems(tmp)
         }
        });
      }
    ) 


  }, []);

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <Drawer variant="permanent" open={open}   sx={{
      backgroundColor: mode === 'dark' ? '#121212' : '#fff', // or match with MUI theme.paper
      color: mode === 'dark' ? '#fff' : '#000',
      '& .MuiDrawer-paper': {
        backgroundColor: mode === 'dark' ? '#121212' : '#fff',
        color: mode === 'dark' ? '#fff' : '#000',
      },
    }}>
      <DrawerHeader  sx={{
      backgroundColor: mode === 'dark' ? '#121212' : '#fff', // Set header background color
      color: mode === 'dark' ? '#fff' : '#000',              // Set text/icon color in header
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      px: 2, // Optional padding
    }}>
        <IconButton 
          onClick={toggleDrawer}
          sx={{
            color: mode === 'dark' ? '#ffffff' : '#000000',
          }}
        >
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider sx={{
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      }} />
      <List sx={{
        backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : theme.palette.background.default,
        color: mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
        '& .MuiListItemIcon-root': {
          color: mode === 'dark' ? '#ffffff' : 'inherit',
        },
      }}>
        {navigationItems.map((item) => (
          <Tooltip 
            title={item.iconName} 
            placement="right" 
            arrow
            // 只在drawer关闭时显示tooltip，避免与文字重叠
            disableHoverListener={open}
            // 修复快速移动时不显示的问题
            enterDelay={100}
            leaveDelay={0}
            enterNextDelay={50}
            disableInteractive={false}
            followCursor={false}
            key={item.name}
          >
            <ListItem 
              onClick={() => handleNavigation(item.route)} 
              disablePadding 
              sx={{ display: 'block' }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: mode === 'dark' ? '#ffffff' : 'inherit',
                  }}
                >
                  <DynamicIcon iconName={item.iconName} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    '& .MuiTypography-root': {
                      color: mode === 'dark' ? '#ffffff' : 'inherit',
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}