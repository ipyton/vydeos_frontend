import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Register plugin
require("@silvermine/videojs-quality-selector")(videojs);
require("@silvermine/videojs-quality-selector/dist/css/quality-selector.css");

export default function LongVideo({ options, onReady }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const isUnmounted = useRef(false);

  useEffect(() => {
    // Initialize player reference
    if (!playerRef.current) {
      if (!videoRef.current) return;
      
      const player = videojs(videoRef.current, {
        ...options,
        // Ensure we're not setting sources yet to avoid initial load issues
        sources: []
      });
      
      player.ready(() => {
        console.log("Player initially ready");
        player.controlBar.addChild("QualitySelector");
        playerRef.current = player;
        
        if (options && options.sources && options.sources.length) {
          player.src(options.sources);
        }
        
        if (onReady && !isUnmounted.current) {
          onReady(player);
        }
      });
    } 
    // Update existing player when options change
    else if (playerRef.current && options) {
      const player = playerRef.current;
      
      // Update sources if they changed
      if (options.sources && options.sources.length) {
        player.src(options.sources);
      }
      
      // Update other player options
      for (const [key, value] of Object.entries(options)) {
        if (key !== 'sources') {
          try {
            player[key] = value;
          } catch (e) {
            console.warn(`Failed to update option ${key}:`, e);
          }
        }
      }
    }

    return () => {
      isUnmounted.current = true;
    };
  }, []);

  // Separate effect for handling options changes
  useEffect(() => {
    if (!playerRef.current || !options) return;
    
    const player = playerRef.current;
    
    // Only update sources if they changed
    if (options.sources && options.sources.length) {
      player.src(options.sources);
    }
    
    // Update other options that may have changed
    for (const [key, value] of Object.entries(options)) {
      if (key !== 'sources') {
        try {
          player[key] = value;
        } catch (e) {
          console.warn(`Failed to update option ${key}:`, e);
        }
      }
    }
  }, [options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch (e) {
          console.warn("Dispose failed:", e);
        }
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        controls
        preload="auto"
      ></video>
    </div>
  );
}