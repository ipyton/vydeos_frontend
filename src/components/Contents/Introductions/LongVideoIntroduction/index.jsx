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



function Item(props) {
    console.log(props)
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
    console.log(props)
    let position = "center";
    const location = useLocation()

    // if (location.state ) {
    //     position = location.state.position
    // }

    position = (!props.position ? position : props.position)

    // var items = [
    //     {
    //         name: "Random Name #1",
    //         description: "Probably the most random thing you have ever seen!"
    //     },
    //     {
    //         name: "Random Name #2",
    //         description: "Hello World!"
    //     }
    // ]


    let navigate = useNavigate()
    React.useEffect(() => {
        localforage.getItem("userIntro").then((res) => {
            if (!res) {
                console.log("does not have userIntro")
                return
            }
            setDetails(res)
            setRelationship(res.relationship)
        })
    }, [])

    let contactButtonText = ""

    let followButtonText = ""

    let extraInformation = ""
    // if (!details) {
    //     return <div>loading</div>
    // }
    //console.log(details.relationship)
    //01: you do not follow him/ but he follow you.
    //10: you follow him but he does not follow you.
    //,etc.


    const handleRequest = () => {

    }

    // localforage.getItem("userId").then(res => {
    //     if (res === details.userId) {
    //         followButtonText = ""
    //     }
    // })




    let items = [
        {
            original: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: 'Breakfast',
        },
        {
            original: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
            title: 'Burger',
        },
        {
            original: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            title: 'Camera',
        },
        {
            original: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
            title: 'Coffee',
        },

    ];

    const itemData = [
        {
            img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: 'Breakfast',
            author: '@bkristastucchio',
            rows: 2,
            cols: 2,
            featured: true,
        },
        {
            img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
            title: 'Burger',
            author: '@rollelflex_graphy726',
        },
        {
            img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            title: 'Camera',
            author: '@helloimnik',
        },
        {
            img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
            title: 'Coffee',
            author: '@nolanissac',
            cols: 2,
        },
        {
            img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
            title: 'Hats',
            author: '@hjrc33',
            cols: 2,
        },
        {
            img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
            title: 'Honey',
            author: '@arwinneil',
            rows: 2,
            cols: 2,
            featured: true,
        },
        {
            img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
            title: 'Basketball',
            author: '@tjdragotta',
        },
        {
            img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
            title: 'Fern',
            author: '@katie_wasserman',
        },
        {
            img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
            title: 'Mushrooms',
            author: '@silverdalex',
            rows: 2,
            cols: 2,
        },
        {
            img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
            title: 'Tomato basil',
            author: '@shelleypauls',
        },
        {
            img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
            title: 'Sea star',
            author: '@peterlaster',
        },
        {
            img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
            title: 'Bike',
            author: '@southside_customs',
            cols: 2,
        },
    ];

    if (position === "center") {
        return (
            <Stack direction="column"
                //justifyContent="center"
                alignItems="center"
                sx={{ width: "100%", overflow: "scroll" }}>
                <Stack direction="row"
                    spacing={0.5} sx={{ width: "70%", overflow: "scroll", boxShadow: 1 }}>
                    <Stack sx={{ width: "40%", height: "10%" }}> <Carousel>
                        {
                            items.map((item, i) => <Item key={i} item={item} />)
                        }
                    </Carousel></Stack>
                    <Stack
                        direction="column"
                        sx={{ width: "60%" }}
                    >
                        <Stack direction="row" justifyContent="end" sx={{ width: "100%" }}>
                            <ListItem alignItems="flex-start" >
                                <ListItemAvatar>
                                    <Avatar alt={""} src={""} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={"这里是电影名称"}

                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                            </Typography>
                                            "原名"
                                        </React.Fragment>
                                    }
                                />

                            </ListItem>


                            <ButtonGroup sx={{ marginTop: "3%", height: "50%", marginRight: "2%" }} aria-label="Basic button group" >
                                {<Button > Star</Button>}
                                {<Button onClick={handleRequest}>request</Button>}
                            </ButtonGroup>
                        </Stack>
                        {/* <Stack>
                {details.userName}
            </Stack> */}
                        <Stack>
                            {extraInformation}
                        </Stack>
                        <Stack sx={{ width: "100%", }}>
                            <TextField
                                id="outlined-required"
                                label="发行年份"
                                defaultValue={"1989"}
                                variant="standard"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                id="outlined-required"
                                label="发行地"
                                defaultValue={"美国加利福尼亚"}
                                variant="standard"

                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                id="outlined-required"
                                label="类型"
                                defaultValue={"爱情动作片"}
                                variant="standard"
                                InputProps={{
                                    readOnly: true,
                                }}

                            />
                            <TextField
                                id="outlined-required"
                                label="简介"
                                defaultValue={"急急急急急急就"}
                                variant="standard"
                                InputProps={{
                                    readOnly: true,
                                }}

                            />

                            <TextField
                                id="outlined-required"
                                label="导演"
                                defaultValue={""}
                                variant="standard" type="search" />
                                
                            <TextField
                                id="outlined-required"
                                label="Writter"
                                defaultValue={""}
                                variant="standard" type="search" />

                        </Stack>
                    </Stack>
                </Stack>
                Stars

                <ImageList
                    sx={{
                        gridAutoFlow: "column",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr)) !important",
                        gridAutoColumns: "minmax(160px, 1fr)",
                        width: "70%",
                        height: 300,
                        overflow: "scroll",
                        boxShadow: 0,
                    }}
                >

                    {itemData.map((item) => (

                        <ImageListItem key={item.img} cols={2} sx={{
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
                </ImageList>
                recommendations
                <ImageList
                    sx={{
                        gridAutoFlow: "column",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr)) !important",
                        gridAutoColumns: "minmax(160px, 1fr)",
                        width: "70%",
                        height: 300,
                        overflow: "scroll",
                        boxShadow: 0,
                    }}
                >

                    {itemData.map((item) => (

                        <ImageListItem key={item.img} cols={2} sx={{
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
                </ImageList>
                    
            </Stack>

        )



    } else {


    }




}