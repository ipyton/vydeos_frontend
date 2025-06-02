
// VideoCardRow.jsx
import VideoCard from "./VideoCard";
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// Row container with better mobile spacing
const RowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(2),
  width: '100%',
  
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1.5),
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    justifyContent: 'center',
  }
}));

export default function VideoCardRow(props) {
  return (
    <RowContainer>
      {props.row.map((item, idx) => (
        <VideoCard 
          key={item.movieId || idx}
          content={item}
        />
      ))}
    </RowContainer>
  );
}
