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
import { Paper, Button } from '@mui/material'
import Box from "@mui/material/Box";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import VideoUtil from "../../../../util/io_utils/VideoUtil";
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';


function Item(props) {
    return (
        <Box
            component="img"
            sx={{
                height: "auto",
                width: "100%",
                loading: "lazy"
            }}
            alt={props.item.original}
            src={props.item.original}

        />
    )
}


export default function (props) {
    const [details, setDetails] = useState(null)
    const [videoId, setVideoId] = useState(null)

    const [open, setOpen] = React.useState(false);
    let position = "center";
    const location = useLocation()
    position = (!props.position ? position : props.position)
    const [checked, setChecked] = React.useState(['wifi']);
    const navigate = useNavigate()
    const [checkedNumber,setCheckedNumber] = React.useState(null)
    const [selectOpen, setSelectOpen] = React.useState(false)
    const [selections,setSelections] = React.useState([])
    const [tmpGid,setTmpGid] = React.useState("")
    const [tmpSource,setTmpSource] = React.useState("")
    console.log(videoId)
    React.useEffect(() => {
        if (location.state) {
            console.log("location" + location.state)
            setVideoId(location.state)
        }
        if (props.videoId) {
            console.log("props" + props.videoId)
            setVideoId(props.videoId)
        }
    }, [props.videoId, location.state])
    //const [progress, setProgress] = React.useState([0,0,0,0]);
    const [sources, setSources] = React.useState([{ videoId: videoId, source: "xxxx1", status: "init" }, { videoId: videoId, source: "xxxx2", status: "downloading" }, { videoId: videoId, source: "xxxx3", status: "paused" }, { videoId: videoId, source: "xxxx4", status: "cancelled" }])

    const [input, setInput] = React.useState("")

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };
    const handleStar = () => {
        console.log(videoId)
        VideoUtil.star(videoId, details, setDetails)
    }
    const handleRemove = () => {
        VideoUtil.removeStar(videoId, details, setDetails)
    }
    const handleClickOpen = () => {
        setOpen(true);
        VideoUtil.get_download_source(videoId, setSources)
    };

    const handleInput = (event) => {
        console.log(event)
        setInput(event.target.value)
    }

    const handleDownload = (source) => () => {
        VideoUtil.start_download(videoId, source, details.movie_name,sources, setSources,setOpen,setSelections,setSelectOpen,setTmpGid)
        setTmpSource(source)

    }

    const handleSubmit = () => {
        console.log(input)
        if (!input || input.length == 0) {
            return
        }
        VideoUtil.add_download_source(videoId, input, details.movie_name, sources, setSources)
        setInput("")
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = (source) => {
        return () => {
            VideoUtil.remove_download_source(videoId, source, sources, setSources)
        }
    }

    const handleSelection = (idx) => {
        return ()=>{
            setCheckedNumber(null)
            if (checkedNumber!==idx) {
                setCheckedNumber(idx)
            }
        }
    }


    React.useEffect(() => {
        if (videoId) VideoUtil.getVideoInformation(videoId, setDetails)
    }, [videoId])

    let genresList = ""
    if (details) {
        for (let i = 0; i < details.genre_list.length; i++) {
            genresList += details.genre_list[i]
            genresList += ","
        }
        genresList.substring(0, -2)
    }

    const recommendData = []
    if (!details) {
        return <div>loading</div>
    }
    console.log(sources)
    const handlePlay = (resource) => {

        return () => { navigate("/longvideos", { state: { videoId: videoId, resource: resource } }) }
    }
    const select = ()=> {
        if (!tmpGid|| checkedNumber===null  || !tmpSource) {
            setSelectOpen(false)
            return
        }
        VideoUtil.select(details.movieId, tmpSource, tmpGid,checkedNumber + 1,setSelectOpen )
    }



    return (<div>
        <Stack direction="column"
            //justifyContent="center"
            sx={{ width: "100%", overflow: "scroll" }}>
            <Stack direction="row"
                spacing={0.5} sx={{ width: "100%", boxShadow: 1 }}>
                <Stack sx={{ width: "30%" }}>
                    <Box>
                        <Item item={{ original: details.poster }}></Item>
                    </Box>
                </Stack>
                <Stack
                    direction="column"
                    sx={{ width: "60%" }}
                >
                    <Stack direction="row" justifyContent="end" sx={{ width: "100%" }}>
                        <ListItem alignItems="flex-start" >
                            <ListItemText
                                primary={details.movie_name}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                        </Typography>
                                        {details.tag}
                                    </React.Fragment>
                                }
                            />

                        </ListItem>

                        <ButtonGroup sx={{ marginTop: "3%", height: "50%", marginRight: "2%" }} aria-label="Basic button group" >
                            {(!details.stared) ? <Button onClick={handleStar} > Star</Button> : <Button onClick={handleRemove} > Remove</Button>}
                            {<Button onClick={handleClickOpen}>request</Button>}

                        </ButtonGroup>
                    </Stack>
                    <Stack sx={{ width: "100%", }}>

                        <React.Fragment>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Release Year
                                </Typography>
                                <Typography variant="h7" component="div">
                                    {details.release_year}
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Type
                                </Typography>
                                <Typography variant="h7" component="div">
                                    {genresList}
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Introduction
                                </Typography>
                                <Typography variant="h7" component="div">
                                    {details.introduction}
                                </Typography>
                            </CardContent>
                            {
                                Object.keys(details.makerList).forEach(element => {
                                    return <CardContent>
                                        <Typography variant="h7" component="div">
                                            {element}
                                        </Typography>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {details.makerList[element]}
                                        </Typography>

                                    </CardContent>
                                })

                            }
                        </React.Fragment>
                    </Stack>
                </Stack>
            </Stack>
            Stars
            <Stack>
                <ImageList
                    sx={{
                        gridAutoFlow: "column",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr)) !important",
                        gridAutoColumns: "minmax(200px, 1fr)",
                        width: "100%",
                        height: "100%",
                        // overflow: "scroll",
                        boxShadow: 0,
                    }}
                >

                    {details.actressList.map((item) => {

                        return (
                            <ImageListItem key={item.avatar} sx={{
                                display: 'flex', flexDirection: 'row',
                                // width: undefined,
                                // Without height undefined it won't work
                                // height: "100%", aspectRatio: 135 / 76
                            }} >
                                <Item item={{ original: item.avatar }}></Item>
                                <ImageListItemBar
                                    title={item.name}
                                    subtitle={"Character:" + item.character}
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`info about ${item.title}`}
                                        >
                                            <InfoIcon />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>

                        )
                    })}
                </ImageList>
            </Stack>
        </Stack>
        <Dialog
            sx={{ width: "100%" }}
            open={open}
            onClose={handleClose}
        //sx={{width:"50%"}}

        >
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
                                        sx={{ width: "80%" }}
                                    />

                                    <Button variant="contained" onClick={handleDelete(item.source)} >Del</Button>
                                    {
                                        item.status && item.status === "finished" ? <Button variant="contained" onClick={handlePlay(item.source)} >play</Button> : <div></div>
                                    }
                                    {
                                        (item.status  && item.status === "finished")
                                            ?<div></div>: (<Button variant="contained" onClick={handleDownload(item.source)} >Pull</Button>) }
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
                        </Stack>
                    </ListItem>

                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
        </Dialog>
        <Dialog
            sx={{ width: "100%" }}
            open={selectOpen}
            onClose={select}
        //sx={{width:"50%"}}

        >
            <DialogTitle>Select</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You use a p2p resouce, select only 1 exact file you want to download.
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
    )




}