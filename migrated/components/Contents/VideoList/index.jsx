import React, { useState, useEffect } from 'react';
import VideoCardRow from './VideoCardRow';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import VideoUtil from '../../../utils/VideoUtil';
import styles from '../../../styles/VideoList.module.css';

// Use dynamic import for VideoUtil to avoid SSR issues
const VideoUtilClient = dynamic(
  () => import('../../../utils/VideoUtil'),
  { ssr: false }
);

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
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Server-side rendering check
    if (typeof window === 'undefined') {
      return;
    }
    
    const getResponsiveSize = () => {
      if (window.innerWidth < 600) return 1; // Mobile: 1 per row
      if (window.innerWidth < 960) return 2; // Tablet: 2 per row
      return 4; // Desktop: 4 per row
    };
    
    const size = getResponsiveSize();
    setRows([]);
    setLoading(true);
    
    VideoUtilClient.getGallery()
      .then(response => {
        if (!response || !response.data) {
          setError("No data received");
          setLoading(false);
          return;
        }
        
        const body = response.data;
        const newRows = [];
        
        for (let i = 0; i < Math.floor(body.length / size) + 1; i++) {
          let row = [];
          for (let col = 0; col < size && i * size + col < body.length; col++) {
            row.push(body[i * size + col]);
          }
          if (row.length > 0) {
            newRows.push(row);
          }
        }
        
        setRows(newRows);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching video gallery:", err);
        setError("Failed to load videos");
        setLoading(false);
      });
      
    // Add window resize handler
    const handleResize = () => {
      const newSize = getResponsiveSize();
      if (newSize !== size) {
        // Re-render with new responsive size
        setRows([]);
        setLoading(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading videos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (!rows.length) {
    return (
      <div className={styles.emptyContainer}>
        <p>No videos available</p>
      </div>
    );
  }
  
  return (
    <GalleryContainer className={styles.galleryContainer}>
      {rows.map((item, index) => (
        <VideoCardRow key={`row-${index}`} row={item} />
      ))}
    </GalleryContainer>
  );
} 