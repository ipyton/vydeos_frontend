import React, { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useLocation } from "react-router-dom";
import { Box, Stack, Typography, Paper, useTheme } from "@mui/material";
import LongVideo from "./LongVideo";
import { useNotification } from '../../../Providers/NotificationProvider';
import Comments from "./Comments";
import VideoUtil from "../../../util/io_utils/VideoUtil";
import CommentSendComponent from "../Util/CommentSendingComponent";
import EpisodeSelector from "./EpisodeSelector";

import { useThemeMode } from "../../../Themes/ThemeContext";

const VideoPage = () => {
  const { mode } = useThemeMode();
  const theme = useTheme();
  const location = useLocation();

  const [videoOption, setVideoOption] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(0);
  const [playableEpisodes, setPlayableEpisodes] = useState([]);
  const { showNotification } = useNotification();

  // 根据主题模式定义样式
  const getThemeStyles = () => {
    const isDark = mode === 'dark';
    return {
      mainContainer: {
        backgroundColor: isDark ? '#121212' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000',
        minHeight: '100vh'
      },
      paper: {
        backgroundColor: isDark ? '#1e1e1e' : theme.palette.background.paper,
        color: isDark ? '#ffffff' : theme.palette.text.primary,
        border: isDark ? '1px solid #333' : 'none'
      },
      playlistSection: {
        backgroundColor: isDark ? '#2d2d2d' : theme.palette.background.paper,
        color: isDark ? '#ffffff' : theme.palette.text.primary,
        border: isDark ? '1px solid #404040' : 'none'
      },
      playlistItem: {
        backgroundColor: isDark ? '#3d3d3d' : theme.palette.background.default,
        color: isDark ? '#ffffff' : theme.palette.text.primary,
        border: isDark ? '1px solid #505050' : '1px solid #e0e0e0',
        '&:hover': {
          backgroundColor: isDark ? '#4d4d4d' : '#f5f5f5'
        }
      },
      title: {
        color: isDark ? '#ffffff' : theme.palette.text.primary
      },
      subtitle: {
        color: isDark ? '#b0b0b0' : theme.palette.text.secondary
      },
      loadingContainer: {
        backgroundColor: isDark ? '#121212' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000'
      }
    };
  };

  const themeStyles = getThemeStyles();

  useEffect(() => {
    if (location.state?.resource_id && location.state?.type) {
      setIsLoading(true);

      Promise.all([
        VideoUtil.getVideoInformation(location.state, setVideoMeta),
        VideoUtil.get_comments(location.state, setComments).then(response => {
          if (response && response.data && response.data.code === 0) {
            setComments(JSON.parse(response.data.message));
          }
        }),
      ]).finally(() => {
        if (location.state.type === "tv") { 
          setCurrentSeason(1);
          setCurrentEpisode(0);
        }
        setIsLoading(false);
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (videoMeta && videoMeta.type === "tv") {
      if (currentSeason && currentEpisode) {
        VideoUtil.get_and_processM3u8(location.state, setVideoOption, currentSeason, currentEpisode).then((res) => {
          console.log("Video Option: ", videoOption);
        });
      }
    }
  }, [location.state, currentEpisode, currentSeason]);

  useEffect(() => {
    if (location.state.type !== "movie") {
      if (currentSeason && currentSeason !== 0) {
        VideoUtil.get_season_meta(videoMeta.resource_id, videoMeta.type, currentSeason).then((res) => {
          if (res.data.code === 0 && res.data.message !== "null") {
            let result = JSON.parse(res.data.message);
            setPlayableEpisodes(result.availableEpisodes);
            setTotalEpisodes(result.totalEpisode);
          }
        })
        .catch((error) => {
          console.error('Error fetching season metadata:', error);
        });
      }
    }
  }, [currentSeason]);

  const handlePlayerReady = (player) => {
    player.on('waiting', () => {
      console.log('Player is waiting');
    });

    player.on('dispose', () => {
      console.log('Player will dispose');
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={themeStyles.loadingContainer}
      >
        <Typography variant="h6" sx={themeStyles.title}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      ...themeStyles.mainContainer,
      maxWidth: "1200px",
      margin: "0 auto",
      padding: theme.spacing(2)
    }}>
      <Stack spacing={3}>
        {/* Video Section */}
        <Paper
          elevation={mode === 'dark' ? 3 : 0}
          sx={{
            ...themeStyles.paper,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: theme.spacing(2),
            padding: theme.spacing(2)
          }}
        >
          {/* Main Video Content */}
          <Box sx={{ 
            flex: { md: 3 }, 
            width: '100%' 
          }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ 
                ...themeStyles.title,
                fontWeight: 600,
                mb: 2
              }}
            >
              {videoMeta?.movie_name + videoMeta.release_year || "Untitled Video"}
            </Typography>

            {/* Video Container with Responsive 16:9 Aspect Ratio */}
            <Box sx={{
              position: 'relative',
              paddingTop: '56.25%',
              width: '100%',
              height: 0,
              overflow: 'hidden',
              backgroundColor: mode === 'dark' ? '#000000' : '#f0f0f0',
              borderRadius: theme.shape.borderRadius
            }}>
              {
                videoOption && videoMeta ? 
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}>
                  <LongVideo
                    options={videoOption}
                    onReady={handlePlayerReady}
                  />
                </Box> : 
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  <Typography sx={themeStyles.title}>Loading</Typography>
                </Box>
              }
            </Box>
          </Box>

          {/* Playlist Section */}
          <Box
            sx={{
              ...themeStyles.playlistSection,
              flex: { md: 1 },
              width: { xs: '100%', md: 'auto' },
              borderRadius: theme.shape.borderRadius,
              padding: theme.spacing(2),
              mt: { xs: 2, md: 0 }
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={themeStyles.subtitle}
            >
              Playlist
            </Typography>
            <Stack spacing={1}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  ...themeStyles.playlistItem,
                  padding: theme.spacing(1),
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <Typography sx={themeStyles.title}>Video 1</Typography>
              </Paper>
              <Paper 
                variant="outlined" 
                sx={{ 
                  ...themeStyles.playlistItem,
                  padding: theme.spacing(1),
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <Typography sx={themeStyles.title}>Video 2</Typography>
              </Paper>
            </Stack>
          </Box>
        </Paper>

        {/* Episode Selector */}
        {videoMeta.type === "movie" ? 
          <div></div> : 
          <Box sx={themeStyles.paper}>
            <EpisodeSelector 
              seasonId={currentSeason} 
              playableEpisodes={playableEpisodes} 
              setSeasonId={setCurrentSeason} 
              episode={currentEpisode} 
              setEpisode={setCurrentEpisode} 
              totalEpisodes={totalEpisodes} 
              details={videoMeta}
            />
          </Box>
        }

        {/* Comments Section */}
        <Paper
          elevation={mode === 'dark' ? 3 : 0}
          sx={{
            ...themeStyles.paper,
            padding: theme.spacing(2)
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ 
              ...themeStyles.title,
              fontWeight: 500 
            }}
          >
            Comments
          </Typography>
          <CommentSendComponent 
            movieIdentifier={location.state} 
            comments={comments} 
            setComments={setComments}
          />
          <Comments 
            comments={comments} 
            movieIdentifier={location.state}
          />
        </Paper>
      </Stack>
    </Box>
  );
};

export default VideoPage;