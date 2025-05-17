import { ImageList, ImageListItem, Avatar } from "@mui/material";
import Stack from '@mui/material/Stack';
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useSelector, useDispatch } from "react-redux";
import SocialMediaUtil from "../../../../util/io_utils/SocialMediaUtil";
import localforage from "localforage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageUtil from "../../../../util/io_utils/MessageUtil";
import axios from "axios";
import Qs from "qs";
import AccountUtil from "../../../../util/io_utils/AccountUtil";
import DatabaseManipulator from "../../../../util/io_utils/DatabaseManipulator";
import { update } from '../../../redux/refresh';
import { useNotification } from '../../../../Providers/NotificationProvider';

//this is used to show the user information.
export default function (props) {
    const [details, setDetails] = useState({})
    const [userID, setUserID] = useState(0)
    const [contactButtonText, setContactButtonText] = useState("")
    const [followButtonText, setFollowButtonText] = useState("")
    const [extraInformation, setExtraInformation] = useState("")
    const { userId, isMobile } = props

    let position = "center";
    // if (location.state ) {
    //     position = location.state.position
    // }

    position = (!props.position ? position : props.position)

  const { showNotification } = useNotification();

    let navigate = useNavigate()
    let dispatch = useDispatch()


    React.useEffect(()=>{
        if (!details || details.relationship == null || details.relationship == undefined) {
            console.log("updating")

        } else {
            if (details.relationship === 0) {
                setFollowButtonText("Follow")
                setExtraInformation("")
                setContactButtonText("")
            } else if (details.relationship === 1) {
                setFollowButtonText("Follow")
                setExtraInformation("He follows you.")
            } else if (details.relationship === 10) {
                setContactButtonText("Contact")
                setFollowButtonText("Unfollow")
            } else if (details.relationship === 11) {
                setExtraInformation("He follows you.")
                setFollowButtonText("Unfollow")
                setContactButtonText("Contact")
            }
            if (userID === details.userId) {
                setFollowButtonText("")
                setContactButtonText("")
                setExtraInformation("This is yourself")
            }
        }
    }, [details])



    console.log(extraInformation)
    React.useEffect(() => {
        console.log("changing")
        MessageUtil.requestUserInfo(userId, setDetails)
        localforage.getItem("userId").then(response => {
            setUserID(response)
        })
        // localforage.getItem("userIntro").then(async (res) => {
        //     if (!res) {
        //         console.log("does not have userIntro")
        //         return
        //     }
        //     setDetails(res)
        //     setRelationship(res.relationship)

        // })
    }, [userId])

    console.log(details)

    if (!details) {
        return <div>loading</div>
    }

    //console.log(details.relationship)
    //01: you do not follow him/ but he follow you.
    //10: you follow him but he does not follow you.
    //,etc.

    const handleContact = async () => {
        if (details.userId === await localforage.getItem("userId")) {
            return
        }
        let contact = { type: "single", userId: userId, name: details.userName }
            
        DatabaseManipulator.addRecentContact(contact).then(
            ()=>{
                navigate("/chat", { ...contact })
                dispatch(update())
            }
        )


    }
    console.log(details)



    let handleFollow = () => {
        if (Math.floor(details.relationship / 10) === 1) {
            localforage.getItem("userId").then(res => {
                SocialMediaUtil.unfollow(res, details.userId, details, setDetails)
            })
        } else {
            localforage.getItem("userId").then(res => {
                SocialMediaUtil.follow(res, details.userId, details, setDetails)
            })
        }
    }

    let imageData = [
        {
            img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: 'Breakfast',
        },
        {
            img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
            title: 'Burger',
        },
        {
            img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            title: 'Camera',
        },
        {
            img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
            title: 'Coffee',
        },
        {
            img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
            title: 'Hats',
        },
        {
            img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
            title: 'Honey',
        }
    ];

    if (true) {
        return (
            <Stack
                direction="column"
                // justifyContent="center"
                alignItems="center"
                spacing={0.5} sx={{ width: "100%", overflow: "scroll", boxShadow: 0,height:"100%"}}>
                <Stack direction={isMobile ? "column" : "row"} justifyContent="end" sx={{ width: "70%" }}>
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

                <Stack>
                    {extraInformation}
                </Stack>
                <Stack sx={{ width: "60%", }}>
                    <TextField
                        id="outlined-required"
                        label="Gender"
                        defaultValue={details.gender ? "female": "male"}
                        variant="standard"
                        focused
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="outlined-required"
                        label="Birthdate"
                        defaultValue={details.birthdate}
                        variant="standard"
                        focused
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="outlined-required"
                        label="Location"
                        defaultValue={details.location}
                        variant="standard"
                        focused
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


            </Stack>
        )



    }




}