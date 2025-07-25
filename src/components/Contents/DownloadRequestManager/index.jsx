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
import { useThemeMode } from '../../../Themes/ThemeContext';

// Progress bar with label component
function LinearProgressWithLabel(props) {
  const theme = useTheme();
  const { mode } = useThemeMode();
  
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300],
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
              transition: 'width 0.3s ease-in-out',
            }
          }}
        />
      </Box>
      <Box sx={{ minWidth: 40 }}>
        <Typography
          variant="body2"
          sx={{
            color: mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.secondary,
            fontWeight: 500,
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
  const { mode } = useThemeMode();
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
  try {
    const fileToDelete = playableData[index];
    if (!fileToDelete) {
      showNotification("File not found", "error");
      return;
    }
    
    // First update UI optimistically
    setPlayableData(playableData.filter((_, i) => i !== index));
    
    // You might want to add an API call here to delete the file on the server
    // VideoUtil.deletePlayableFile(fileToDelete)
    //   .then(response => {
    //     if (response.data !== "success") {
    //       showNotification("Server error when deleting file", "error");
    //       // Revert UI change if server deletion failed
    //       setPlayableData(prevData => {
    //         const newData = [...prevData];
    //         newData.splice(index, 0, fileToDelete);
    //         return newData;
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     showNotification("Failed to delete file: " + error.message, "error");
    //     // Revert UI change if server deletion failed
    //     setPlayableData(prevData => {
    //       const newData = [...prevData];
    //       newData.splice(index, 0, fileToDelete);
    //       return newData;
    //     });
    //   });
    
    showNotification("File removed from list", "success");
  } catch (error) {
    showNotification("Error removing file: " + error.message, "error");
  }
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
  if (!tmpGid) {
    showNotification("Missing download ID", "error");
    setSelectOpen(false);
    return;
  }
  
  if (checkedNumber === null) {
    showNotification("Please select a file to download", "warning");
    return;
  }
  
  if (!tmpSource) {
    showNotification("Source information is missing", "error");
    setSelectOpen(false);
    return;
  }
  
  if (!details || !details.resource_id || !details.type) {
    showNotification("Video details are incomplete", "error");
    setSelectOpen(false);
    return;
  }
  
  setVideoId(details.movieId);
  setMovieName(details.movie_name);
  
  try {
    VideoUtil.select(
      details.resource_id,
      details.type,
      tmpSource,
      tmpGid,
      checkedNumber + 1,
      setSelectOpen
    ).then(() => {
      showNotification("File selected successfully", "success");
    }).catch(error => {
      showNotification("Error selecting file: " + (error.message || "Unknown error"), "error");
    });
  } catch (error) {
    showNotification("Failed to select file: " + (error.message || "Unknown error"), "error");
    setSelectOpen(false);
  }
};

  const handleClose = () => {
    setOpen(false);
  };

const handleSubmit = () => {
  if (!input || input.length === 0) {
    showNotification("Please enter a valid source URL", "warning");
    return;
  }
  if (!details) {
    showNotification("No video selected", "error");
    return;
  }
  
  VideoUtil.add_download_source(details, input)
    .then(function (response) {
      if (response === undefined || !response.data) {
        showNotification("Failed to add source", "error");
        return;
      }

      let data = response.data;
      if (data === "success") {
        setSources([...sources, { id: details.id, source: input, status: "init" }]);
        showNotification("Source added successfully", "success");
      } else {
        showNotification("Failed to add source: " + data, "error");
      }
    })
    .catch(function (error) {
      showNotification("Network error while adding source: " + (error.message || "Unknown error"), "error");
    });
    
  setInput("");
};

const handleDelete = (source) => () => {
  if (!details) {
    showNotification("No video selected", "error");
    return;
  }
  
  VideoUtil.remove_download_source(details, source)
    .then(function (response) {
      if (!response) {
        showNotification("No response received when deleting source", "error");
        return;
      }
      else if (response.data !== "success") {
        showNotification("Failed to delete source: " + response.data, "error");
        return;
      }
      else {
        let sourceFound = false;
        for (let i = 0; i < sources.length; i++) {
          if (sources[i].source === source) {
            sources.splice(i, 1);
            sourceFound = true;
            break;
          }
        }
        if (sourceFound) {
          setSources([...sources]);
          showNotification("Source deleted successfully", "success");
        } else {
          showNotification("Source not found in list", "warning");
        }
      }
    })
    .catch(function (error) {
      showNotification("Network error while deleting source: " + (error.message || "Unknown error"), "error");
    });
};

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

const handleUpload = async () => {
  if (!file) {
    showNotification("Please select a file first", "warning");
    return;
  }
  
  if (!videoId) {
    showNotification("Video ID is missing", "error");
    return;
  }
  
  if (!details || !details.type) {
    showNotification("Video type information is missing", "error");
    return;
  }
  
  try {
    await VideoUtil.uploadVideos(
      videoId, 
      details.type, 
      file, 
      setUploadProgress, 
      null, 
      setIndicator, 
      seasonId, 
      episode
    );
    showNotification("Upload completed successfully", "success");
  } catch (error) {
    setUploadProgress(0);
    setIndicator(" failed");
    showNotification("Upload failed: " + (error.message || "Unknown error"), "error");
  }
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
  if (!row) {
    showNotification("Invalid row data", "error");
    return;
  }
  
  VideoUtil.getVideoInformation(row, null, "en-US")
    .then((res) => {
      if (res === undefined || res.data === undefined) {
        showNotification("Failed to fetch video information", "error");
        return;
      }
      setTotalSeason(res.total_season);
    })
    .then(() => {
      if (row.type === "movie") {
        setSeasonId(0);
        setEpisode(0);
      } else {
        setSeasonId(1);
        setEpisode(1);
      }
    })
    .catch(error => {
      showNotification("Error fetching video details: " + (error.message || "Unknown error"), "error");
    });
    
  setOpen(true);
  setDetails(row);
  setVideoId(row.resource_id);
  setMovieName(row.movieName);
};

  // Load data on component mount
  useEffect(() => {
    VideoUtil.getRequests()
      .then((res) => {
        if (res.data.code !== 0) {
          showNotification("Network Error", "error");
          return;
        }
        if (res.data.code === 0) {
          let requests = JSON.parse(res.data.message);
          requests = requests.map((item) => {
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
  
  VideoUtil.get_download_sources(details.resource_id, details.type, seasonId, episode)
    .then(function (response) {
      if (response === undefined) {
        showNotification("Failed to fetch download sources", "error");
        return;
      }
      setSources(response.data);
    })
    .catch(function (error) {
      showNotification("Error loading download sources: " + (error.message || "Unknown error"), "error");
    });

  VideoUtil.get_playables(details, seasonId, episode)
    .then(function (response) {
      if (response.data && response.data.code === 0) {
        setPlayableData(JSON.parse(response.data.message));
      } else {
        showNotification("Failed to load playable files", "warning");
      }
    })
    .catch(function (error) {
      showNotification("Error loading playable files: " + (error.message || "Unknown error"), "warning");
    });
}, [details, seasonId, episode]);


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
      backgroundColor: mode === 'dark' ? "#000" : theme.palette.background.default
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3,
          color: mode === 'dark' ? "#fff" : theme.palette.text.primary,
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
          backgroundColor: mode === 'dark' ? theme.palette.background.paper : theme.palette.background.paper,
          ...(theme.palette.mode === 'dark' && {
            border: `1px solid ${theme.palette.grey[700]}`,
          })
        }}
      >
        <Table aria-label="movie downloads table">
          <TableHead sx={{ 
            backgroundColor: mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
            ...(mode === 'dark' && {
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
    backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    "&:nth-of-type(odd)": {
      backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
    },
    "&:hover": {
      backgroundColor: mode === 'dark' ? '#333333' : '#e0e0e0',
      cursor: 'pointer',
    },
    transition: "background-color 0.2s",
    borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #ddd',
  }}
>
  <TableCell sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>{row.resource_id}</TableCell>
  <TableCell sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>{row.type}</TableCell>
  <TableCell sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>{row.movieName}</TableCell>
  <TableCell sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>{row.release_year}</TableCell>
  <TableCell sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>{row.userId}</TableCell>
  <TableCell sx={{ color: mode === 'dark' ? '#ffffff' : '#000000' }}>
    {new Date(row.timestamp).toLocaleDateString(
      JSON.parse(localStorage.getItem("userInfo"))?.language || 'en-US'
    )}
  </TableCell>
  <TableCell>
    <Button
      variant="contained"
      size="small"
      onClick={() => handleOpenDetails(row)}
      sx={{
        borderRadius: 2,
        backgroundColor: mode === 'dark' ? '#1976d2' : '#42a5f5',
        "&:hover": {
          backgroundColor: mode === 'dark' ? '#1565c0' : '#1e88e5',
        }
      }}
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
      backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      ...(mode === 'dark' && {
        backgroundImage: 'none',
      }),
    },
  }}
>
  <DialogTitle
    sx={{
      bgcolor: mode === 'dark' ? '#1565c0' : '#1976d2',
      color: '#ffffff',
    }}
  >
    {details?.movieName ? `Sources for ${details.movieName}` : 'Sources'}
  </DialogTitle>

  <DialogContent
    dividers
    sx={{
      backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      borderColor: mode === 'dark' ? '#444' : '#ddd',
    }}
  >
    <DialogContentText
      sx={{
        mb: 2,
        color: mode === 'dark' ? '#aaaaaa' : '#555555',
      }}
    >
      Manage download sources for this movie. Add, delete, or start downloads.
    </DialogContentText>

    {details && details.type !== 'movie' && (
      <EpisodeSelector
        seasonId={seasonId}
        setSeasonId={setSeasonId}
        episode={episode}
        setEpisode={setEpisode}
        totalSeason={totalSeason}
        setTotalSeason={setTotalSeason}
        details={details}
      />
    )}

    <List sx={{ width: '100%' }}>
      {sources.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: '100%',
                alignItems: 'center',
                bgcolor: index % 2 === 0 ? (mode === 'dark' ? '#2a2a2a' : '#f5f5f5') : 'transparent',
                borderRadius: 1,
                padding: 1,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: getStatusColor(item.status),
                  boxShadow: 1,
                }}
              />
              <ListItemText
                primary={item.source}
                secondary={`Status: ${item.status || 'Unknown'}`}
                sx={{
                  flexGrow: 1,
                  '& .MuiListItemText-primary': {
                    color: mode === 'dark' ? '#ffffff' : '#000000',
                  },
                  '& .MuiListItemText-secondary': {
                    color: mode === 'dark' ? '#aaaaaa' : '#555555',
                  },
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

                {item.status === 'finished' && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handlePlay(item.source)}
                    sx={{ minWidth: 0, borderRadius: 2 }}
                  >
                    Play
                  </Button>
                )}

                {item.status !== 'finished' && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleDownload(item.source)}
                    sx={{ minWidth: 0, borderRadius: 2 }}
                  >
                    Download
                  </Button>
                )}
              </Stack>
            </Stack>
          </ListItem>
          {index < sources.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}

      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
          borderRadius: 2,
          boxShadow: 1,
          ...(mode === 'dark' && {
            border: '1px solid #555',
          }),
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            color: mode === 'dark' ? '#ffffff' : '#000000',
            fontWeight: 500,
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
                  borderColor: mode === 'dark' ? '#666' : '#ccc',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
                },
              },
              '& .MuiInputLabel-root': {
                color: mode === 'dark' ? '#aaaaaa' : '#555555',
              },
              '& .MuiOutlinedInput-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              },
            }}
          />
          <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2 }}>
            Add
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            color: mode === 'dark' ? '#ffffff' : '#000000',
            fontWeight: 500,
          }}
        >
          Upload Video File
        </Typography>

        <Stack direction="column" spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outlined" component="label" sx={{ mr: 2, borderRadius: 2 }}>
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Typography variant="body2" sx={{ color: mode === 'dark' ? '#aaaaaa' : '#555555' }}>
              {file ? file.name + indicator : 'No file selected'}
            </Typography>
          </Box>

          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={uploadProgress} />
          </Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            disabled={!file}
            sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
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
          color: mode === 'dark' ? '#ffffff' : '#000000',
          fontWeight: 500,
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
                backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
              },
            }}
          >
            <ListItemText
              primary={`Resource: ${item.resource_id}, Type: ${item.type}, Quality: ${item.quality}`}
              secondary={`Bucket: ${item.bucket}, Path: ${item.path}`}
              sx={{
                '& .MuiListItemText-primary': {
                  color: mode === 'dark' ? '#ffffff' : '#000000',
                },
                '& .MuiListItemText-secondary': {
                  color: mode === 'dark' ? '#aaaaaa' : '#555555',
                },
              }}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleFileDelete(index)}
              sx={{
                color: '#f44336',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.04)',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  </DialogContent>

  <DialogActions
    sx={{
      p: 2,
      backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    }}
  >
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