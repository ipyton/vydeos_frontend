import React, { useRef, useEffect } from 'react';
import styles from '../../../../styles/VideoPlayer.module.css';

const Clips = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Make sure we're in the browser before importing video.js
    if (typeof window === 'undefined') {
      return;
    }

    // Dynamically import video.js to avoid SSR issues
    const initializeVideoJs = async () => {
      // Only initialize player once
      if (!playerRef.current) {
        const videojs = (await import('video.js')).default;
        await import('video.js/dist/video-js.css');
        
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // Initialize player
        playerRef.current = videojs(videoElement, options, () => {
          console.log('Player is ready');
          onReady && onReady(playerRef.current);
        });
      } else {
        // Update player if options change
        const player = playerRef.current;
        if (player && options) {
          if (options.autoplay !== undefined) {
            player.autoplay(options.autoplay);
          }
          if (options.sources && options.sources.length) {
            player.src(options.sources);
          }
        }
      }
    };

    initializeVideoJs();

    // Dispose the Video.js player when the component unmounts
    return () => {
      const player = playerRef.current;
      if (player && typeof player.dispose === 'function') {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  // Wrap the player in a div with a specific className that video.js looks for
  return (
    <div className={styles.videoContainer}>
      <div data-vjs-player className={styles.playerWrapper}>
        <video 
          ref={videoRef} 
          className={`video-js vjs-big-play-centered ${styles.videoElement}`} 
        />
      </div>
    </div>
  );
};

export default Clips; 