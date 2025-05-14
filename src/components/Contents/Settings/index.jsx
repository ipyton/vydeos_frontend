import React, { useState } from 'react';
import { 
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
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
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useThemeMode } from '../../../Themes/ThemeContext';

export default function SettingsPage() {
  // State for other settings (for demonstration)
  const [notifications, setNotifications] = useState(true);
  const [autoLanguage, setAutoLanguage] = useState(false);
  const [enhancedSecurity, setEnhancedSecurity] = useState(true);
  const { mode, toggleMode } = useThemeMode();

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
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}