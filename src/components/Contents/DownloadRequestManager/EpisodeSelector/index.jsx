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
  for (let i = 1; i <= totalSeason; i++) {
    seasons.push({
      id: i,
      title: `Season ${i}`,
      episodes: 1
    });
  }
  seasons.push({ id: -1, title: 'Add', episodes: details.totalEpisodes });


  const currentSeason = seasons.find(season => season.id === seasonId);
  // const totalEpisodes = currentSeason ? currentSeason.episodes : 0;



  const handleSeasonChange = (event) => {
    const newSeason = event.target.value;
    if (event.target.value === -1) {
      //add is clicked
      VideoUtil.add_season(details.resource_id, details.type).then((res) => {
        if (!res || !res.data || res.data.code === -1) {
          console.log("add season error")
          return
        }
        else {
          setTotalSeason(totalSeason + 1);
        }
        console.log(res)
      })
    }
    else {
      setSeasonId(newSeason);
      setEpisode(0);

    }
  };

  const handleEpisodeChange = (episode) => {
    console.log(episode + "------------" + " episode selected");
    if (episode === "Add") {
      //add is clicked
      VideoUtil.add_episode(details.resource_id, details.type, seasonId).then((res) => {
        if (!res || !res.data || res.data.code === -1) {
          console.log("add episode error")
          return
        }
        else {
          let tmp = episodes.unshift(totalEpisodes + 1);
          console.log("------------------" + totalEpisodes)
          setEpisodes(episodes);
          setTotalEpisodes(totalEpisodes + 1);
        }
        console.log(res)
      })
    }
    else {
      setEpisode(episode);
    }

  }
  useEffect(() => {
    if (details && seasonId) {

    }

  }, [details, seasonId])


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

            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 24 }} />

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
            {episodes.map((item) => (
              <Grid item xs={3} sm={2} md={1.5} lg={1.2} key={item}>
                <Paper
                  elevation={2}
                  onClick={() => handleEpisodeChange(item)}
                  sx={{
                    textAlign: 'center',
                    py: 1.5,
                    cursor: 'pointer',
                    bgcolor: item === episode ? theme.palette.primary.main : 'background.paper',
                    color: item === episode ? 'white' : 'text.primary',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: item === episode
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
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
                  bgcolor: item === episode ? theme.palette.primary.main : 'background.paper',
                  color: item === episode ? 'white' : 'text.primary',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: item === episode
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover
                  }
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
                        borderRadius: 1
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