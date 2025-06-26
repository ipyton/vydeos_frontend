import React from 'react';
import NotFoundError from '../components/Errors/NotFoundError';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
      </Head>
      <NotFoundError />
    </>
  );
} 