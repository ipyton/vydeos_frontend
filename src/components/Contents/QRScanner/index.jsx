import React, { useState, useEffect, useRef } from 'react';
import { Camera, Square, AlertCircle, CheckCircle, RefreshCw, ExternalLink, Zap } from 'lucide-react';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [scanCount, setScanCount] = useState(0);
  
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Initialize html5-qrcode scanner
  useEffect(() => {
    // Load html5-qrcode library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js';
    script.async = true;
    script.onload = () => {
      initializeScanner();
    };
    script.onerror = () => {
      setError('Failed to load QR scanner library');
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      stopScanning();
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeScanner = async () => {
    try {
      if (window.Html5Qrcode) {
        // Get available cameras
        const devices = await window.Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera (environment facing)
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('environment')
          ) || devices[0];
          setSelectedCamera(backCamera.id);
          
          // Auto-start scanning
          setTimeout(() => {
            startScanning(backCamera.id);
          }, 800);
        } else {
          setError('No cameras found on this device');
        }
      } else {
        setError('QR scanner not available');
      }
    } catch (err) {
      setError('Failed to access camera: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startScanning = async (cameraId = selectedCamera) => {
    try {
      setError('');
      setIsScanning(true);
      
      if (!window.Html5Qrcode) {
        throw new Error('QR scanner library not loaded');
      }

      html5QrCodeRef.current = new window.Html5Qrcode("qr-reader");
      
      const config = {
        fps: 10,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        disableFlip: false
      };

      await html5QrCodeRef.current.start(
        cameraId,
        config,
        (decodedText, decodedResult) => {
          // Success callback
          setResult(decodedText);
          setShowResult(true);
          setScanCount(prev => prev + 1);
          stopScanning();
        },
        (errorMessage) => {
          // Error callback (usually just "No QR code found")
          // We don't show these as they're normal during scanning
        }
      );
      
    } catch (err) {
      setError('Failed to start scanning: ' + err.message);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current && isScanning) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleResultClose = () => {
    setShowResult(false);
    setResult('');
  };

  const handleRescan = () => {
    setShowResult(false);
    setResult('');
    startScanning();
  };

  const switchCamera = async (cameraId) => {
    if (isScanning) {
      await stopScanning();
    }
    setSelectedCamera(cameraId);
    setTimeout(() => startScanning(cameraId), 200);
  };

  const isURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const getResultType = (content) => {
    if (isURL(content)) return 'URL';
    if (content.includes('BEGIN:VCARD')) return 'Contact';
    if (content.includes('WIFI:')) return 'WiFi';
    if (content.includes('mailto:')) return 'Email';
    if (content.includes('tel:')) return 'Phone';
    return 'Text';
  };

  const getResultColor = (type) => {
    const colors = {
      'URL': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      'Contact': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      'WiFi': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      'Email': 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      'Phone': 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
      'Text': 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
    };
    return colors[type] || colors['Text'];
  };

  const getTypeIcon = (type) => {
    const icons = {
      'URL': ExternalLink,
      'Contact': Camera,
      'WiFi': Zap,
      'Email': Camera,
      'Phone': Camera,
      'Text': Camera
    };
    return icons[type] || Camera;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-ping"></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Initializing Scanner</h2>
              <p className="text-purple-200">Setting up camera access...</p>
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Camera className="w-7 h-7 text-white" />
                    </div>
                    {scanCount > 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{scanCount}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">QR Scanner Pro</h1>
                    <p className="text-white/80 text-sm">Advanced QR detection</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-xs">Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="m-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-red-300 font-medium">Scanner Error</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Scanner Area */}
          <div className="p-4">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-inner" style={{ aspectRatio: '1' }}>
              <div id="qr-reader" className="w-full h-full"></div>
              
              {!isScanning && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm">
                  <div className="text-center text-white">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Camera className="w-10 h-10 text-white/70" />
                      </div>
                      <div className="absolute inset-0 border-2 border-white/30 rounded-2xl animate-pulse"></div>
                    </div>
                    <p className="text-white/80 font-medium">Ready to scan</p>
                    <p className="text-white/60 text-sm mt-1">Camera starting...</p>
                  </div>
                </div>
              )}

              {/* Enhanced Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-56 h-56">
                      {/* Main scanning frame */}
                      <div className="absolute inset-0 border-2 border-white/50 rounded-2xl"></div>
                      
                      {/* Animated corners */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl animate-pulse"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl animate-pulse"></div>
                      
                      {/* Scanning line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-bounce" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            {isScanning && (
              <div className="flex items-center justify-center gap-3 mt-4 p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-500/30">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-blue-200 font-medium">Scanning for QR codes...</span>
              </div>
            )}

            {/* Controls */}
            <div className="mt-4 space-y-3">
              {!isScanning && !error && (
                <button
                  onClick={() => startScanning()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <Camera className="w-6 h-6" />
                  Start Scanning
                </button>
              )}

              {isScanning && (
                <button
                  onClick={stopScanning}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <Square className="w-6 h-6" />
                  Stop Scanning
                </button>
              )}

              {/* Camera Selector */}
              {cameras.length > 1 && (
                <div className="space-y-3">
                  <label className="block text-white/80 font-medium">Switch Camera:</label>
                  <div className="relative">
                    <select
                      value={selectedCamera}
                      onChange={(e) => switchCamera(e.target.value)}
                      className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      {cameras.map((camera, index) => (
                        <option key={camera.id} value={camera.id} className="bg-gray-800 text-white">
                          {camera.label || `Camera ${index + 1}`}
                        </option>
                      ))}
                    </select>
                    <RefreshCw className="absolute right-3 top-3 w-5 h-5 text-white/60 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-sm w-full max-h-96 overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Success!</h3>
                  <p className="text-green-100 text-sm">QR Code detected</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold ${getResultColor(getResultType(result))}`}>
                  {React.createElement(getTypeIcon(getResultType(result)), { className: "w-4 h-4" })}
                  {getResultType(result)}
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <p className="text-white text-sm break-all leading-relaxed">{result}</p>
              </div>

              {isURL(result) && (
                <button
                  onClick={() => window.open(result, '_blank')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleRescan}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Scan Again
                </button>
                <button
                  onClick={handleResultClose}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;