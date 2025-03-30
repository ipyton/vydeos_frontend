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

const style = {
  py: 3,
  px: 2,
  width: '100%',
  maxWidth: 900,
  mx: 'auto',
  borderRadius: 3,
  border: 'none',
  backgroundColor: 'background.paper',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
};

export default function Trends() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Sample data for hottest posts
  const posts = [
    {
      title: "Artificial Intelligence",
      introduction: "Latest advancements in AI are transforming industries worldwide.",
      pic: "/api/placeholder/400/200"
    },
    {
      title: "Remote Work",
      introduction: "Companies adapting new policies for hybrid and remote working environments.",
      pic: "/api/placeholder/400/200"
    },
    {
      title: "Renewable Energy",
      introduction: "Sustainable energy solutions gaining momentum in global markets.",
      pic: "/api/placeholder/400/200"
    },
  ];

  // Sample data for hottest movies
  const movies = [
    {
      title: "Inception 2",
      introduction: "Christopher Nolan returns with the long-awaited sequel to his mind-bending thriller.",
      pic: "/api/placeholder/400/200"
    },
    {
      title: "Eternal Sunshine",
      introduction: "A heartwarming sci-fi romance that explores the nature of memory and love.",
      pic: "/api/placeholder/400/200"
    },
    {
      title: "The Last Journey",
      introduction: "An epic adventure across uncharted territories with stunning visual effects.",
      pic: "/api/placeholder/400/200"
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
          {idx > 0 && <Divider variant="fullWidth" component="li" sx={{ my: 3 }} />}
          <ListItem
            disablePadding
            sx={{ mb: 2 }}
          >
            <ListItemButton
              sx={{
                borderRadius: 2,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.01)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
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
                  bgcolor: 'background.paper',
                  position: 'relative'
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
                          filter: 'brightness(1.05)'
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
                        backgroundColor: type === "post" ? theme.palette.primary.main : theme.palette.secondary.main,
                        color: '#fff',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
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
                        <LocalFireDepartmentIcon sx={{ color: theme.palette.primary.main }} />
                      ) : (
                        <StarIcon sx={{ color: theme.palette.secondary.main }} />
                      )}
                      <Typography 
                        variant="h5" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          color: type === "post" ? theme.palette.primary.dark : theme.palette.secondary.dark,
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Stack>
                    <Typography 
                      color="text.secondary" 
                      variant="body1"
                      sx={{ 
                        lineHeight: 1.6,
                        fontWeight: 400,
                        letterSpacing: '0.01em'
                      }}
                    >
                      {item.introduction}
                    </Typography>
                  </Stack>
                  
                  <Chip
                    label={type === "post" ? "Trending Article" : "Trending Movie"}
                    size="small"
                    color={type === "post" ? "primary" : "secondary"}
                    variant="outlined"
                    sx={{ 
                      mt: 2,
                      alignSelf: 'flex-start',
                      fontWeight: 500,
                      borderRadius: '16px'
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
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 1, 
          textAlign: 'center', 
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#1a1a2e'
        }}
      >
        Trending Content
      </Typography>
      
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 5, 
          textAlign: 'center', 
          color: 'text.secondary',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        Discover the most popular topics and movies that everyone is talking about
      </Typography>
      
      <Box 
        sx={{ 
          borderRadius: 3,
          backgroundColor: '#fff',
          width: '100%', 
          maxWidth: 500, 
          mx: 'auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
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
              textTransform: 'none'
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