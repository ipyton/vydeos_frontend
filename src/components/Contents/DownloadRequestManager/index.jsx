import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Box,
  Typography,
  Stack,
  Checkbox,
  Divider,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme, alpha } from '@mui/material/styles';

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import VideoUtil from "../../../util/io_utils/VideoUtil";
import { useNotification } from "../../../Providers/NotificationProvider";
import EpisodeSelector from "./EpisodeSelector";


// Progress bar with label component
function LinearProgressWithLabel(props) {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{ 
            height: 10, 
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
            }
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: 500
          }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function DownloadManager() {
  const theme = useTheme();
  
  // State management
  const [open, setOpen] = useState(false);
  const [tmpGid, setTmpGid] = useState("");
  const [tmpSource, setTmpSource] = useState("");
  const [input, setInput] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [selections, setSelections] = useState([]);

  const [playableData, setPlayableData] = useState([
    { resource_id: "res1", type: "video", quality: 1080, bucket: "bucket1", path: "/path/to/resource1" },
    { resource_id: "res2", type: "audio", quality: 320, bucket: "bucket2", path: "/path/to/resource2" },
    { resource_id: "res3", type: "video", quality: 720, bucket: "bucket3", path: "/path/to/resource3" },
  ]);

  const handleFileDelete = (index) => {
    setPlayableData(playableData.filter((_, i) => i !== index));
  };

  const [seasonId, setSeasonId] = useState(0)

  const [requests, setRequests] = useState([
    { videoId: "videoId", source: "xxxx1", status: "init" },
    { videoId: "videoId", source: "xxxx2", status: "downloading" },
    { videoId: "videoId", source: "xxxx3", status: "paused" },
    { videoId: "videoId", source: "xxxx4", status: "cancelled" },
  ]);
  const [sources, setSources] = useState([
    { videoId: "videoId", source: "xxxx1", status: "init" },
    { videoId: "videoId", source: "xxxx2", status: "downloading" },
    { videoId: "videoId", source: "xxxx3", status: "paused" },
    { videoId: "videoId", source: "xxxx4", status: "cancelled" },
  ]);
  const [checkedNumber, setCheckedNumber] = useState(null);
  const [details, setDetails] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [file, setFile] = useState(null);
  const [movieName, setMovieName] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalSeason, setTotalSeason] = useState(0);

  const [episode, setEpisode] = useState(0)

  const { showNotification } = useNotification();
  const [indicator, setIndicator] = useState(" ready")
  const navigate = useNavigate();

  // Handler functions
  const handleSelection = (idx) => () => {
    setCheckedNumber(checkedNumber !== idx ? idx : null);
  };

  const select = () => {
    //select file
    if (!tmpGid || checkedNumber === null || !tmpSource) {
      setSelectOpen(false);
      return;
    }
    setVideoId(details.movieId);//////!!!!!!
    setMovieName(details.movie_name);
    VideoUtil.select(
      details.resource_id,
      details.type,
      tmpSource,
      tmpGid,
      checkedNumber + 1,
      setSelectOpen
    )
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!input || input.length === 0) {
      return;
    }
    console.log(details)
    VideoUtil.add_download_source(
      details,
      input,
    ).then(function (response) {
      if (response === undefined || !response.data) {
        console.log("errror")
      }

      console.log(response)
      //props.setBarState({...props.barState, message:responseData.message, open:true})
      let data = response.data
      if (data === "success") {
        setSources([...sources, { id: details.id, source: input, status: "init" }])
      }

    })
    setInput("");
  };

  const handleDelete = (source) => () => {
    VideoUtil.remove_download_source(details, source).then(function (response) {
      if (!response) {
        return
      }
      else if (response.data !== "success") {
        return
      }
      else {
        for (let i = 0; i < sources.length; i++) {
          if (sources[i].source === source) {
            sources.splice(i, 1)
            break
          }
        }
        setSources([...sources])
      }

    })
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification("Please select a file first", "warning");
      return;
    }
    VideoUtil.uploadVideos(videoId, details.type, file, setUploadProgress, null, setIndicator, seasonId, episode);
  };

  const handlePlay = (resource) => () => {
    navigate("/longvideos", { state: { videoId: videoId, resource: resource } });
  };

  const handleDownload = (source) => () => {
    VideoUtil.start_download(
      videoId,
      source,
      details.movie_name,
      sources,
      setSources,
      setOpen,
      setSelections,
      setSelectOpen,
      setTmpGid
    );
    setTmpSource(source);
  };

  const handleOpenDetails = (row) => {
    VideoUtil.getVideoInformation(row, null, "en-US").then((res) => {
      setTotalSeason(res.total_season)
      console.log(res)
    }).then(() => {
      if (row.type === "movie") {
        setSeasonId(0)
        setEpisode(0)
      }
      else {
        setSeasonId(1)
        setEpisode(1)
      }
    })
    setOpen(true);
    setDetails(row);
    setVideoId(row.resource_id);
    setMovieName(row.movieName);

    console.log(row)

  };

  // Load data on component mount
  useEffect(() => {
    console.log("Download Requests Manager");
    VideoUtil.getRequests()
      .then((res) => {
        if (res.data.code !== 0) {
          showNotification("Network Error", "error");
          return;
        }
        if (res.data.code === 0) {
          let requests = JSON.parse(res.data.message);
          requests = requests.map((item) => {
            console.log(item)
            return { ...item, resource_id: item.resourceId };
          })
          setRequests(requests);
        }
      })
      .catch(err => {
        showNotification("Failed to load requests", "error");
      });

  }, []);


  useEffect(() => {
    if (!details) return;
    VideoUtil.get_download_sources(details.resource_id, details.type, seasonId, episode).then(function (response) {
      if (response === undefined) {
        console.log("errror")
        return
      }
      console.log(response)
      //props.setBarState({...props.barState, message:responseData.message, open:true})
      let data = response.data
      setSources(data)

      // for (let i = 0; i < sources.length; i++) {
      //     if (sources[i].source === source) {
      //         sources.splice(i, 1)
      //         break
      //     }
      // }
      // setSources([...sources])
    })


    console.log(details, seasonId, episode)
    VideoUtil.get_playables(details, seasonId, episode).then(function (response) {
      if (response.data && response.data.code === 0) {
        setPlayableData(JSON.parse(response.data.message));
      }
      else {
        console.log(response)
      }
    }).catch(function (error) {
      showNotification(error.message, "warning");
    })
  }, [details, seasonId, episode])


  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "finished": return theme.palette.success.main;
      case "downloading": return theme.palette.info.main;
      case "paused": return theme.palette.warning.main;
      case "cancelled": return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  return (
    <Box sx={{ 
      padding: 3,
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3,
          color: theme.palette.text.primary,
          fontWeight: theme.palette.mode === 'dark' ? 400 : 600
        }}
      >
        Download Manager
      </Typography>

      {/* Movie list table */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ 
          mb: 4, 
          borderRadius: 2, 
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          ...(theme.palette.mode === 'dark' && {
            border: `1px solid ${theme.palette.grey[700]}`,
          })
        }}
      >
        <Table aria-label="movie downloads table">
          <TableHead sx={{ 
            backgroundColor: theme.palette.primary.main,
            ...(theme.palette.mode === 'dark' && {
              backgroundColor: theme.palette.primary.dark,
            })
          }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Resource ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Movie Name</TableCell>
              {/* <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actors</TableCell> */}
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Year</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Advisor</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Submitted</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>

          </TableHead>
          <TableBody>
            {requests == null ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: theme.palette.text.secondary }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              requests.map((row, index) => (
                <TableRow
                  key={row.movieId || index}
                  sx={{
                    "&:nth-of-type(odd)": { 
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.grey[900] 
                        : theme.palette.action.hover 
                    },
                    "&:hover": { 
                      backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.action.selected 
                    },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell sx={{ color: theme.palette.text.primary }}>{row.resource_id}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{row.type}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{row.movieName}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{row.release_year}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{row.userId}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    {new Date(row.timestamp).toLocaleDateString(JSON.parse(localStorage.getItem("userInfo")).language)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDetails(row)}
                      sx={{ borderRadius: 2 }}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sources dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            ...(theme.palette.mode === 'dark' && {
              backgroundImage: 'none',
            })
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: "white",
          ...(theme.palette.mode === 'dark' && {
            bgcolor: theme.palette.primary.dark,
          })
        }}>
          {details?.movieName ? `Sources for ${details.movieName}` : "Sources"}
        </DialogTitle>
        <DialogContent 
          dividers
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
          }}
        >
          <DialogContentText sx={{ 
            mb: 2,
            color: theme.palette.text.secondary
          }}>
            Manage download sources for this movie. Add, delete, or start downloads.
          </DialogContentText>

          {/*   const {seasonId, setSeasonId, episode, setEpisode, details, position} = props; */}
          {details && details.type === "movie" ? <div></div> : <EpisodeSelector seasonId={seasonId} setSeasonId={setSeasonId}
            episode={episode} setEpisode={setEpisode} totalSeason={totalSeason} setTotalSeason={setTotalSeason} details={details}></EpisodeSelector>}

          <List sx={{ width: "100%" }}>
            {sources.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      width: "100%",
                      alignItems: "center",
                      bgcolor: index % 2 === 0 
                        ? (theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.action.hover)
                        : "transparent",
                      borderRadius: 1,
                      padding: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: getStatusColor(item.status),
                        boxShadow: 1
                      }}
                    />
                    <ListItemText
                      primary={item.source}
                      secondary={`Status: ${item.status || "Unknown"}`}
                      sx={{ 
                        flexGrow: 1,
                        '& .MuiListItemText-primary': {
                          color: theme.palette.text.primary,
                        },
                        '& .MuiListItemText-secondary': {
                          color: theme.palette.text.secondary,
                        }
                      }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleDelete(item.source)}
                        sx={{ minWidth: 0, borderRadius: 2 }}
                      >
                        Delete
                      </Button>

                      {item.status && item.status === "finished" ? (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={handlePlay(item.source)}
                          sx={{ minWidth: 0, borderRadius: 2 }}
                        >
                          Play
                        </Button>
                      ) : null}

                      {item.status && item.status !== "finished" ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={handleDownload(item.source)}
                          sx={{ minWidth: 0, borderRadius: 2 }}
                        >
                          Download
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </ListItem>
                {index < sources.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: theme.palette.background.paper, 
              borderRadius: 2, 
              boxShadow: 1,
              ...(theme.palette.mode === 'dark' && {
                bgcolor: theme.palette.grey[800],
                border: `1px solid ${theme.palette.grey[700]}`,
              })
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 2,
                  color: theme.palette.text.primary,
                  fontWeight: 500
                }}
              >
                Add New Source
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Source URL"
                  variant="outlined"
                  size="small"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : undefined,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.text.secondary,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.palette.text.primary,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ borderRadius: 2 }}
                >
                  Add
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 2,
                  color: theme.palette.text.primary,
                  fontWeight: 500
                }}
              >
                Upload Video File
              </Typography>
              <Stack direction="column" spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ mr: 2, borderRadius: 2 }}
                  >
                    Choose File
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {file ? file.name + indicator : "No file selected"}
                  </Typography>
                </Box>

                <Box sx={{ width: "100%" }}>
                  <LinearProgressWithLabel value={uploadProgress} />
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleUpload}
                  disabled={!file}
                  sx={{ alignSelf: "flex-start", borderRadius: 2 }}
                >
                  Upload
                </Button>
              </Stack>
            </Box>
          </List>

          <div>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: theme.palette.text.primary,
                fontWeight: 500
              }}
            >
              Playable Resources
            </Typography>
            <List>
              {playableData.map((item, index) => (
                <ListItem 
                  key={index} 
                  divider
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  <ListItemText
                    primary={`Resource: ${item.resource_id}, Type: ${item.type}, Quality: ${item.quality}`}
                    secondary={`Bucket: ${item.bucket}, Path: ${item.path}`}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: theme.palette.text.primary,
                      },
                      '& .MuiListItemText-secondary': {
                        color: theme.palette.text.secondary,
                      }
                    }}
                  />
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={() => handleFileDelete(index)}
                    sx={{
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.04),
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>

          </div>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          backgroundColor: theme.palette.background.paper
        }}>
          <Button onClick={handleClose} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* File selection dialog */}
      <Dialog 
        open={selectOpen} 
        onClose={select} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            ...(theme.palette.mode === 'dark' && {
              backgroundImage: 'none',
            })
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: "white",
          ...(theme.palette.mode === 'dark' && {
            bgcolor: theme.palette.primary.dark,
          })
        }}>
          Select File to Download
        </DialogTitle>
        <DialogContent 
          dividers
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
          }}
        >
          <DialogContentText sx={{ 
            mb: 2,
            color: theme.palette.text.secondary
          }}>
            You are using a P2P resource. Please select exactly one file you want to download.
          </DialogContentText>
          <List sx={{ width: "100%" }}>
            {selections.map((item, idx) => (
              <ListItem
                key={idx}
                sx={{
                  borderRadius: 1,
                  bgcolor: checkedNumber === idx 
                    ? (theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.primary.main, 0.12)
                        : theme.palette.action.selected) 
                    : idx % 2 === 0 
                        ? (theme.palette.mode === 'dark' 
                            ? theme.palette.grey[800] 
                            : theme.palette.action.hover) 
                        : "transparent",
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.08)
                      : theme.palette.action.hover,
                  }
                }}
              >
                <Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "center" }}>
                  <Checkbox
                    checked={checkedNumber === idx}
                    onChange={handleSelection(idx)}
                    color="primary"
                  />
                  <ListItemText
                    primary={item.path}
                    secondary={`${(item.size / 1000000).toFixed(2)} MB`}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: theme.palette.text.primary,
                      },
                      '& .MuiListItemText-secondary': {
                        color: theme.palette.text.secondary,
                      }
                    }}
                  />
                </Stack>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          backgroundColor: theme.palette.background.paper
        }}>
          <Button
            onClick={select}
            variant="contained"
            disabled={checkedNumber === null}
            sx={{ borderRadius: 2 }}
          >
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}