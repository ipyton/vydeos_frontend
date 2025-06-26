import React from 'react';
import VideoCard from './VideoCard';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import styles from '../../../../styles/VideoCardRow.module.css';

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
  if (!props.row || !Array.isArray(props.row) || props.row.length === 0) {
    return null;
  }
  
  return (
    <RowContainer className={styles.rowContainer}>
      {props.row.map((item, idx) => (
        <VideoCard 
          key={item.movieId || `video-${idx}`}
          content={item}
        />
      ))}
    </RowContainer>
  );
} 