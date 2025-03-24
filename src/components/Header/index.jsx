import * as React from 'react';
import { useState, useEffect } from 'react';
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
  Fab,
  ListItemButton
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import localforage from 'localforage';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import LanguageIcon from '@mui/icons-material/Language';

// Components
import FunctionDrawer from './FunctionDrawer';
import SearchAndSuggestion from './SearchAndSuggestion';
import MessageBox from './MessageBox';

// Redux actions
import { set } from "../redux/Search";

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
  paddingLeft: theme.spacing(2),
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
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
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
  const [suggestionAnchorEl, setSuggestionAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);  
  const [search, setSearch] = useState('');
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(false);
  const [categorySelected, setCategorySelected] = useState([false, false, false, false, false]);
  const [notificationList, setNotificationList] = useState([]);
  const [changed, setChanged] = useState(false);

  // UI state booleans
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const searchSuggestionOpen = !Boolean(suggestionAnchorEl);
  const languageMenuOpen = Boolean(languageAnchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);
  
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, setNotifications, setLogin, avatar, setBadgeContent } = props;

  // Event handlers
  function handleDocumentClick(event) {
    if (event.target.id !== "category" && event.target.id !== "searchInput") {
      document.getElementById("searchInput")?.blur();
      setSuggestionAnchorEl(null);
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, [categorySelected]);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleFocus = (event) => {
    setSuggestionAnchorEl(event.currentTarget);
    event.currentTarget.focus();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearch = () => {
    let index = categorySelected.findIndex(category => category === true);
    dispatch(set({ search, type: index, changed }));
    setChanged(!changed);
    navigate("searchresult");
  };

  const handleSearchChange = (event) => {
    setSearch(event.currentTarget.value);
    setSuggestionAnchorEl(event.currentTarget);
    event.currentTarget.focus();
  };

  const handleLogout = () => {
    localStorage.clear();
    localforage.clear();
    setLogin(false);
    setBadgeContent?.(null);
    navigate("/login");
  };

  const handleInfomation = () => {
    navigate("/userinfo");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleNotificationOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTextBlur = () => {
    if (category) {
      setCategory(false);
    } else {
      setTimeout(() => setSuggestionAnchorEl(null), 100);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Mock data for suggestions
  const mockData = [
    { title: "Helloworld", introduction: "introduction", pic: "", type: "contact" }, 
    { title: "Helloworld", introduction: "introduction", pic: "", type: "movie" }
  ];

  // Component rendering
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
          mt: 1.5,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <MenuItem onClick={handleInfomation}>Account Information</MenuItem>
      <MenuItem onClick={handleSettings}>Settings</MenuItem>
      <MenuItem onClick={handleLogout}>Log Out</MenuItem>
    </Menu>
  );

  const renderLanguageMenu = (
    <Menu 
      anchorEl={languageAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id="language-menu"
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={languageMenuOpen}
      onClose={() => setLanguageAnchorEl(null)}
      PaperProps={{
        elevation: 3,
        sx: { 
          minWidth: 120,
          mt: 1.5,
        },
      }}
    >
      <MenuItem onClick={handleMenuClose}>English</MenuItem>
      <MenuItem onClick={handleMenuClose}>Chinese</MenuItem>
      <MenuItem onClick={handleMenuClose}>Japanese</MenuItem>
    </Menu>
  );

  const renderMessageMenu = (
    <MessageBox 
      notificationsAnchorEl={notificationsAnchorEl} 
      setNotificationsAnchorEl={setNotificationsAnchorEl} 
      notificationsOpen={notificationsOpen}
    />
  );
  
  const suggestionBar = (
    <SearchAndSuggestion 
      categorySelected={categorySelected} 
      setCategorySelected={setCategorySelected} 
      searchResult={mockData} 
      searchSuggestionOpen={searchSuggestionOpen} 
      setSuggestionOpen={setSuggestionAnchorEl} 
      left={open} 
      setCategory={setCategory}
    />
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotificationOpen}>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
        >
          <StyledBadge badgeContent={17} color="error">
            <NotificationsIcon />
          </StyledBadge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <StyledAvatar alt="User Avatar" src={avatar} />
        </IconButton>
        <p>Account</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '0px',
              ...(open && { display: 'none' }),
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.1),
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <AppTitle
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              marginLeft: "2.5%",
              fontSize: '1.5rem'
            }}
          >
            Everything  
          </AppTitle>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box display="flex" justifyContent="center" alignItems="center">
            <Search>
              <SearchInput
                id="searchInput"
                placeholder="Search anything..."
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
                onBlur={handleTextBlur}
                onFocus={handleFocus}
                onKeyPress={handleKeyPress}
              />
              <IconButton 
                type="button" 
                sx={{ 
                  p: '10px',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.1),
                  }
                }} 
                aria-label="search" 
                onClick={handleSearch}
              >
                <SearchIcon />
              </IconButton>
            </Search>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={handleNotificationOpen}
              sx={{ 
                mx: 1,
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1),
                }
              }}
            >
              <StyledBadge badgeContent={17} color="error">
                <NotificationsIcon />
              </StyledBadge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <StyledAvatar alt="User Avatar" src={avatar} />
            </IconButton>
          </Box>
          
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}
      
      <div onMouseDown={(e) => e.preventDefault()}>
        {suggestionBar}
      </div>

      {renderLanguageMenu}
      {renderMessageMenu}
      <FunctionDrawer setOpen={setOpen} open={open} />
    </div>
  );
}