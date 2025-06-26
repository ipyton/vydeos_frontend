import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Settings from '../components/Contents/Settings';
import { requireAuthentication } from '../utils/AuthUtil';

export default function SettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const isAuth = await requireAuthentication();
        setIsAuthenticated(isAuth);
        
        if (!isAuth) {
          // Redirect to login page if not authenticated
          router.push('/login?redirect=settings');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push('/login?redirect=settings');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
      }}>
        <Head>
          <title>Loading Settings...</title>
        </Head>
        <p>Loading settings...</p>
      </div>
    );
  }
  
  // Only render Settings component if authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <>
      <Head>
        <title>Settings | Blog</title>
        <meta name="description" content="Manage your account and application settings" />
      </Head>
      <Settings />
    </>
  );
} 