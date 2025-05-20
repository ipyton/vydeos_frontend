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
import { useNotification } from '../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../Themes/ThemeContext';
const EpisodeSelector = (props) => {
  // props: give video information and season information, set episode.
  const { seasonId, setSeasonId, episode, setEpisode, details, totalSeason, setTotalSeason, position } = props;
  //position is one of : manager, player
  // which decide to show/hide the add button.
  //const [selectedEpisode, setSelectedEpisode] = useState(1);
  //const [selectedSeason, setSelectedSeason] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const theme = useTheme();
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [episodes, setEpisodes] = useState([]);
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  // // Generate episodes array from newest to oldest

  useEffect(() => {
    if (seasonId && seasonId !== 0) {
      VideoUtil.get_season_meta(details.resource_id, details.type, seasonId).then((res) => {
        if (res.data.code === 0 && res.data.message !== "null") {
          let result = JSON.parse(res.data.message)
          const episodes = Array.from(
            { length: result.totalEpisode },
            (_, i) => result.totalEpisode - i
          );
          episodes.push("Add");
          setEpisodes(episodes);
          setTotalEpisodes(result.totalEpisode);
        } else {
          setEpisodes([]);
          setTotalEpisodes(0);
          setEpisode(0);
        }

      })

        .catch((error) => {
          console.error('Error fetching season metadata:', error);
        });
    }
  }, [seasonId])

  // Season data
const seasons = [];
if (totalSeason && totalSeason > 0) {
  for (let i = 1; i <= totalSeason; i++) {
    seasons.push({
      id: i,
      title: `Season ${i}`,
      episodes: 1
    });
  }
  seasons.push({ id: -1, title: 'Add', episodes: details?.totalEpisodes || 0 });
} else {
  // If no seasons, just add the "Add" option
  seasons.push({ id: -1, title: 'Add', episodes: 0 });
}

  const currentSeason = seasons.find(season => season.id === seasonId);
  // const totalEpisodes = currentSeason ? currentSeason.episodes : 0;



const handleSeasonChange = (event) => {
  const newSeason = event.target.value;
  if (event.target.value === -1) {
    // Add is clicked
    VideoUtil.add_season(details.resource_id, details.type)
      .then((res) => {
        if (!res || !res.data) {
          showNotification("Failed to receive response when adding season", "error");
          return;
        }
        if (res.data.code === -1) {
          showNotification("Error adding season: " + (res.data.message || "Unknown error"), "error");
          return;
        }
        else {
          setTotalSeason(totalSeason + 1);
          showNotification("Season added successfully", "success");
        }
      })
      .catch((error) => {
        showNotification("Network error while adding season: " + (error.message || "Unknown error"), "error");
      });
  }
  else {
    setSeasonId(newSeason);
    setEpisode(0);
  }
};

const handleEpisodeChange = (episode) => {
  if (episode === "Add") {
    // Add is clicked
    if (!details || !details.resource_id || !details.type) {
      showNotification("Missing video details", "error");
      return;
    }
    
    if (!seasonId) {
      showNotification("Please select a season first", "warning");
      return;
    }
    
    VideoUtil.add_episode(details.resource_id, details.type, seasonId)
      .then((res) => {
        if (!res || !res.data) {
          showNotification("Failed to receive response when adding episode", "error");
          return;
        }
        if (res.data.code === -1) {
          showNotification("Error adding episode: " + (res.data.message || "Unknown error"), "error");
          return;
        }
        else {
          const newEpisodes = [...episodes];
          newEpisodes.unshift(totalEpisodes + 1);
          setEpisodes(newEpisodes);
          setTotalEpisodes(totalEpisodes + 1);
          showNotification("Episode added successfully", "success");
        }
      })
      .catch((error) => {
        showNotification("Network error while adding episode: " + (error.message || "Unknown error"), "error");
      });
  }
  else {
    setEpisode(episode);
  }
};
useEffect(() => {
  if (seasonId && seasonId !== 0) {
    if (!details || !details.resource_id || !details.type) {
      console.error('Missing video details for fetching season metadata');
      return;
    }
    
    VideoUtil.get_season_meta(details.resource_id, details.type, seasonId)
      .then((res) => {
        if (!res || !res.data) {
          showNotification("Failed to receive response when fetching season data", "error");
          return;
        }
        
        if (res.data.code === 0 && res.data.message !== "null") {
          try {
            let result = JSON.parse(res.data.message);
            const episodes = Array.from(
              { length: result.totalEpisode },
              (_, i) => result.totalEpisode - i
            );
            episodes.push("Add");
            setEpisodes(episodes);
            setTotalEpisodes(result.totalEpisode);
          } catch (error) {
            showNotification("Error parsing season data: " + error.message, "error");
            setEpisodes([]);
            setTotalEpisodes(0);
            setEpisode(0);
          }
        } else {
          setEpisodes([]);
          setTotalEpisodes(0);
          setEpisode(0);
          
          if (res.data.code !== 0) {
            showNotification("Error fetching season data: " + (res.data.message || "Unknown error"), "warning");
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching season metadata:', error);
        showNotification("Failed to load season data: " + (error.message || "Unknown error"), "error");
        setEpisodes([]);
        setTotalEpisodes(0);
      });
  }
}, [seasonId, details]);


  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 2,
      overflow: 'hidden',
      backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
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
        background: mode === 'dark'
          ? 'linear-gradient(90deg, #1565c0 0%, #0d47a1 100%)'
          : 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
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
            },
          }}
        >
          <Select
            value={seasonId}
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

        <Divider
          orientation="vertical"
          flexItem
          sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 24 }}
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
      <Box
        sx={{
          display: 'flex',
          bgcolor: 'rgba(255,255,255,0.2)',
          borderRadius: 1,
          p: 0.5,
        }}
      >
        <IconButton
          aria-label="網格視圖"
          onClick={() => setViewMode('grid')}
          sx={{
            p: 0.5,
            color: viewMode === 'grid' ? '#1976d2' : 'white',
            bgcolor: viewMode === 'grid' ? 'white' : 'transparent',
            '&:hover': {
              bgcolor: viewMode === 'grid'
                ? 'white'
                : 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <GridViewIcon />
        </IconButton>
        <IconButton
          aria-label="列表視圖"
          onClick={() => setViewMode('list')}
          sx={{
            p: 0.5,
            color: viewMode === 'list' ? '#1976d2' : 'white',
            bgcolor: viewMode === 'list' ? 'white' : 'transparent',
            '&:hover': {
              bgcolor: viewMode === 'list'
                ? 'white'
                : 'rgba(255,255,255,0.1)',
            },
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
          <Grid item xs={3} sm={2} md={1.5} lg={1.2} key={item}>
            <Paper
              elevation={2}
              onClick={() => handleEpisodeChange(item)}
              sx={{
                textAlign: 'center',
                py: 1.5,
                cursor: 'pointer',
                bgcolor: item === episode
                  ? '#1976d2'
                  : mode === 'dark'
                    ? '#2c2c2c'
                    : '#ffffff',
                color: item === episode ? 'white' : mode === 'dark' ? '#ffffff' : '#000000',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: item === episode
                    ? '#1565c0'
                    : mode === 'dark'
                      ? '#3a3a3a'
                      : '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {item}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {episodes.map((item) => (
          <Paper
            key={item}
            elevation={2}
            onClick={() => handleEpisodeChange(item)}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              bgcolor: item === episode
                ? '#1976d2'
                : mode === 'dark'
                  ? '#2c2c2c'
                  : '#ffffff',
              color: item === episode ? 'white' : mode === 'dark' ? '#ffffff' : '#000000',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: item === episode
                  ? '#1565c0'
                  : mode === 'dark'
                    ? '#3a3a3a'
                    : '#f5f5f5',
              },
            }}
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
                    borderRadius: 1,
                  }}
                >
                  Now Playing
                </Box>
              )}
            </Box>
            <Typography variant="body2">
              {item === episode ? 'Selected' : 'Select'}
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