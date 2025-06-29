import React from 'react';
import Head from 'next/head';
import NotFound from '../components/Contents/NotFound';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>
      <NotFound />
    </>
  );
} 