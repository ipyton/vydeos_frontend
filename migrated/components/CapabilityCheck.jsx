import React from 'react';

export default function CapabilityCheck() {
    // Check for browser environment to avoid SSR issues
    if (typeof window === 'undefined') {
        return null;
    }
    
    const indexedDB = window.indexedDB || window.WebKitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    
    if (!indexedDB) {
        return <div>Your browser does not support IndexDB! Please update your browser.</div>;
    }
    
    return null;
} 