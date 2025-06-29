import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the QRScanner component with no SSR
const QRScanner = dynamic(
  () => import('../components/Contents/QRScanner'),
  { ssr: false }
);

const QRScannerPage = () => {
  return (
    <>
      <Head>
        <title>QR Scanner</title>
        <meta name="description" content="Scan QR codes with your camera" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <QRScanner />
    </>
  );
};

export default QRScannerPage; 