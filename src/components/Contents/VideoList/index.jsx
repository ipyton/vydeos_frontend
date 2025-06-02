// VideoGallery.jsx
import VideoCardRow from "./VideoCardRow";
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import VideoUtil from "../../../util/io_utils/VideoUtil";

// Container for rows with responsive spacing
const GalleryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(1, 2),
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1.5),
    padding: theme.spacing(1),
  }
}));

export default function VideoGallery() {
  const [rows, setRows] = React.useState([]);
  
  React.useEffect(() => {
    const getResponsiveSize = () => {
      if (window.innerWidth < 600) return 1; // Mobile: 1 per row
      if (window.innerWidth < 960) return 2; // Tablet: 2 per row
      return 4; // Desktop: 4 per row
    };
    
    const size = getResponsiveSize();
    setRows([]);
    
    VideoUtil.getGallery().then(function (response) {
      if (!response || !response.data) {
        console.log(response);
        return;
      }
      
      console.log(response);
      let rows = [];
      const body = response.data;
      console.log(Math.floor(body.length / size) + 1);
      
      for (let i = 0; i < Math.floor(body.length / size) + 1; i++) {
        let row = [];
        for (let col = 0; col < size && i * size + col < body.length; col++) {
          row.push(body[i * size + col]);
        }
        if (row.length > 0) {
          console.log(row);
          rows.push(row);
        }
      }
      setRows(rows);
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