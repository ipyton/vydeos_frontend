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
    VideoUtil.getGallery(setRows);
  }, []);
  
  return (
    <GalleryContainer>
      {rows.map((item, index) => (
        <VideoCardRow key={index} row={item} />
      ))}
    </GalleryContainer>
  );
}