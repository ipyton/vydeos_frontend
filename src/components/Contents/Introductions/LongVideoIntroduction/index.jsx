import { ImageList, ImageListItem, Avatar } from "@mui/material";
import Stack from '@mui/material/Stack';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useSelector, useDispatch } from "react-redux";
import { update, clear } from "../../../redux/UserDetails"
import SocialMediaUtil from "../../../../util/io_utils/SocialMediaUtil";
import localforage from "localforage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import Box from "@mui/material/Box";

import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import VideoUtil from "../../../../util/io_utils/VideoUtil";
import Rating from '@mui/material/Rating';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';




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
    const [relationship, setRelationship] = useState(0)
    const {videoId} = props
    let position = "center";
    const location = useLocation()

    position = (!props.position ? position : props.position)
    let handleRequest = ()=> {

    }

    React.useEffect(()=>{
        VideoUtil.getVideoInformation(videoId, setDetails)
    },[videoId])

    let genresList = ""
    if (details) {
        for (let i = 0; i < details.genre_list.length; i ++) {
            genresList += details.genre_list[i]
            genresList += ","
        }
        genresList.substring(0, -1)
    }

    const recommendData = []

    if (!details) {
        return <div>loading</div>
    }
    details.makerList.map((item)=>{
       console.log(item.name)
    })
    if (position === "right") {
        return (
            <Stack direction="column"
                //justifyContent="center"
                sx={{ width: "100%", overflow: "scroll" }}>
                <Stack direction="row"
                    spacing={0.5} sx={{ width: "100%", boxShadow: 1 }}>
                    <Stack sx={{width:"30%"}}>
                        <Box>
                            <Item item={{original:details.poster}}></Item>
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
                                {<Button > Star</Button>}
                                {<Button onClick={handleRequest}>request</Button>}
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
                                {details.makerList.map((maker) => {
                                    console.log(maker)
                                    return <CardContent>
                                                                                <Typography variant="h7" component="div">

                                            {maker.name}
                                        </Typography>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {maker.role}
                                        </Typography>

                                    </CardContent>

                                })}

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

                    {details.actressList.map((item) => (

                        <ImageListItem key={item.avatar}  sx={{
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

                    ))}
                </ImageList>
                {/* recommendations
                <ImageList
                    sx={{
                        gridAutoFlow: "column",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr)) !important",
                        gridAutoColumns: "minmax(160px, 1fr)",
                        width: "100%",
                        height: 300,
                        overflow: "scroll",
                        boxShadow: 0,
                    }}
                >

                    {itemData.map((item) => (

                        <ImageListItem key={item.img} cols={3} sx={{
                            display: 'flex', flexDirection: 'row', width: undefined,
                            // Without height undefined it won't work
                            height: "100%", aspectRatio: 135 / 76
                        }} >
                            <img
                                srcSet={`${item.img}`}
                                src={`${item.img}`}
                                alt={item.title}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                subtitle={item.author}
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

                    ))}
                </ImageList> */}
                </Stack>
            </Stack>

        )



    } else {


    }




}