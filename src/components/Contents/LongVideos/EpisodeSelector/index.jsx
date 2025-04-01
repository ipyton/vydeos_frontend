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
import VideoUtil from '../../../../util/io_utils/VideoUtil';

const EpisodeSelector = (props) => {
  // props: give video information and season information, set episode.
  const {seasonId, setSeasonId, episode, setEpisode, details} = props;
  const [selectedEpisode, setSelectedEpisode] = useState(14);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [viewMode, setViewMode] = useState('grid');  
  const theme = useTheme();
  
  useEffect(() => {
    if (seasonId &&seasonId !== 0 ) {
      VideoUtil.get_season_meta(details.resource_id, details.type, seasonId).then((res) => {})
      .then()
      .catch((error) => {
        console.error('Error fetching season metadata:', error);
      });
    }
  }, [seasonId])
  
  // Season data
  const seasons = [];
  for (let i = 1; i <= details.season_count; i++) {
    seasons.push({
      id: i,
      title: `Season ${i}`,
      episodes: details.episode_count[i - 1]
    });
  }
  seasons.push({id:-1, title: '添加一季', episodes: details.special_count});
  
  const currentSeason = seasons.find(season => season.id === selectedSeason);
  const totalEpisodes = currentSeason ? currentSeason.episodes : 0;
  
  // Generate episodes array from newest to oldest
  const episodes = Array.from(
    { length: totalEpisodes }, 
    (_, i) => totalEpisodes - i
  );
  
  const handleSeasonChange = (event) => {
    const newSeason = event.target.value;
    setSelectedSeason(newSeason);
    // Automatically select the latest episode of the new season
    setSelectedEpisode(seasons.find(s => s.id === newSeason).episodes);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
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
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Season dropdown */}
            <FormControl 
              variant="outlined" 
              size="small"
              sx={{ 
                minWidth: 120,
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
              }}
            >
              <Select
                value={selectedSeason}
                onChange={handleSeasonChange}
                displayEmpty
              >
                {seasons.map((season) => (
                  <MenuItem key={season.id} value={season.id}>
                    {season.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 24 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                正片
              </Typography>
              <Typography
                variant="body1"
                sx={{ ml: 1, color: 'rgba(255,255,255,0.9)' }}
              >
                ({selectedEpisode}/{totalEpisodes})
              </Typography>
            </Box>
          </Box>
          
          {/* View mode toggle */}
          <Box sx={{ 
            display: 'flex', 
            bgcolor: 'rgba(255,255,255,0.2)', 
            borderRadius: 1,
            p: 0.5,
          }}>
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
            {episodes.map((episode) => (
              <Grid item xs={3} sm={2} md={1.5} lg={1.2} key={episode}>
                <Paper
                  elevation={2}
                  onClick={() => setSelectedEpisode(episode)}
                  sx={{
                    textAlign: 'center',
                    py: 1.5,
                    cursor: 'pointer',
                    bgcolor: episode === selectedEpisode ? theme.palette.primary.main : 'background.paper',
                    color: episode === selectedEpisode ? 'white' : 'text.primary',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: episode === selectedEpisode
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {episode}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {episodes.map((episode) => (
              <Paper
                key={episode}
                elevation={2}
                onClick={() => setSelectedEpisode(episode)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: episode === selectedEpisode ? theme.palette.primary.main : 'background.paper',
                  color: episode === selectedEpisode ? 'white' : 'text.primary',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: episode === selectedEpisode
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Episode {episode}
                  </Typography>
                  {episode === selectedEpisode && (
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
                </Box>
                <Typography variant="body2">
                  {episode === selectedEpisode ? 'Selected' : 'Select'}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EpisodeSelector;