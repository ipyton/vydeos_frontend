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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import AuthUtil from '../../../util/io_utils/AuthUtil';

// Import all Material UI icons dynamically
import * as MuiIcons from '@mui/icons-material';

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

// Helper function to get Material UI icon component by name
const DynamicIcon = ({ iconName }) => {
  // Material UI exports icons without the "Icon" suffix
  // Convert "MessageIcon" to "Message" for proper lookup
  const iconNameWithoutSuffix = iconName.replace(/Icon$/, '');
  
  // Default to Inbox if the requested icon doesn't exist
  const IconComponent = MuiIcons[iconNameWithoutSuffix] || MuiIcons['Inbox'];
  return <IconComponent />;
};

export default function FunctionDrawer(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { open, setOpen } = props;
  const [navigationItems, setNavigationItems] = useState([]);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

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

  useEffect(() => {
    // Initialize with default navigation
    setNavigationItems(defaultNavigationMap);
    
    // Fetch available paths when component mounts
    AuthUtil.getPaths()
      .then(response => {
        console.log(response);
        
        // If the API returns navigation data, update the state
        if (response && response.data && Array.isArray(response.data)) {
          // Assuming the response has a format like:
          // [{ name: 'Chat', route: '/chat', iconName: 'MessageIcon' }, ...]
          setNavigationItems(response.data);
        }
      })
      .catch(err => {
        console.log(err);
        // Keep using default navigation on error
      });
  }, []);

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            onClick={() => handleNavigation(item.route)} 
            key={item.name} 
            disablePadding 
            sx={{ display: 'block' }}
          >
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
                <DynamicIcon iconName={item.iconName} />
              </ListItemIcon>
              <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}