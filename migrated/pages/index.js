import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamic import for the Contents component to avoid SSR issues
const Contents = dynamic(() => import('../components/Contents'), { ssr: false });

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        setIsLoggedIn(true);
      }
      
      setIsLoading(false);
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Head>
          <title>Loading... | Blog</title>
        </Head>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Home | Next.js Blog</title>
        <meta name="description" content="A Next.js blog application" />
      </Head>
      <Contents setLogin={setIsLoggedIn} />
    </>
  );
} 