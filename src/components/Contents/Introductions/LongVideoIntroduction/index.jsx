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
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useSelector, useDispatch } from "react-redux";
import { update, clear } from "../../../redux/UserDetails"
import SocialMediaUtil from "../../../../util/io_utils/SocialMediaUtil";
import localforage from "localforage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";

export default function (props) {
    const [details, setDetails] = useState(null)
    const [relationship, setRelationship] = useState(0)
    console.log("-============-------------============----------=")
    console.log(props)
    let position = "center";
    const location = useLocation()

    // if (location.state ) {
    //     position = location.state.position
    // }

    position = (!props.position ? position : props.position)



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
    if (!details) {
        return <div>loading</div>
    }
    //console.log(details.relationship)
    //01: you do not follow him/ but he follow you.
    //10: you follow him but he does not follow you.
    //,etc.
    if (details.relationship === 0) {
        followButtonText = "Follow"
        extraInformation = ""
        contactButtonText = ""
    } else if (details.relationship === 1) {
        followButtonText = "Follow"
        extraInformation = "He follows you."
    } else if (details.relationship === 10) {
        contactButtonText = "Request"
        followButtonText = "Unfollow"
    } else if (details.relationship === 11) {
        extraInformation = "He follows you."
        followButtonText = "Unfollow"
        contactButtonText = "Contact"
    }

    const handleContact = async () => {
        if (details.userId === await localforage.getItem("userId")) {
            return
        }
        localforage.setItem("contactCursor", details.userId)
        navigate("/chat")
        console.log("navigate")
    }

    localforage.getItem("userId").then(res => {
        if (res === details.userId) {
            followButtonText = ""
        }
    })


    let handleFollow = () => {
        if (Math.floor(relationship / 10) === 1) {
            localforage.getItem("userId").then(res => {
                SocialMediaUtil.unfollow(res, details.userId, details, setRelationship)
            })
        } else {
            localforage.getItem("userId").then(res => {
                SocialMediaUtil.follow(res, details.userId, details, setRelationship)
            })
        }
        setDetails(details)
    }

    let imageData = [
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

    if (position === "center") {
        return (
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={0.5} sx={{ width: "100%", overflow: "scroll", boxShadow: 1 }}>
                <Stack direction="row" justifyContent="end" sx={{ width: "60%" }}>
                    <ListItem alignItems="flex-start" >
                        <ListItemAvatar>
                            <Avatar alt={details.userName} src={details.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={details.userName}

                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                    </Typography>
                                    {details.introduction}
                                </React.Fragment>
                            }
                        />

                    </ListItem>


                    <ButtonGroup sx={{ marginTop: "3%", height: "50%" }} aria-label="Basic button group" >
                        {followButtonText.length === 0 ? <div></div> : <Button onClick={handleFollow}> {followButtonText}</Button>}
                        {contactButtonText.length === 0 ? <div></div> : <Button onClick={handleContact}>{contactButtonText}</Button>}
                    </ButtonGroup>
                </Stack>
                {/* <Stack>
                {details.userName}
            </Stack> */}
                <Stack>
                    {extraInformation}
                </Stack>
                <Stack sx={{ width: "60%", }}>
                    <TextField
                        id="outlined-required"
                        label="Gender"
                        defaultValue={details.gender}
                        variant="standard"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="outlined-required"
                        label="Age"
                        defaultValue={details.birthdate}
                        variant="standard"

                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="outlined-required"
                        label="Location"
                        defaultValue={details.location}
                        variant="standard"
                        InputProps={{
                            readOnly: true,
                        }}

                    />

                    {details.nickname === undefined ? <div></div> : <TextField
                        id="outlined-required"
                        label="NickName"
                        defaultValue={details.nickname}
                        variant="standard" type="search" />}

                </Stack>


                {imageData === undefined ? <div></div> : <ImageGallery items={imageData} />}
            </Stack>
        )



    } else {


    }




}