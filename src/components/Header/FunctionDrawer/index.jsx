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
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from 'react';
import AuthUtil from '../../../util/io_utils/AuthUtil';
import localforage from 'localforage';
// 按需导入图标，而不是导入整个图标库
import MessageIcon from '@mui/icons-material/Message';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import TuneIcon from '@mui/icons-material/Tune';
import DownloadIcon from '@mui/icons-material/Download';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import InboxIcon from '@mui/icons-material/Inbox';
import { useThemeMode } from '../../../Themes/ThemeContext';
import { CameraIcon } from 'lucide-react';

const drawerWidth = 240;

// 缓存样式混合器
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

// 创建图标映射表，避免动态导入
const ICON_MAP = {
  Message: MessageIcon,
  Whatshot: WhatshotIcon,
  Home: HomeIcon,
  VideoLibrary: VideoLibraryIcon,
  Edit: EditIcon,
  People: PeopleIcon,
  Tune: TuneIcon,
  Download: DownloadIcon,
  QuestionAnswer: QuestionAnswerIcon,
  DownloadForOffline: DownloadForOfflineIcon,
  ManageAccounts: ManageAccountsIcon,
  AdminPanelSettings: AdminPanelSettingsIcon,
  History: HistoryIcon,
  Info: InfoIcon,
  Inbox: InboxIcon,
  Scanner:CameraIcon,
};

// 优化后的图标组件，使用 React.memo
const DynamicIcon = React.memo(({ iconName, isDark }) => {
  const IconComponent = ICON_MAP[iconName] || InboxIcon;
  return <IconComponent sx={{ color: isDark ? '#ffffff' : 'inherit' }} />;
});

DynamicIcon.displayName = 'DynamicIcon';

// 缓存默认导航映射
const DEFAULT_NAVIGATION_MAP = [
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
  { name: 'About', route: '/about', iconName: 'Info' },
  { name: 'Scanner', route: '/scanner', iconName: 'Scanner' }
];

const ICON_ROUTE_MAP = {
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
  '/about': 'Info',
  '/scanner' : "Scanner"
};

// 使用 React.memo 优化 NavigationItem 组件
const NavigationItem = React.memo(({ item, open, isDark, onNavigation }) => {
  const handleClick = useCallback(() => {
    onNavigation(item.route);
  }, [item.route, onNavigation]);

  return (
    <Tooltip 
      title={item.name} 
      placement="right" 
      arrow
      disableHoverListener={open}
      enterDelay={100}
      leaveDelay={0}
      enterNextDelay={50}
      disableInteractive={false}
      followCursor={false}
    >
      <ListItem 
        onClick={handleClick} 
        disablePadding 
        sx={{ display: 'block' }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: isDark ? '#ffffff' : 'inherit',
            }}
          >
            <DynamicIcon iconName={item.iconName} isDark={isDark} />
          </ListItemIcon>
          <ListItemText 
            primary={item.name} 
            sx={{ 
              opacity: open ? 1 : 0,
              '& .MuiTypography-root': {
                color: isDark ? '#ffffff' : 'inherit',
              }
            }} 
          />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
});

NavigationItem.displayName = 'NavigationItem';

export default function FunctionDrawer(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { open, setOpen } = props;
  const [navigationItems, setNavigationItems] = useState([]);
  const { mode } = useThemeMode();
  
  const isDark = mode === 'dark';
  
  // 使用 useCallback 优化事件处理函数
  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const handleNavigation = useCallback((route) => {
    navigate(route);
  }, [navigate]);

  // 使用 useMemo 优化样式计算
  const drawerStyles = useMemo(() => ({
    backgroundColor: isDark ? '#121212' : '#fff',
    color: isDark ? '#fff' : '#000',
    '& .MuiDrawer-paper': {
      backgroundColor: isDark ? '#121212' : '#fff',
      color: isDark ? '#fff' : '#000',
    },
  }), [isDark]);

  const headerStyles = useMemo(() => ({
    backgroundColor: isDark ? '#121212' : '#fff',
    color: isDark ? '#fff' : '#000',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 2,
  }), [isDark]);

  const dividerStyles = useMemo(() => ({
    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  }), [isDark]);

  const listStyles = useMemo(() => ({
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : theme.palette.background.default,
    color: isDark ? '#ffffff' : theme.palette.text.primary,
    '& .MuiListItemIcon-root': {
      color: isDark ? '#ffffff' : 'inherit',
    },
  }), [isDark, theme.palette.background.default, theme.palette.text.primary]);

  const iconButtonStyles = useMemo(() => ({
    color: isDark ? '#ffffff' : '#000000',
  }), [isDark]);

  useEffect(() => {
    let isMounted = true;
    
    const loadNavigationItems = async () => {
      try {
        const response = await localforage.getItem("paths");
        
        if (!isMounted) return;
        
        if (!response || response.length === 0) {
          setNavigationItems([]);
          return;
        }

        const tmp = [];
        for (const element of response) {
          if (element.route === "/**") {
            setNavigationItems(DEFAULT_NAVIGATION_MAP);
            return;
          } else {
            tmp.push({ 
              name: element.name, 
              route: element.route, 
              iconName: ICON_ROUTE_MAP[element.route] || 'Inbox'
            });
          }
        }
        setNavigationItems(tmp);
      } catch (error) {
        console.error('Failed to load navigation items:', error);
        if (isMounted) {
          setNavigationItems([]);
        }
      }
    };

    loadNavigationItems();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Drawer variant="permanent" open={open} sx={drawerStyles}>
      <DrawerHeader sx={headerStyles}>
        <IconButton onClick={toggleDrawer} sx={iconButtonStyles}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider sx={dividerStyles} />
      <List sx={listStyles}>
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.route} // 使用 route 作为 key，因为它更稳定
            item={item}
            open={open}
            isDark={isDark}
            onNavigation={handleNavigation}
          />
        ))}
      </List>
    </Drawer>
  );
}