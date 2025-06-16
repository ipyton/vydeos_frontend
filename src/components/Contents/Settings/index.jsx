import React, { useState } from 'react';
import { 
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme
} from '@mui/material';

// Material UI icons
import {
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  ArrowBack as ArrowBackIcon,
  DeleteSweep as ClearDataIcon,
  CloudDownload as ImportIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useThemeMode } from '../../../Themes/ThemeContext';

export default function SettingsPage() {
  // State for other settings (for demonstration)
  const [notifications, setNotifications] = useState(true);
  const [autoLanguage, setAutoLanguage] = useState(false);
  const [enhancedSecurity, setEnhancedSecurity] = useState(true);
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  const [refreshCacheDialogOpen, setRefreshCacheDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Data import dialog states
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importStep, setImportStep] = useState(0);
  const [sidePassword, setSidePassword] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { mode, toggleMode } = useThemeMode();

  // Mock data for demonstration
  const availableUsers = ['john_doe', 'jane_smith', 'admin_user', 'guest_user'];
  const correctSidePassword = 'import123'; // This should be configured securely

  // Create theme based on current mode
  const theme = createTheme({
    palette: {
      mode: mode, // This will be 'light' or 'dark'
      ...(mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1d1d1d',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
        },
      }),
    },
  });

  // Function to force refresh cache and reload
  const forceRefreshCache = async () => {
    setIsRefreshing(true);
    
    try {
      // Clear Service Worker cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Service worker caches cleared');
      }
      
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('Service workers unregistered');
      }
      
      // Clear browser cache by adding timestamp to URL
      const url = new URL(window.location.href);
      url.searchParams.set('_t', Date.now().toString());
      
      // Force reload with cache bypass
      window.location.replace(url.href);
      
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Fallback: hard reload
      window.location.reload(true);
    }
  };

  // Function to clear all browser data
  const clearAllData = () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Clear IndexedDB (if used)
      if ('indexedDB' in window) {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            indexedDB.deleteDatabase(db.name);
          });
        }).catch(console.error);
      }
      
      // Clear cache if supported
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        }).catch(console.error);
      }
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error('Error clearing data:', error);
      // Still refresh even if there was an error
      window.location.reload();
    }
  };

  const handleClearDataClick = () => {
    setClearDataDialogOpen(true);
  };

  const handleConfirmClearData = () => {
    setClearDataDialogOpen(false);
    clearAllData();
  };

  const handleCancelClearData = () => {
    setClearDataDialogOpen(false);
  };

  // Cache refresh handlers
  const handleRefreshCacheClick = () => {
    setRefreshCacheDialogOpen(true);
  };

  const handleConfirmRefreshCache = () => {
    setRefreshCacheDialogOpen(false);
    forceRefreshCache();
  };

  const handleCancelRefreshCache = () => {
    setRefreshCacheDialogOpen(false);
  };

  // Data import functions
  const handleImportDataClick = () => {
    setImportDialogOpen(true);
    setImportStep(0);
    setSidePassword('');
    setSelectedUser('');
    setSelectedDateTime('');
    setPasswordError('');
  };

  const handlePasswordSubmit = () => {
    if (sidePassword === correctSidePassword) {
      setPasswordError('');
      setImportStep(1);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleUserSelectionNext = () => {
    if (selectedUser) {
      setImportStep(2);
    }
  };

  const handleDateTimeNext = () => {
    if (selectedDateTime) {
      // Here you would typically perform the actual import
      console.log('Importing data for:', { user: selectedUser, dateTime: selectedDateTime });
      setImportDialogOpen(false);
      // Reset states
      setImportStep(0);
      setSidePassword('');
      setSelectedUser('');
      setSelectedDateTime('');
      setPasswordError('');
    }
  };

  const handleImportCancel = () => {
    setImportDialogOpen(false);
    setImportStep(0);
    setSidePassword('');
    setSelectedUser('');
    setSelectedDateTime('');
    setPasswordError('');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please enter the side password to proceed with data import:
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Side Password"
              value={sidePassword}
              onChange={(e) => setSidePassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Select the user for data import:
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedUser}
                label="Select User"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {availableUsers.map((user) => (
                  <MenuItem key={user} value={user}>
                    {user}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Select the date and time for data import:
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              label="Select Date & Time"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const steps = ['Enter Password', 'Select User', 'Select Date & Time'];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This ensures proper background colors */}
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 3, px: 2 }}>
              Settings
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <List>
              {/* Dark Mode Setting */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <ListItem>
                    <ListItemIcon>
                      <DarkModeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Dark Mode" 
                      secondary="Toggle between light and dark themes" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={mode === 'dark'}
                        onChange={toggleMode}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </CardContent>
              </Card>

              {/* Notifications Setting */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Notifications" 
                      secondary="Enable or disable notifications" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications}
                        onChange={() => setNotifications(!notifications)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </CardContent>
              </Card>

              {/* Language Setting */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Auto-detect Language" 
                      secondary="Automatically detect and adjust to system language" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={autoLanguage}
                        onChange={() => setAutoLanguage(!autoLanguage)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </CardContent>
              </Card>

              {/* Security Setting */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Enhanced Security" 
                      secondary="Enable additional security features" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={enhancedSecurity}
                        onChange={() => setEnhancedSecurity(!enhancedSecurity)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </CardContent>
              </Card>
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Data Management Section */}
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                Data Management
              </Typography>
              
              {/* Data Import Button */}
              <Card sx={{ mb: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ImportIcon sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Import Data
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Import user data with password verification
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleImportDataClick}
                      sx={{ 
                        borderColor: 'primary.contrastText',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'primary.contrastText',
                        }
                      }}
                    >
                      Import
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Force Refresh Cache Button */}
              <Card sx={{ mb: 2, backgroundColor: 'warning.main', color: 'warning.contrastText' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RefreshIcon sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Force Refresh Cache
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Clear all cached data and reload to get latest version
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleRefreshCacheClick}
                      disabled={isRefreshing}
                      sx={{ 
                        borderColor: 'warning.contrastText',
                        color: 'warning.contrastText',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'warning.contrastText',
                        },
                        '&:disabled': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Clear All Data Card */}
              <Card sx={{ backgroundColor: 'error.main', color: 'error.contrastText' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ClearDataIcon sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Clear All Data
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Remove all saved data, settings, and cache from this browser
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleClearDataClick}
                      sx={{ 
                        borderColor: 'error.contrastText',
                        color: 'error.contrastText',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'error.contrastText',
                        }
                      }}
                    >
                      Clear Data
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Container>

        {/* Data Import Dialog */}
        <Dialog
          open={importDialogOpen}
          onClose={handleImportCancel}
          aria-labelledby="import-data-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="import-data-dialog-title">
            Data Import
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Stepper activeStep={importStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box sx={{ mt: 2 }}>
              {getStepContent(importStep)}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleImportCancel} color="secondary">
              Cancel
            </Button>
            {importStep === 0 && (
              <Button 
                onClick={handlePasswordSubmit} 
                color="primary" 
                variant="contained"
                disabled={!sidePassword}
              >
                Verify Password
              </Button>
            )}
            {importStep === 1 && (
              <Button 
                onClick={handleUserSelectionNext} 
                color="primary" 
                variant="contained"
                disabled={!selectedUser}
              >
                Next
              </Button>
            )}
            {importStep === 2 && (
              <Button 
                onClick={handleDateTimeNext} 
                color="primary" 
                variant="contained"
                disabled={!selectedDateTime}
              >
                Import Data
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Force Refresh Cache Confirmation Dialog */}
        <Dialog
          open={refreshCacheDialogOpen}
          onClose={handleCancelRefreshCache}
          aria-labelledby="refresh-cache-dialog-title"
          aria-describedby="refresh-cache-dialog-description"
        >
          <DialogTitle id="refresh-cache-dialog-title">
            Force Refresh Cache?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="refresh-cache-dialog-description">
              This will clear all cached data and force reload the page to get the latest version:
              <br />• Service Worker cache
              <br />• Browser cache
              <br />• Unregister Service Workers
              <br /><br />
              The page will automatically reload after clearing the cache. This is useful when you need to ensure you're viewing the most up-to-date version of the application.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelRefreshCache} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmRefreshCache} color="warning" variant="contained" autoFocus>
              Refresh Cache
            </Button>
          </DialogActions>
        </Dialog>

        {/* Clear All Data Confirmation Dialog */}
        <Dialog
          open={clearDataDialogOpen}
          onClose={handleCancelClearData}
          aria-labelledby="clear-data-dialog-title"
          aria-describedby="clear-data-dialog-description"
        >
          <DialogTitle id="clear-data-dialog-title">
            Clear All Data?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="clear-data-dialog-description">
              This will permanently delete all saved data including:
              <br />• Local storage data
              <br />• Session storage data
              <br />• Cookies
              <br />• Cache
              <br />• IndexedDB data
              <br /><br />
              The page will refresh automatically after clearing. This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelClearData} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmClearData} color="error" variant="contained" autoFocus>
              Clear All User Data
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}