import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  IconButton,
  Chip,
  Divider,
  useMediaQuery,
  Tabs,
  Tab,
  Button,
  Tooltip
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import PendingIcon from '@mui/icons-material/Pending';

// Sample update log data
const updateLogs = [
  {
    version: "0.0.0",
    date: "2025-04-07",
    changes: [
      { type: "new", content: "Trying the application!" },
    ]
  },
];

// Sample backlog data
const backlogItems = [
  {
    id: "BL-001",
    priority: "high",
    estimatedVersion: "0.1.0",
    title: "User Authorization system",
    description: "Implement secure login and registration functionality",
    status: "planned",
    tags: ["security", "core"]
  },  {
    id: "BL-001",
    priority: "low",
    estimatedVersion: "0.1.0",
    title: "Darkmode",
    description: "Implement darkmode to make it more beautiful",
    status: "planned",
    tags: ["ui/ux"]
  },


];

// Format date function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const UpdateLog = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);
  
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#3b82f6',
          },
          secondary: {
            main: '#8b5cf6',
          },
        },
      }),
    [darkMode],
  );
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Get change type icon/color/label functions
  const getChangeIcon = (type) => {
    switch (type) {
      case 'new':
        return <AddIcon fontSize="small" />;
      case 'fix':
        return <ArrowDownwardIcon fontSize="small" />;
      case 'improvement':
        return <ArrowUpwardIcon fontSize="small" />;
      default:
        return <AddIcon fontSize="small" />;
    }
  };
  
  const getChangeColor = (type) => {
    switch (type) {
      case 'new':
        return 'success';
      case 'fix':
        return 'error';
      case 'improvement':
        return 'warning';
      default:
        return 'info';
    }
  };
  
  const getChangeLabel = (type) => {
    switch (type) {
      case 'new':
        return 'New';
      case 'fix':
        return 'Fix';
      case 'improvement':
        return 'Improvement';
      default:
        return 'Update';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get status icon/color
  const getStatusIcon = (status) => {
    switch (status) {
      case 'planned':
        return <PendingIcon fontSize="small" />;
      case 'in-progress':
        return <AccessTimeIcon fontSize="small" />;
      case 'completed':
        return <ArrowDownwardIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned':
        return 'info';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', mb: 4 }}>
          {/* Dark mode toggle */}
          <IconButton 
            onClick={toggleDarkMode} 
            sx={{ position: 'absolute', right: 0, top: 0 }}
            color="primary"
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                stroke={theme.palette.primary.main} strokeWidth="2"
              />
              <path 
                d="M12 6V12L16 14" 
                stroke={theme.palette.primary.main} strokeWidth="2" strokeLinecap="round"
              />
            </svg>
          </Box>
          
          {/* Title */}
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
            Website Update Log
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ maxWidth: 'lg', mx: 'auto', mb: 2 }}>
            Tracking our continuous improvements and refinements, transparently sharing the product's development journey
          </Typography>
        </Box>

        {/* Tabs for switching between Timeline and Backlog */}
        <Paper sx={{ mb: 4, borderRadius: 2 }} elevation={1}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<HistoryIcon />} 
              label="Update History" 
              iconPosition="start" 
              sx={{ py: 2 }}
            />
            <Tab 
              icon={<AccessTimeIcon />} 
              label="Backlog" 
              iconPosition="start" 
              sx={{ py: 2 }}
            />
          </Tabs>
        </Paper>

        {/* Timeline View */}
        {activeTab === 0 && (
          <Box sx={{ position: 'relative', ml: { xs: 3, md: 4 }, pb: 4 }}>
            {/* Timeline vertical line */}
            <Box 
              sx={{ 
                position: 'absolute', 
                left: 0, 
                top: 0, 
                bottom: 0, 
                width: '2px', 
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: '4px'
              }}
            />

            {updateLogs.map((log, index) => (
              <Box key={log.version} sx={{ position: 'relative', mb: 4 }}>
                {/* Timeline dot */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    left: '-10px', 
                    top: '24px', 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    boxShadow: 3,
                    zIndex: 1
                  }}
                />
                
                <Box 
                  sx={{ 
                    ml: 3, 
                    transition: 'all 0.3s', 
                    transform: 'translateY(0)', 
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        v{log.version}
                      </Typography>
                      <Chip 
                        label={formatDate(log.date)} 
                        variant="outlined" 
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {log.changes.map((change, changeIndex) => (
                        <Box key={changeIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Chip
                            icon={getChangeIcon(change.type)}
                            label={getChangeLabel(change.type)}
                            color={getChangeColor(change.type)}
                            size="small"
                          />
                          <Typography>{change.content}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Backlog View */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="medium">
                Development Backlog
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                size="small"
              >
                Add Item
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {backlogItems.map((item) => (
                <Paper 
                  key={item.id} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    borderLeft: 4, 
                    borderColor: (theme) => theme.palette[getPriorityColor(item.priority)].main,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }} 
                  elevation={1}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
                        <Chip 
                          label={`v${item.estimatedVersion}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.id}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(item.status)}
                      label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    {item.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {item.tags.map((tag) => (
                      <Chip 
                        key={tag}
                        label={tag} 
                        size="small" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default UpdateLog;