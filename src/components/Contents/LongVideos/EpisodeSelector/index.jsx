import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Container,
  IconButton,
  useTheme
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

const EpisodeSelector = () => {
  const [selectedEpisode, setSelectedEpisode] = useState(14);
  const totalEpisodes = 14;
  const theme = useTheme();
  
  // 生成所有集数，从最新到最早排序
  const episodes = Array.from({ length: totalEpisodes }, (_, i) => totalEpisodes - i);

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* 标题栏 */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              正片
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ ml: 1 }}
            >
              ({selectedEpisode}/{totalEpisodes})
            </Typography>
          </Box>
          
          <Box>
            <IconButton aria-label="网格视图">
              <GridViewIcon />
            </IconButton>
            <IconButton aria-label="列表视图">
              <ViewListIcon />
            </IconButton>
          </Box>
        </Box>

        {/* 集数网格 */}
        <Grid container spacing={2}>
          {episodes.map((episode) => (
            <Grid item xs={6} sm={3} md={2.4} key={episode}>
              <Paper
                elevation={2}
                onClick={() => setSelectedEpisode(episode)}
                sx={{
                  textAlign: 'center',
                  py: 2,
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
                <Typography variant="h6">
                  {episode}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default EpisodeSelector;