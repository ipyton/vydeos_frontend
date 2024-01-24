import Comment from "./Comment"
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import { Paper } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  


export default function Comments(commentList) {
    commentList = [1,2,3,4,5]
    return (<div>
        {commentList.map(element => {
            return <Comment avatar={element.avatar} name={element.name} content={element.content} likes={element.likes} subComments={element.subComments}></Comment>
        })}

    </div>
        
  )

}