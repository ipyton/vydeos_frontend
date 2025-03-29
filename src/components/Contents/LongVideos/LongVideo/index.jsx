import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function LongVideo({ options, onReady }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // 初始化播放器
    const timeoutId = setTimeout(() => {
      if (!playerRef.current && options) {
        const videoElement = videoRef.current;
        if (!videoElement) {
          console.error("Video element not found");
          return;
        }
        
        try {
          const player = playerRef.current = videojs(videoElement, options, () => {
            console.log("Player is ready");
            if (onReady) {
              onReady(player);
            }
          });
        } catch (error) {
          console.error("Error initializing video.js:", error);
        }
      }
    }, 100); // 100ms 延迟

    // 清除播放器
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}
