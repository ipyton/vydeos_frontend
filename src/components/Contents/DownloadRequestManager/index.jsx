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

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import VideoUtil from "../../../util/io_utils/VideoUtil";
import { useNotification } from "../../../Providers/NotificationProvider";
import EpisodeSelector from "../LongVideos/EpisodeSelector";


// Progress bar with label component
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress 
          variant="determinate" 
          {...props} 
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
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

  const [seasonId,setSeasonId] = useState(0)

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
      if(!response) {
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
    VideoUtil.uploadVideos(videoId,details.type,file, setUploadProgress, null, setIndicator,seasonId, episode);
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
    VideoUtil.getVideoInformation(row,null,"en-US").then((res) => {
      setTotalSeason(res.total_season)
      console.log(res)
    }).then(()=>{
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


  console.log(details, seasonId,episode )
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
  },[details, seasonId, episode])


  // Get status color based on status
  const getStatusColor = (status) => {
    switch(status) {
      case "finished": return "success.main";
      case "downloading": return "info.main";
      case "paused": return "warning.main";
      case "cancelled": return "error.main";
      default: return "text.secondary";
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Download Manager
      </Typography>
      
      {/* Movie list table */}
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}
      >
        <Table aria-label="movie downloads table">
          <TableHead sx={{ backgroundColor: "primary.main" }}>
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
                <TableCell colSpan={7} align="center">No data available</TableCell>
              </TableRow>
            ) : (
              requests.map((row, index) => (
                <TableRow
                  key={row.movieId || index}
                  sx={{ 
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    "&:hover": { backgroundColor: "action.selected" },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell>{row.resource_id}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.movieName}</TableCell>
                  <TableCell>{row.release_year}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{new Date(row.timestamp).toLocaleDateString(JSON.parse(localStorage.getItem("userInfo")).language)}</TableCell>
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {details?.movieName ? `Sources for ${details.movieName}` : "Sources"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Manage download sources for this movie. Add, delete, or start downloads.
          </DialogContentText>

          {/*   const {seasonId, setSeasonId, episode, setEpisode, details, position} = props; */}
          {details && details.type === "movie" ? <div></div>:<EpisodeSelector seasonId={seasonId} setSeasonId={setSeasonId}
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
                      bgcolor: index % 2 === 0 ? "action.hover" : "transparent",
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
                      sx={{ flexGrow: 1 }}
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
            <Box sx={{ mt: 3, p: 2, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Add New Source</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Source URL"
                  variant="outlined"
                  size="small"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
              
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Upload Video File</Typography>
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
                  <Typography variant="body2">
                    {file ? file.name + indicator: "No file selected"}
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
      <Typography variant="h6" gutterBottom>
        Playable Resources
      </Typography>
      <List>
        {playableData.map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`Resource: ${item.resource_id}, Type: ${item.type}, Quality: ${item.quality}`}
              secondary={`Bucket: ${item.bucket}, Path: ${item.path}`}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => handleFileDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

    </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* File selection dialog */}
      <Dialog open={selectOpen} onClose={select} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Select File to Download
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            You are using a P2P resource. Please select exactly one file you want to download.
          </DialogContentText>
          <List sx={{ width: "100%" }}>
            {selections.map((item, idx) => (
              <ListItem 
                key={idx}
                sx={{ 
                  borderRadius: 1,
                  bgcolor: checkedNumber === idx ? "action.selected" : idx % 2 === 0 ? "action.hover" : "transparent",
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
                  />
                </Stack>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
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