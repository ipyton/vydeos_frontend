import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import LanguageIcon from '@mui/icons-material/Language';

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
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [search, setSearch] = React.useState(null);



  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  console.log("---------------------------")
  console.log(isMobileMenuOpen)
  console.log(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    console.log("close")
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    console.log("mobile")
    console.log(event.currentTarget)
    setMobileMoreAnchorEl(event.currentTarget);
  };


  const handleSearch = (event) => {
    console.log(event.currentTarget)
  }

  const handleSearchChange = (event) => {
    setSearch(event.currentTarget.value)
    console.log(event.currentTarget.value)
  }

  const handleLanguageMenuOpen =(event ) => {
    console.log("language changed")
  }
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
    >
      <MenuItem onClick={handleMenuClose}>Account Information</MenuItem>
      {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
      <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
    </Menu>
  );




  const renderLanguageMenu = (
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
  >
    <MenuItem onClick={handleMenuClose}>English</MenuItem>
    {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
    <MenuItem onClick={handleMenuClose}>Chinese</MenuItem>
    <MenuItem onClick={handleMenuClose}>Japanese</MenuItem>
  </Menu>

  )




  
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
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={20} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleLanguageMenuOpen}>
        <IconButton
          size="large"
          aria-label="language"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
        {/* <AccountCircle /> */}
        <LanguageIcon/>
       </IconButton>
        <p>Languages</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
        <AccountCircle />
       </IconButton>
       
        <p>Account</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          
          <IconButton
          size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Everything
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            {/* <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
              /> */}
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="everything you like"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch} >
              <SearchIcon />
            </IconButton>
          </Search>


          <Box sx={{ flexGrow: 1 }} />


          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>


            <IconButton
              size="large"
              edge="end"
              aria-label="language"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleLanguageMenuOpen}
              color="inherit"
            >
              <LanguageIcon />
            </IconButton>


            <IconButton
              size="large"
              edge="end"
              aria-label="account"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
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

    </Box>
  );
}
