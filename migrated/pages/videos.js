import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Dynamic imports for components that use browser-only features
const VideoGallery = dynamic(
  () => import('../components/Contents/VideoList'),
  { ssr: false }
);

const Header = dynamic(
  () => import('../components/Header'),
  { ssr: false }
);

export default function VideosPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  if (!isClient) {
    return null; // Return nothing during server-side rendering
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Please log in to view videos</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Videos | Blog Platform</title>
        <meta name="description" content="Video gallery for your favorite content" />
      </Head>
      
      <Header />
      
      <main style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <h1 style={{ 
          marginBottom: '24px',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Video Gallery
        </h1>
        
        <VideoGallery />
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