import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import the AccountIssue component with no SSR to avoid hydration issues
const AccountIssue = dynamic(() => import('../../components/AccountIssue'), { ssr: false });

export default function SignupPage() {
  return (
    <>
      <Head>
        <title>Sign Up - Blog</title>
        <meta name="description" content="Create a new account" />
      </Head>
      <AccountIssue />
    </>
  );
} 