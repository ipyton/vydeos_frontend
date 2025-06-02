import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useNotification } from '../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../Themes/ThemeContext';



export default function Trends() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();

  const style = {
    py: 3,
    px: 2,
    width: '100%',
    maxWidth: 900,
    mx: 'auto',
    borderRadius: 3,
    border: 'none',
    backgroundColor: mode === 'dark' ? '#2a2a2a' : 'background.paper',
    boxShadow: mode === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 8px 24px rgba(0, 0, 0, 0.08)',
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Sample data for hottest posts
  const posts = [
    {
      title: "Artificial Intelligence",
      introduction: "Latest advancements in AI are transforming industries worldwide.",
      pic: "https://images.unsplash.com/photo-1739476478915-8646a5f88d0d?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Remote Work",
      introduction: "Companies adapting new policies for hybrid and remote working environments.",
      pic: "https://plus.unsplash.com/premium_photo-1672155840274-fe92cc76dc40?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Renewable Energy",
      introduction: "Sustainable energy solutions gaining momentum in global markets.",
      pic: "https://images.unsplash.com/photo-1739467372234-2aba33f6b7ee?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ];

  // Sample data for hottest movies
  const movies = [
    {
      title: "Inception 2",
      introduction: "Christopher Nolan returns with the long-awaited sequel to his mind-bending thriller.",
      pic: "https://images.unsplash.com/photo-1739467372234-2aba33f6b7ee?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Eternal Sunshine",
      introduction: "A heartwarming sci-fi romance that explores the nature of memory and love.",
      pic: "https://images.unsplash.com/photo-1739467372234-2aba33f6b7ee?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "The Last Journey",
      introduction: "An epic adventure across uncharted territories with stunning visual effects.",
      pic: "https://images.unsplash.com/photo-1739467372234-2aba33f6b7ee?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ];

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ pt: 4 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  const renderList = (items, type) => (
    <List sx={style}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <Divider 
              variant="fullWidth" 
              component="li" 
              sx={{ 
                my: 3,
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)'
              }} 
            />
          )}
          <ListItem
            disablePadding
            sx={{ mb: 2 }}
          >
            <ListItemButton
              sx={{
                borderRadius: 2,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.01)',
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'dark' ? '0 12px 20px rgba(0, 0, 0, 0.6)' : '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  overflow: 'hidden',
                  boxShadow: 'none',
                  borderRadius: 3,
                  bgcolor: mode === 'dark' ? '#2a2a2a' : 'background.paper',
                  position: 'relative',
                  border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                {item.pic && (
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: '100%', sm: 240 },
                        height: { xs: 180, sm: 'auto' },
                        borderRadius: { xs: '8px 8px 0 0', sm: '8px 0 0 8px' },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          filter: mode === 'dark' ? 'brightness(1.1)' : 'brightness(1.05)'
                        }
                      }}
                      image={item.pic}
                      alt={item.title}
                    />
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: type === "post" 
                          ? (mode === 'dark' ? '#ff6b35' : theme.palette.primary.main)
                          : (mode === 'dark' ? '#ffd700' : theme.palette.secondary.main),
                        color: mode === 'dark' ? '#000000' : '#ffffff',
                        fontWeight: 'bold',
                        boxShadow: mode === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {idx + 1}
                    </Box>
                  </Box>
                )}
                <Box 
                  sx={{ 
                    p: 3, 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {type === "post" ? (
                        <LocalFireDepartmentIcon 
                          sx={{ 
                            color: mode === 'dark' ? '#ff6b35' : theme.palette.primary.main 
                          }} 
                        />
                      ) : (
                        <StarIcon 
                          sx={{ 
                            color: mode === 'dark' ? '#ffd700' : theme.palette.secondary.main 
                          }} 
                        />
                      )}
                      <Typography 
                        variant="h5" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          color: mode === 'dark' 
                            ? '#ffffff' 
                            : (type === "post" ? theme.palette.primary.dark : theme.palette.secondary.dark),
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Stack>
                    <Typography 
                      variant="body1"
                      sx={{ 
                        lineHeight: 1.6,
                        fontWeight: 400,
                        letterSpacing: '0.01em',
                        color: mode === 'dark' ? '#e0e0e0' : 'text.secondary'
                      }}
                    >
                      {item.introduction}
                    </Typography>
                  </Stack>
                  
                  <Chip
                    label={type === "post" ? "Trending Article" : "Trending Movie"}
                    size="small"
                    variant={mode === 'dark' ? "filled" : "outlined"}
                    sx={{ 
                      mt: 2,
                      alignSelf: 'flex-start',
                      fontWeight: 500,
                      borderRadius: '16px',
                      backgroundColor: mode === 'dark' 
                        ? (type === "post" ? '#ff6b35' : '#ffd700')
                        : 'transparent',
                      color: mode === 'dark' 
                        ? '#000000'
                        : (type === "post" ? theme.palette.primary.main : theme.palette.secondary.main),
                      borderColor: mode === 'dark' 
                        ? 'transparent'
                        : (type === "post" ? theme.palette.primary.main : theme.palette.secondary.main),
                      '&:hover': {
                        backgroundColor: mode === 'dark' 
                          ? (type === "post" ? '#ff8555' : '#ffdc33')
                          : 'rgba(25, 118, 210, 0.04)'
                      }
                    }}
                  />
                </Box>
              </Card>
            </ListItemButton>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Box 
      sx={{ 
        py: 5, 
        px: 3, 
        backgroundColor: mode === 'dark' ? '#121212' : '#f8f9fa', 
        minHeight: '100vh',
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)' 
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 1, 
          textAlign: 'center', 
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: mode === 'dark' ? '#ffffff' : '#1a1a2e'
        }}
      >
        Trending Content
      </Typography>
      
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 5, 
          textAlign: 'center', 
          color: mode === 'dark' ? '#b0b0b0' : 'text.secondary',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        Discover the most popular topics and movies that everyone is talking about
      </Typography>
      
      <Box 
        sx={{ 
          borderRadius: 3,
          backgroundColor: mode === 'dark' ? '#2a2a2a' : '#fff',
          width: '100%', 
          maxWidth: 500, 
          mx: 'auto',
          boxShadow: mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}
      >
        <Tabs 
          value={value} 
          onChange={handleChange} 
          centered
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              py: 2,
              textTransform: 'none',
              color: mode === 'dark' ? '#b0b0b0' : 'inherit',
              '&.Mui-selected': {
                color: mode === 'dark' ? '#ffffff' : theme.palette.primary.main
              },
              '& .MuiSvgIcon-root': {
                color: mode === 'dark' ? '#b0b0b0' : 'inherit'
              },
              '&.Mui-selected .MuiSvgIcon-root': {
                color: mode === 'dark' ? '#ffffff' : theme.palette.primary.main
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: mode === 'dark' ? '#90caf9' : theme.palette.primary.main,
              height: 3
            }
          }}
        >
          <Tab 
            label="Hottest Posts" 
            icon={<LocalFireDepartmentIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Hottest Movies" 
            icon={<StarIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        {renderList(posts, "post")}
      </TabPanel>
      
      <TabPanel value={value} index={1}>
        {renderList(movies, "movie")}
      </TabPanel>
    </Box>
  );
}