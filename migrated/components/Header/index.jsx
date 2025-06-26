import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  Avatar,
  Fab
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';

// Dynamic imports for components
const FunctionDrawer = dynamic(() => import('./FunctionDrawer'), { ssr: false });
const MessageBox = dynamic(() => import('./MessageBox'), { ssr: false });

// Constants
const DRAWER_WIDTH = 240;

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  transition: 'all 0.3s ease',
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: theme.spacing(1),
  transition: theme.transitions.create('width'),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '30ch',
  },
  '&:focus': {
    width: '35ch',
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backdropFilter: 'blur(8px)',
  backgroundColor: alpha(theme.palette.primary.main, 0.95),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#ff4444',
    color: '#ffffff',
    fontWeight: 'bold',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const AppTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '0.5px',
  color: theme.palette.common.white,
  background: 'linear-gradient(45deg, #FFF 30%, #E0E0E0 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

export default function Header(props) {
  // State variables
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [messageCount, setMessageCount] = useState(0);

  // UI state booleans
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);

  // Hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const { setLogin, avatar, setAvatar } = props;

  // Event handlers
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearchChange = (event) => {
    setSearch(event.currentTarget.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      router.push({
        pathname: '/searchresult',
        query: { q: search }
      });
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isLoggedIn');
      // Clear any other auth data
      
      setLogin(false);
      router.push('/login');
    }
    handleMenuClose();
  };

  const handleSettings = () => {
    router.push('/settings');
    handleMenuClose();
  };

  const handleNotificationOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationsAnchorEl(null);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Render menus
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleSettings}>Settings</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotificationOpen}>
        <IconButton size="large" color="inherit">
          <StyledBadge badgeContent={messageCount} color="error">
            <NotificationsIcon />
          </StyledBadge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {avatar ? (
            <StyledAvatar src={avatar} alt="User avatar" />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <AppTitle
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Next.js Blog
          </AppTitle>
          <Search>
            <SearchInput
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              id="searchInput"
            />
            <IconButton
              onClick={handleSearch}
              size="small"
              color="inherit"
              sx={{ ml: 0.5 }}
            >
              <SearchIcon />
            </IconButton>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationOpen}
            >
              <StyledBadge badgeContent={messageCount} color="error">
                <NotificationsIcon />
              </StyledBadge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {avatar ? (
                <StyledAvatar src={avatar} alt="User avatar" />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-mobile"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Function Drawer */}
      <FunctionDrawer open={open} toggleDrawer={toggleDrawer} />
      
      {/* Notification Menu */}
      <MessageBox
        open={notificationsOpen}
        anchorEl={notificationsAnchorEl}
        handleClose={handleNotificationClose}
        notifications={[]} // Will be populated with actual notifications
      />
      
      {renderMobileMenu}
      {renderMenu}
    </>
  );
} 