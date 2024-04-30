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



export default function (props) {
    let { title, introduction, pics, type, objectId } = props
    let navigate = useNavigate()
    let avatar = useState(null)
    let miniture = (<div></div>)
    let dispatch = useDispatch()
    const handleSuggestionSelection = (event) => {
        //console.log(setSuggestionOpen)
        if (type === "contact") {
            MessageUtil.requestUserInfo(objectId, navigate)
        }
        else if (type === "movie") {
            SearchUtil.searchVideos()
        }
        else if (type === "music") {
            
        }
        else if (type === "chatRecords") {

        }
        else if (type === "posts") {
        
        }
        //navigate("/friendInfomation")
    }

    if (type === "contact") {
        miniture = (
            <ListItemAvatar>
                <Avatar alt="Cindy Baker" src={pics} />
            </ListItemAvatar>)
    } else if (type === "movie") {
        miniture = (
            <ListItemAvatar>
                <Avatar
                    variant="square"
                    src={"https://handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg"}
                    alt="Paella dish"
                />
            </ListItemAvatar>)
    } else if (type === "music") {

    } else if (type === "chatRecords") {

    } else if (type === "posts") {

    }



    return (
        <ListItemButton onClick={handleSuggestionSelection}>
            <ListItem alignItems="flex-start">
                {
                    miniture
                }
                <ListItemText
                    primary={title}
                    secondary={
                        <React.Fragment>
                            {introduction}
                        </React.Fragment>
                    }
                />
            </ListItem>
        </ListItemButton>
    )
}