import React, { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useLocation } from "react-router-dom";
import { Box, Stack, Typography, Paper, useTheme } from "@mui/material";
import LongVideo from "./LongVideo";
import Comments from "./Comments";
import VideoUtil from "../../../util/io_utils/VideoUtil";
import CommentSendComponent from "../Util/CommentSendingComponent";
import EpisodeSelector from "./EpisodeSelector";



const VideoPage = () => {
  const theme = useTheme();
  const location = useLocation();

  const [videoOption, setVideoOption] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(location.state)

  useEffect(() => {
    if (location.state?.resource_id && location.state?.type) {
      setIsLoading(true);
      Promise.all([
        VideoUtil.getVideoInformation(location.state,setVideoMeta),
        VideoUtil.get_and_processM3u8(location.state, setVideoOption),
        VideoUtil.get_comments(location.state, setComments).then(response=>{
          console.log(response)
          if (response && response.data &&response.data.code === 0) {
            setComments(JSON.parse(response.data.message));
          }
        }),
      ]).finally(() => setIsLoading(false));
    }
  }, [location.state]);
  console.log(comments)
  const handlePlayerReady = (player) => {
    // playerRef.current = player;

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
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: theme.spacing(2)
    }}>
      <Stack spacing={3}>
        {/* Video Section */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Responsive layout
            gap: theme.spacing(2),
            padding: theme.spacing(2),
            backgroundColor: theme.palette.background.default
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
                fontWeight: 600, 
                color: theme.palette.text.primary,
                mb: 2 // Add some margin bottom
              }}
            >
              {videoMeta?.movie_name + videoMeta.release_year || "Untitled Video"}
            </Typography>

            {/* Video Container with Responsive 16:9 Aspect Ratio */}
            <Box sx={{
              position: 'relative',
              paddingTop: '56.25%', // 16:9 Aspect Ratio
              width: '100%',
              height: 0,
              overflow: 'hidden'
            }}>
              {
                videoOption && videoMeta ?               <Box sx={{
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
                </Box>: (<Typography>Loading</Typography>)
              }

            </Box>
          </Box>

          {/* Playlist Section */}
          <Box
            sx={{
              flex: { md: 1 },
              width: { xs: '100%', md: 'auto' },
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius,
              padding: theme.spacing(2),
              mt: { xs: 2, md: 0 } // Add top margin on mobile
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.text.secondary }}
            >
              Playlist
            </Typography>
            <Stack spacing={1}>
              <Paper variant="outlined" sx={{ padding: theme.spacing(1) }}>
                <Typography>Video 1</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ padding: theme.spacing(1) }}>
                <Typography>Video 2</Typography>
              </Paper>
            </Stack>
          </Box>
        </Paper>
        <EpisodeSelector></EpisodeSelector>

        {/* Comments Section */}
        <Paper
          elevation={0}
          sx={{
            padding: theme.spacing(2),
            backgroundColor: theme.palette.background.default
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 500, color: theme.palette.text.primary }}
          >
            Comments
          </Typography>
          <CommentSendComponent movieIdentifier = {location.state} comments = {comments} setComments={setComments}></CommentSendComponent>
          <Comments comments={comments} movieIdentifier = {location.state}/>
        </Paper>
      </Stack>
    </Box>
  );
};

export default VideoPage;