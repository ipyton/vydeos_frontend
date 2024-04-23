import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { ListItemButton } from '@mui/material';

export default function(props){
    let { content, idx , setSelector} = props

    let handleClick = (idx) => {
        if (1 === idx || 0 === idx || 2 === idx) {
            setSelector({ type: "userId", content: content.friend_id })
        } else if (3 === idx) {
            setSelector({ type: "groupId", content: content.group_id })
        } else if (4 === idx) {
            setSelector({ type: "invitationId", content: content.invitation_id})
        } else if (5 === idx) {
            setSelector({ type: "userId", content: content.friend_id })

        }
    }

    if(0 === idx || 1 === idx || 2 === idx) {
        return (<div>
            <ListItemButton onClick={handleClick(idx)} sx={{width:"100%"}}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary={content.friend_id}
                    />
                </ListItem>
            </ListItemButton>
            <Divider></Divider>

        </div>)
    }
    else if ( 3 === idx ){
        return (<div>
            <ListItemButton onClick={handleClick(idx) }>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Tim"
                    />
                </ListItem>
            </ListItemButton>
            <Divider></Divider>

        </div>)
    }
    else if (4 === idx ) {
        return (<div>
            <ListItemButton onClick={handleClick(idx)}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Tim"
                    />
                </ListItem>
            </ListItemButton>
            <Divider></Divider>

        </div>)


    }
    else if (5 === idx) {
        return (<div>
            <ListItemButton onClick={handleClick(idx)}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Tim"
                    />
                </ListItem>
            </ListItemButton>
            <Divider></Divider>

        </div>)


    }
}