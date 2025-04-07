import Stack from '@mui/material/Stack';
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
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
import { useEffect } from "react";
import axios from "axios"
import AccountUtil from "../../../../util/io_utils/AccountUtil";
import Qs from "qs"
import { List, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
import { update } from '../../../redux/refresh';

export default function (props) {
    const users = [
        { name: 'John Doe', avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { name: 'Jane Smith', avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { name: 'Mark Johnson', avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg' },
    ];
    let dispatch = useDispatch()
    const [details, setDetails] = useState({
        groupName: "",
    })
    const [members, setMembers] = useState([])
    const handleChat = (event) => {
        console.log(details)
        let contact = { type: "group", userId: details.groupId, name: details.groupName }
        DatabaseManipulator.addRecentContact(contact).then(
            ()=>{
                navigate("/chat", { ...contact })
                dispatch(update())
            }
        )

    }
    useEffect(() => {
        axios({
            url: AccountUtil.getUrlBase() + "/group_chat/getDetail?groupId=" + props.groupId,
            method: 'get',
            data: { token: localStorage.getItem("token") },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
            headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(err => {
            console.log(err)
        }).then(
            response => {
                if (response === undefined || response.data === undefined) {
                    console.log("login error")
                    return
                }
                setDetails(response.data)
                axios({
                    url: AccountUtil.getUrlBase() + "/group_chat/get_members?groupId=" + props.groupId,
                    method: 'get',
                    data: { token: localStorage.getItem("token") },
                    transformRequest: [function (data) {
                        return Qs.stringify(data)
                    }],
                    headers: {
                        token: localStorage.getItem("token"),
                    }
                }).catch(err => {
                    console.log(err)
                }).then((res) => {

                    let object = JSON.parse(res.data.message)
                    setMembers(object)
                })

            }
        )
    }, [props.groupId])

    let navigate = useNavigate()



    return (
        <Stack
            direction="column"
            // justifyContent="center"
            alignItems="center"
            spacing={0.5} sx={{ width: "100%", overflow: "scroll", boxShadow: 0, height: "100%" }}>
            <Stack direction="row" justifyContent="end" sx={{ width: "70%" }}>
                <ListItem alignItems="flex-start" >
                    <ListItemAvatar>
                        <Avatar alt={details.groupId} src={details.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={details.groupName}

                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                </Typography>
                                {details.groupId}
                            </React.Fragment>
                        }
                    />

                </ListItem>


                <ButtonGroup sx={{ marginTop: "3%", height: "50%" }} aria-label="Basic button group" >
                    {<Button onClick={handleChat}> {"Chat"}</Button>}
                </ButtonGroup>
            </Stack>

            <Stack>
                {details.groupDescription}
            </Stack>
            <Stack sx={{ width: "60%", }}>
                <TextField
                    id="outlined-required"
                    label="Create Time"
                    defaultValue={details.create_time}
                    variant="standard"
                    focused
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <List>
                    {members.map((user, index) => (
                        <ListItem key={index}>
                            <ListItemAvatar>
                                <Avatar src={user.avatarUrl} alt={user.name} />
                            </ListItemAvatar>
                            <ListItemText primary={user.userId} />
                        </ListItem>
                    ))}
                </List>



            </Stack>
        </Stack>
    )
}