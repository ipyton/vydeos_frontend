import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import components with SSR disabled
const Header = dynamic(() => import('../../components/Header'), { ssr: false });
const VideoUtil = dynamic(() => import('../../utils/VideoUtil'), { ssr: false });

// Use dynamic import for video.js to avoid SSR issues
const VideoPlayer = dynamic(
  () => import('../../components/Contents/Videos/clips'),
  { ssr: false }
);

export default function SingleVideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerOptions, setPlayerOptions] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Check authentication
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      setIsAuthenticated(false);
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);
  
  useEffect(() => {
    // Skip if not authenticated or no id
    if (!isAuthenticated || !id || !isClient) {
      return;
    }
    
    setLoading(true);
    
    const movieIdentifier = {
      resource_id: id,
      type: 'movie' // Default type, can be adjusted based on your data model
    };
    
    // Get video information
    VideoUtil.getVideoInformation(movieIdentifier, setVideoData)
      .then(response => {
        if (!response || !response.data) {
          setError("Could not load video information");
          setLoading(false);
          return;
        }
        
        // Check if video is playable
        return VideoUtil.isPlayable(movieIdentifier);
      })
      .then(playableResponse => {
        if (!playableResponse || !playableResponse.data || !playableResponse.data.playable) {
          setError("This video is not available for playback");
          setLoading(false);
          return;
        }
        
        // Video is playable - set up player options
        setPlayerOptions({
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          sources: [{
            src: videoData?.videoUrl || '',
            type: 'video/mp4'
          }]
        });
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading video:", err);
        setError("Failed to load video. Please try again later.");
        setLoading(false);
      });
  }, [id, videoData?.videoUrl, isAuthenticated, isClient]);
  
  if (!isClient) {
    return null; // Return nothing during server-side rendering
  }
  
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Please log in to view this video</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Video | Blog Platform</title>
        </Head>
        <Header />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 200px)',
          padding: '20px'
        }}>
          <div style={{
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            borderTop: '4px solid #3498db',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p>Loading video...</p>
        </div>
      </>
    );
  }
  
  if (error || !videoData) {
    return (
      <>
        <Head>
          <title>Error | Blog Platform</title>
        </Head>
        <Header />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 200px)',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '16px' }}>Error</h2>
          <p>{error || "Could not load video"}</p>
          <button 
            onClick={() => router.push('/videos')}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Videos
          </button>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>{videoData.movieName || 'Video'} | Blog Platform</title>
        <meta name="description" content={videoData.description || 'Watch this video'} />
      </Head>
      
      <Header />
      
      <main style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <h1 style={{ 
          marginBottom: '16px',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          {videoData.movieName || 'Untitled Video'}
        </h1>
        
        <div style={{ marginBottom: '24px' }}>
          {videoData.releaseYear && (
            <span style={{ 
              marginRight: '16px', 
              color: '#666' 
            }}>
              {videoData.releaseYear}
            </span>
          )}
        </div>
        
        <div style={{ 
          position: 'relative', 
          paddingBottom: '56.25%', /* 16:9 aspect ratio */ 
          height: 0, 
          overflow: 'hidden',
          maxWidth: '100%', 
          marginBottom: '24px' 
        }}>
          {playerOptions.sources && playerOptions.sources[0].src && (
            <VideoPlayer options={playerOptions} />
          )}
        </div>
        
        {videoData.description && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px', 
              marginBottom: '8px', 
              fontWeight: '500' 
            }}>
              Description
            </h2>
            <p style={{ lineHeight: '1.6' }}>{videoData.description}</p>
          </div>
        )}
      </main>
      
      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        borderTop: '1px solid #eaeaea',
        marginTop: '40px'
      }}>
        <p>© {new Date().getFullYear()} Blog Platform. All rights reserved.</p>
      </footer>
    </>
  );
} 