import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import UserInfo from '../components/Contents/UserInfo';
import { requireAuthentication } from '../utils/AuthUtil';

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const isAuth = await requireAuthentication();
        setIsAuthenticated(isAuth);
        
        if (!isAuth) {
          // Redirect to login page if not authenticated
          router.push('/login?redirect=profile');
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push('/login?redirect=profile');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Only render UserInfo component if authenticated
  if (!isAuthenticated) {
    return null; // Or a loading state
  }
  
  return (
    <>
      <Head>
        <title>User Profile</title>
        <meta name="description" content="Manage your profile and account settings" />
      </Head>
      <UserInfo />
    </>
  );
} 