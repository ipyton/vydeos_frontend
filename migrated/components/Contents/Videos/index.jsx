import React, { useState, useEffect } from 'react';
import Clips from './clips';
import styles from '../../../styles/Videos.module.css';

export default function Videos() {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return;
    }
    
    // In a real app, this would fetch data from an API
    // For now, we'll just use dummy data
    const dummyVideoData = Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      title: `Video ${i + 1}`,
      src: ''  // Would be the actual video URL in a real app
    }));
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setVideoData(dummyVideoData);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  return (
    <div className={styles.videosGrid}>
      {videoData.map((video) => (
        <div key={video.id} className={styles.videoItem}>
          <Clips
            options={{
              autoplay: false,
              controls: true,
              responsive: true,
              fluid: true,
              sources: [{
                src: video.src,
                type: 'video/mp4'
              }]
            }}
          />
          <h3 className={styles.videoTitle}>{video.title}</h3>
        </div>
      ))}
    </div>
  );
} 