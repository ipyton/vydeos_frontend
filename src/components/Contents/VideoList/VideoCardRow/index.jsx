import VideoCard from "./VideoCard"
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useLocation } from "react-router-dom";
import VideoUtil from "../../../../util/io_utils/VideoUtil";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
export default function() {
  const [rows,setRows] = React.useState([])
  React.useEffect(()=>{
    VideoUtil.getGallery(setRows)
  },[]) 

    return (<Stack direction="row" spacing={2} sx={{marginLeft:"10%",width:"80%"}}>
      {rows.map((item,idx)=>{
        return (<VideoCard movieId={item.movieId} title={item.title} intro={item.intro} actors={item.actors} poster={item.poster}></VideoCard>)
      })}


    </Stack>)
}