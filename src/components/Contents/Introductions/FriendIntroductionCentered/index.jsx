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
import MessageUtil from "../../../../util/io_utils/MessageUtil";

//this is used to show the user information.
export default function (props) {
    const [details, setDetails] = useState({})
    const [userID, setUserID] = useState(0)
    const [contactButtonText, setContactButtonText] = useState("")
    const [followButtonText, setFollowButtonText] = useState("")
    const [extraInformation, setExtraInformation] = useState("")
    const { userId } = props
    let position = "center";
    // if (location.state ) {
    //     position = location.state.position
    // }

    position = (!props.position ? position : props.position)


    let navigate = useNavigate()
    React.useEffect(() => {

        if (!details || details.relationship== null || details.relationship == undefined) {
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
                setContactButtonText("Request")
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

    }, [details.relationship, details.userId, userID])
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
    console.log(details, userID)



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
        localforage.setItem("contactCursor", details.userId).then(() => {
            navigate("/chat", { state: details })
        })


    }



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


                {imageData === undefined ? <div></div> : <ImageList sx={{ width: "60%" }} cols={3} >
                    {imageData.map((item) => (
                        <ImageListItem key={item.img}>
                            <img
                                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>}
            </Stack>
        )



    } else {
        return <Stack direction="column"

            alignItems="center"
sx={{ overflow: "scroll", width: "100%", boxShadow: 1, }}>
            <Stack direction="row" justifyContent="end" sx={{ width: "80%" }}>
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

            <Stack sx={{ width: "80%"}}>
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


            {imageData === undefined ? <div></div> : <ImageList sx={{ width: "80%" }} cols={3} >
                {imageData.map((item) => (
                    <ImageListItem key={item.img}>
                        <img
                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>}
        </Stack>



    }




}