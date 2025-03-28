import VideoCard from "./VideoCard";
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// Row container with responsive margins
const RowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(2),
  width: '90%',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    width: '95%'
  }
}));

export default function VideoCardRow(props) {
  return (
    <RowContainer>
      {props.row.map((item, idx) => (
        <VideoCard 
          key={item.movieId || idx}
          content = {item}
        />
      ))}
    </RowContainer>
  );
}