// VideoGallery.jsx
import VideoCardRow from "./VideoCardRow";
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import VideoUtil from "../../../util/io_utils/VideoUtil";

// Container for rows with consistent spacing
const GalleryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(2, 0),
  width: '100%'
}));

export default function VideoGallery() {
  const [rows, setRows] = React.useState([]);
  
  React.useEffect(() => {
    const size = 4
    setRows([])
    VideoUtil.getGallery().then(function (response) {
      if (!response) {
          console.log(response)
          return
      }
      if (!response.data) {
          console.log(response)
          return
      }
      console.log(response)
      let rows = []
      const body = response.data
      console.log(Math.floor(body.length / size) + 1)
      for (let i = 0; i < Math.floor(body.length / size) + 1; i++) {
          let row = []
          for (let col = 0; col < size && i * size + col < body.length; col++) {
              row.push(body[i * size + col])
          }
          console.log(row)
          rows.push(row)
      }
      setRows(rows)
  });
  }, []);
  
  return (
    <GalleryContainer>
      {rows.map((item, index) => (
        <VideoCardRow key={index} row={item} />
      ))}
    </GalleryContainer>
  );
}