import { ConnectingAirportsOutlined } from "@mui/icons-material"
import { useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ImageList, ImageListItem, Avatar } from "@mui/material";
import Stack from '@mui/material/Stack';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import VideoUtil from "../../../util/io_utils/VideoUtil";
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';



function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};



export default function (props) {
    const [open, setOpen] = React.useState(false);
    const [tmpGid, setTmpGid] = React.useState("")
    const [tmpSource, setTmpSource] = React.useState("")
    const [input, setInput] = React.useState("")
    const [selectOpen, setSelectOpen] = React.useState(false)
    const [selections, setSelections] = React.useState([])
    const [sources, setSources] = React.useState([{ videoId: "videoId", source: "xxxx1", status: "init" }, { videoId: "videoId", source: "xxxx2", status: "downloading" }, { videoId: "videoId", source: "xxxx3", status: "paused" }, { videoId: "videoId", source: "xxxx4", status: "cancelled" }])
    const [checkedNumber, setCheckedNumber] = React.useState(null)
    const [details, setDetails] = useState(null)
    const [videoId, setVideoId] = useState(null)
    const [file, setFile] = useState(null);
    const [movieName, setMovieName] = useState(null);
    const [uploadProgress,  setUploadProgress] = useState(0);

    const navigate = useNavigate()

    const handleSelection = (idx) => {
        return ()=>{
            setCheckedNumber(null)
            if (checkedNumber!==idx) {
                setCheckedNumber(idx)
            }
        }
    }
    const select = ()=> {
        if (!tmpGid || checkedNumber===null  || !tmpSource) {
            setSelectOpen(false)
            return
        }
        setVideoId(details.movieId)
        setMovieName(details.movie_name)
        VideoUtil.select(details.movieId, tmpSource, tmpGid,checkedNumber + 1, setSelectOpen)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = () => {
        console.log(input)
        if (!input || input.length == 0) {
            return
        }
        console.log(details)
        VideoUtil.add_download_source(videoId, input, details.movie_name, sources, setSources)
        setInput("")
    }
    const handleDelete = (source) => {
        console.log(source)
        return () => {
            VideoUtil.remove_download_source("videoId", source, sources, setSources)
        }
    }


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

  // 处理文件上传
  const handleUpload = async () => {
    if (!file) {
      alert('请选择一个文件');
      return;
    }
    console.log(movieName)
    VideoUtil.uploadVideos(videoId, file, setUploadProgress,null);
  };

    const handlePlay = (resource) => {
        return () => { navigate("/longvideos", { state: { videoId: videoId, resource: resource } }) }
    }

    const handleDownload = (source) => () => {
        VideoUtil.start_download(videoId, source, details.movie_name,sources, setSources,setOpen,setSelections,setSelectOpen,setTmpGid)
        setTmpSource(source)

    }
    const handleInput = (event) => {
        console.log(event)
        setInput(event.target.value)
    }
    useEffect(()=>{
        console.log("Download Requests Manager")
        VideoUtil.getRequests().then(res=>{
            setSources(res.data)
        })
    },[])

    return (<div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Movie Id</TableCell>
            <TableCell align="right">Movie Name</TableCell>
            <TableCell align="right">Actors</TableCell>
            <TableCell>Produce Year</TableCell>
            <TableCell align="right">Advisor</TableCell>
            <TableCell align="right">SubmitTime</TableCell>
            <TableCell align="right">Button</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sources.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell align="left">{row.movieId}</TableCell>
            <TableCell align="left">{row.movieName}</TableCell>
            <TableCell align="left">{row.actorList}</TableCell>
            <TableCell align="left">{row.release_year}</TableCell>
            <TableCell align="left">{row.userId}</TableCell>
            <TableCell align="left">{row.timestamp}</TableCell>
            <TableCell align="left"><Button variant="contained" color="primary" onClick={()=>{
                setOpen(true)
                setDetails(row)
                setVideoId(row.movieId)
                setMovieName(row.movieName)
                }}>Handle</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog  open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Sources</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Edit the resouces for the movie to download.
                </DialogContentText>
                <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                >

                    {
                        sources.map(item => {
                            return (<ListItem sx={{ width: "100%" }}>
                                <Stack direction="row" spacing={1} sx={{ width: "100%" }} >
                                    <ListItemText
                                        primary={item.source}
                                        sx={{ width: "60%" }}
                                    />

                                    <Button variant="contained" onClick={handleDelete(item.source)} >Del</Button>
                                    {
                                        item.status && item.status === "finished" ? <Button variant="contained" onClick={handlePlay(item.source)} >play</Button> : <div></div>
                                    }
                                    {
                                        (item.status  && item.status === "finished") ? <div></div> : (<Button variant="contained" onClick={handleDownload(item.source)} >Pull</Button>) 
                                    }
                                </Stack>
                            </ListItem>)
                            })
                    }
                    <ListItem sx={{ width: "100%" }}>
                        <Stack direction="row" spacing={1} >
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-small"
                                variant="filled"
                                size="small"
                                onChange={handleInput}
                                value={input}
                            />
                            <Button variant="contained" onClick={handleSubmit}>Add</Button>
                            {/* <Button variant="contained" onClick={handleUpload}>Upload</Button> */}

                        </Stack>
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <LinearProgressWithLabel value={uploadProgress} />
    </Box>
                    </ListItem>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload</button>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
        </Dialog>
        <Dialog
            sx={{ width: "100%" }}
            open={selectOpen}
            onClose={select}>
            <DialogTitle>Select</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You use a P2P resource, select only 1 exact file you want to download.
                </DialogContentText>
                <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                >
                    {
                        selections.map((item,idx) => {
                            return (<ListItem sx={{ width: "100%" }}>
                                <Stack direction="row" spacing={1} sx={{ width: "100%" }} >
                                    <ListItemText
                                        primary={item.path}
                                        sx={{ width: "80%" }}
                                        secondary={item.size/1000000 + "MB"}
                                    />
                                    <Checkbox checked={checkedNumber===idx} onChange={handleSelection(idx)} />
                                </Stack>
                            </ListItem>)
                        })


                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={select}>Ok</Button>
            </DialogActions>
        </Dialog>
        </div>
  );
} 