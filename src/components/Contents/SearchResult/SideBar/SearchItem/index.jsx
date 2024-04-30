import ListItemIcon from '@mui/material/ListItemIcon';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItem from '@mui/material/ListItem';
import CardMedia from '@mui/material/CardMedia';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import AccountUtil from '../../../../../util/io_utils/AccountUtil';
import SearchUtil from '../../../../../util/io_utils/SearchUtil';
import MessageUtil from '../../../../../util/io_utils/MessageUtil';
import SocialMediaUtil from '../../../../../util/io_utils/SocialMediaUtil';
import MusicUtil from '../../../../../util/io_utils/MusicUtil';
import VideoUtil from '../../../../../util/io_utils/VideoUtil';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';


export default function (props) {
    let { title, introduction, pics, type, setSelector } = props
    console.log(props)
    let navigate = useNavigate()
    let avatar = useState(null)
    let miniture = (<div></div>)
    const handleClick = (event) => {
        if (props.content.type === "contact") {
            setSelector({ userId: props.content.userId, type: props.content.type })
        }
        else if (type === "movie") {
            setSelector({ videoId: props.content.videoId, type: props.content.type })
        }
        else if (type === "music") {
        }
        else if (type === "chatRecords") {

        }
        else if (type === "posts") {

        }
    }

    if (props.content.type === "contact") {
        return (<ListItemButton onClick={handleClick} sx={{ width: "100%" }}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary={props.content.name}
                    secondary={props.content.intro}
                />
            </ListItem>
        </ListItemButton>)

    } else if (type === "movie") {
        return (
            <ListItemButton onClick={handleClick} sx={{ width: "100%" }}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar variant="square"
                            src={props.content.image_address}
                            alt="Paella dish" />
                    </ListItemAvatar>
                    <ListItemText
                        primary={(props.content.translated_name ? props.content.translated_name : "") + (props.content.original_name ? props.content.original_name :"")}
                        secondary={<React.Fragment>
                            <Typography
                                sx={{ display:"block" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {props.content.release_date }
                            </Typography>
                            {props.content.introduction ? props.content.introduction.substring(0, 30) + "..." : ""}
                        </React.Fragment>}

                    />
                </ListItem>
            </ListItemButton>)
    } else if (type === "music") {

    } else if (type === "chatRecords") {

    } else if (type === "posts") {

    }



}