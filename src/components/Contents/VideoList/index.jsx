import VideoCardRow from "./VideoCardRow"
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import VideoUtil from "../../../util/io_utils/VideoUtil";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    alignContent: true,
    color: theme.palette.primary.light,
  boxShadow: 0
  }));

export default function() {

  const [rows, setRows] = React.useState([])
  React.useEffect(() => {
    VideoUtil.getGallery(setRows)
  }, []) 
    return (
    <Stack sx={{marginTop:2}}>
      {
        rows.map((item, index)=>{
          return <Item><VideoCardRow row={item}></VideoCardRow></Item>
        })

      }

           
    </Stack>
    )
}