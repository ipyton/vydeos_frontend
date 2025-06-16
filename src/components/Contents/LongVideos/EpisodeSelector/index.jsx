import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  IconButton,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useNotification } from '../../../../Providers/NotificationProvider';
import { useThemeMode } from "../../../../Themes/ThemeContext";

const GridEpisodeItem = ({
  item,
  episode,
  theme,
  handleEpisodeChange,
  playableEpisodes = [],
  isDarkMode
}) => {
  // Check if this episode can be played
  const isPlayable = playableEpisodes.includes(item);

  const getItemStyles = () => {
    const baseStyles = {
      textAlign: 'center',
      py: 1.5,
      cursor: isPlayable ? 'pointer' : 'not-allowed',
      transition: 'all 0.2s',
      position: 'relative',
      opacity: isPlayable ? 1 : 0.7,
    };

    if (item === episode) {
      return {
        ...baseStyles,
        bgcolor: theme.palette.primary.main,
        color: 'white',
        '&:hover': isPlayable ? {
          bgcolor: theme.palette.primary.dark,
          transform: 'translateY(-2px)',
          boxShadow: 3
        } : {}
      };
    }

    return {
      ...baseStyles,
      bgcolor: isDarkMode ? '#2d2d2d' : 'background.paper',
      color: isDarkMode ? '#ffffff' : 'text.primary',
      border: isDarkMode ? '1px solid #404040' : 'none',
      '&:hover': isPlayable ? {
        bgcolor: isDarkMode ? '#3d3d3d' : theme.palette.action.hover,
        transform: 'translateY(-2px)',
        boxShadow: 3
      } : {}
    };
  };

  return (
    <Grid item xs={3} sm={2} md={1.5} lg={1.2} key={item}>
      <Paper
        elevation={isDarkMode ? 3 : 2}
        onClick={() => isPlayable && handleEpisodeChange(item)}
        sx={getItemStyles()}
      >
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          {item}
        </Typography>

        {/* Indicator for playable status */}
        {isPlayable ? (
          <PlayCircleIcon
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontSize: 16,
              color: item === episode ? 'white' : theme.palette.success.main
            }}
          />
        ) : (
          <CloudDownloadIcon
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontSize: 16,
              color: item === episode ? 'white' : theme.palette.text.disabled
            }}
          />
        )}
      </Paper>
    </Grid>
  );
};

// List view episode component
const ListEpisodeItem = ({
  item,
  episode,
  theme,
  handleEpisodeChange,
  playableEpisodes = [],
  isDarkMode
}) => {
  // Check if this episode can be played
  const isPlayable = playableEpisodes.includes(item);

  const getItemStyles = () => {
    const baseStyles = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      cursor: isPlayable ? 'pointer' : 'not-allowed',
      transition: 'all 0.2s',
      opacity: isPlayable ? 1 : 0.7,
    };

    if (item === episode) {
      return {
        ...baseStyles,
        bgcolor: theme.palette.primary.main,
        color: 'white',
        '&:hover': isPlayable ? {
          bgcolor: theme.palette.primary.dark
        } : {}
      };
    }

    return {
      ...baseStyles,
      bgcolor: isDarkMode ? '#2d2d2d' : 'background.paper',
      color: isDarkMode ? '#ffffff' : 'text.primary',
      border: isDarkMode ? '1px solid #404040' : 'none',
      '&:hover': isPlayable ? {
        bgcolor: isDarkMode ? '#3d3d3d' : theme.palette.action.hover
      } : {}
    };
  };

  return (
    <Paper
      key={item}
      elevation={isDarkMode ? 3 : 2}
      onClick={() => isPlayable && handleEpisodeChange(item)}
      sx={getItemStyles()}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          Episode {item}
        </Typography>
        {item === episode && (
          <Box
            component="span"
            sx={{
              fontSize: '0.75rem',
              bgcolor: 'rgba(255,255,255,0.2)',
              px: 1,
              py: 0.3,
              borderRadius: 1
            }}
          >
            Now Playing
          </Box>
        )}
        {!isPlayable && (
          <Box
            component="span"
            sx={{
              fontSize: '0.75rem',
              bgcolor: item === episode 
                ? 'rgba(255,255,255,0.2)' 
                : isDarkMode 
                  ? '#404040' 
                  : theme.palette.action.disabledBackground,
              color: item === episode 
                ? 'white' 
                : isDarkMode 
                  ? '#b0b0b0' 
                  : theme.palette.text.disabled,
              px: 1,
              py: 0.3,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <CloudDownloadIcon fontSize="small" />
            waiting
          </Box>
        )}
      </Box>
      <Typography 
        variant="body2" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          color: isDarkMode ? '#ffffff' : 'text.primary'
        }}
      >
        {isPlayable ? (
          item === episode ? 'Selected' : 'Play'
        ) : (
          'Waiting'
        )}
        {isPlayable && item !== episode && <PlayCircleIcon fontSize="small" />}
      </Typography>
    </Paper>
  );
};

const EpisodeSelector = (props) => {
  // props: give video information and season information, set episode.
  //seasonId={currentSeason} setSeasonId={setCurrentSeason} episode={currentEpisode} setEpisode={setCurrentEpisode} totalEpisodes={totalEpisodes} totalSeasons={totalSeasons} details={videoMeta}
  const { seasonId, setSeasonId, episode, setEpisode, details, totalEpisodes, playableEpisodes } = props;
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  
  const [viewMode, setViewMode] = useState('grid');
  const theme = useTheme();
  const isDarkMode = mode === 'dark';

  // 根据主题模式定义样式
  const getThemeStyles = () => {
    return {
      container: {
        backgroundColor: isDarkMode ? '#121212' : 'transparent'
      },
      paper: {
        backgroundColor: isDarkMode ? '#1e1e1e' : 'background.paper',
        color: isDarkMode ? '#ffffff' : 'text.primary',
        border: isDarkMode ? '1px solid #333' : 'none'
      },
      header: {
        background: isDarkMode 
          ? `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
          : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
      },
      selectField: {
        '& .MuiOutlinedInput-root': {
          color: 'white',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white',
          },
        },
        '& .MuiSvgIcon-root': {
          color: 'white',
        }
      },
      viewToggle: {
        bgcolor: 'rgba(255,255,255,0.2)',
        borderRadius: 1,
        p: 0.5,
      },
      menuItem: {
        backgroundColor: isDarkMode ? '#2d2d2d' : 'background.paper',
        color: isDarkMode ? '#ffffff' : 'text.primary',
        '&:hover': {
          backgroundColor: isDarkMode ? '#3d3d3d' : theme.palette.action.hover,
        },
        '&.Mui-selected': {
          backgroundColor: isDarkMode ? '#404040' : theme.palette.action.selected,
          '&:hover': {
            backgroundColor: isDarkMode ? '#4d4d4d' : theme.palette.action.selected,
          }
        }
      }
    };
  };

  const themeStyles = getThemeStyles();

  let episodes = [];
  // Generate episodes array from newest to oldest
  console.log("totalEpisodes:" + totalEpisodes);
  if (totalEpisodes) {
    episodes = Array.from(
      { length: totalEpisodes },
      (_, i) => totalEpisodes - i
    );
  }

  // Season data
  const seasons = [];
  for (let i = 1; i <= details.total_season; i++) {
    seasons.push({
      id: i,
      title: `Season ${i}`,
      episodes: 1
    });
  }

  const handleSeasonChange = (event) => {
    const newSeason = event.target.value;
    setSeasonId(newSeason);
    setEpisode(0);
  };

  const handleEpisodeChange = (episode) => {
    setEpisode(episode);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4, ...themeStyles.container }}>
      <Paper
        elevation={isDarkMode ? 4 : 3}
        sx={{
          ...themeStyles.paper,
          p: 3,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Header with gradient background */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            p: 2,
            borderRadius: 1,
            ...themeStyles.header
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Season dropdown */}
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: 120,
                ...themeStyles.selectField
              }}
            >
              <Select
                value={seasonId}
                onChange={handleSeasonChange}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: isDarkMode ? '#2d2d2d' : 'background.paper',
                      border: isDarkMode ? '1px solid #404040' : 'none'
                    }
                  }
                }}
              >
                {seasons.map((season) => (
                  <MenuItem 
                    key={season.id} 
                    value={season.id}
                    sx={themeStyles.menuItem}
                  >
                    {season.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.3)', 
                height: 24 
              }} 
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                正片
              </Typography>
              <Typography
                variant="body1"
                sx={{ ml: 1, color: 'rgba(255,255,255,0.9)' }}
              >
                ({episode}/{totalEpisodes})
              </Typography>
            </Box>
          </Box>

          {/* View mode toggle */}
          <Box sx={themeStyles.viewToggle}>
            <IconButton
              aria-label="網格視圖"
              onClick={() => setViewMode('grid')}
              sx={{
                p: 0.5,
                color: viewMode === 'grid' ? theme.palette.primary.main : 'white',
                bgcolor: viewMode === 'grid' ? 'white' : 'transparent',
                '&:hover': {
                  bgcolor: viewMode === 'grid' ? 'white' : 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <GridViewIcon />
            </IconButton>
            <IconButton
              aria-label="列表視圖"
              onClick={() => setViewMode('list')}
              sx={{
                p: 0.5,
                color: viewMode === 'list' ? theme.palette.primary.main : 'white',
                bgcolor: viewMode === 'list' ? 'white' : 'transparent',
                '&:hover': {
                  bgcolor: viewMode === 'list' ? 'white' : 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <ViewListIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Episodes container */}
        {viewMode === 'grid' ? (
          <Grid container spacing={1}>
            {episodes.map((item) => (
              <GridEpisodeItem
                key={item}
                item={item}
                episode={episode}
                theme={theme}
                handleEpisodeChange={handleEpisodeChange}
                playableEpisodes={playableEpisodes}
                isDarkMode={isDarkMode}
              />
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {episodes.map((item) => (
              <ListEpisodeItem
                key={item}
                item={item}
                episode={episode}
                theme={theme}
                handleEpisodeChange={handleEpisodeChange}
                playableEpisodes={playableEpisodes}
                isDarkMode={isDarkMode}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EpisodeSelector;