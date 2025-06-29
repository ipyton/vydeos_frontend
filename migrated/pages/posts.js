import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Import components with SSR disabled
const Header = dynamic(() => import('../components/Header'), { ssr: false });
const Item = dynamic(() => import('../components/Contents/Item'), { ssr: false });

export default function PostsPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [login, setLogin] = useState(true);
  const [barState, setBarState] = useState(false);

  // Check authentication after component mounts
  useEffect(() => {
    setIsClient(true);
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      setIsAuthenticated(false);
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);
  
  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <p>Please log in to view posts</p>
        <button 
          onClick={() => router.push('/login')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Posts | Blog Platform</title>
        <meta name="description" content="View and share posts with your friends" />
      </Head>
      
      <Header />
      
      <main style={{ paddingTop: '20px', minHeight: 'calc(100vh - 64px)' }}>
        <Item 
          login={login} 
          setLogin={setLogin}
          barState={barState}
          setBarState={setBarState} 
        />
      </main>
    </>
  );
} 