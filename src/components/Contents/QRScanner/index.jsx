import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Paper,
  Container,
  Stack,
  Fade,
  Slide,
  Badge
} from '@mui/material';
import {
  Camera,
  Stop,
  Refresh,
  Link,
  CheckCircle,
  Error,
  Wifi,
  Email,
  Phone,
  TextFields,
  ContactPage,
  Close
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create custom theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
      dark: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const QRScanner = ({ 
  scannerSize = 280,
  compact = false 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [scanCount, setScanCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize html5-qrcode scanner
  useEffect(() => {
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

    // Add CSS for proper mobile viewport
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scan {
        0% { transform: translateY(0); }
        100% { transform: translateY(calc(100% - 4px)); }
      }
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      stopScanning();
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const initializeScanner = async () => {
    try {
      if (window.Html5Qrcode) {
        const devices = await window.Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('environment')
          ) || devices[0];
          setSelectedCamera(backCamera.id);
          
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
        fps: 5,
        qrbox: { 
          width: isMobile ? Math.min(250, window.innerWidth - 80) : scannerSize, 
          height: isMobile ? Math.min(250, window.innerWidth - 80) : scannerSize
        },
        aspectRatio: 1.0,
        disableFlip: false
      };

      await html5QrCodeRef.current.start(
        cameraId,
        config,
        (decodedText, decodedResult) => {
          setResult(decodedText);
          setShowResult(true);
          setScanCount(prev => prev + 1);
          stopScanning();
        },
        (errorMessage) => {
          // Normal scanning errors - don't show
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
      'URL': 'primary',
      'Contact': 'success',
      'WiFi': 'secondary',
      'Email': 'warning',
      'Phone': 'info',
      'Text': 'default'
    };
    return colors[type] || 'default';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'URL': Link,
      'Contact': ContactPage,
      'WiFi': Wifi,
      'Email': Email,
      'Phone': Phone,
      'Text': TextFields
    };
    return icons[type] || TextFields;
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #1a1a1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: isMobile ? 1 : 2
          }}
        >
          <Card sx={{ maxWidth: 300, width: '90%' }}>
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Box position="relative">
                  <CircularProgress size={60} thickness={4} />
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{ transform: 'translate(-50%, -50%)' }}
                  >
                    <Camera sx={{ fontSize: 24, color: 'primary.main' }} />
                  </Box>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Initializing Scanner
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Setting up camera access...
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100%',
          height:"calc(100vh - 64px)",
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 50%, #1a1a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          p: isMobile ? 1 : 2
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: isMobile ? '100%' : '600px',
            mx: 'auto',
            p: isMobile ? '8px !important' : undefined
          }}
        >
          <Card 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: isMobile ? 1 : 2,
              height: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh)'
            }}
          >
            <CardContent 
              sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: isMobile ? 1.5 : 3,
                '&:last-child': { pb: isMobile ? 1.5 : 3 }
              }}
            >
              {/* Error Display */}
              {error && (
                <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }} icon={<Error />}>
                  <AlertTitle>Scanner Error</AlertTitle>
                  {error}
                </Alert>
              )}

              {/* Scanner Area */}
              <Paper
                sx={{
                  position: 'relative',
                  flex: 1,
                  minHeight: isMobile ? '50vh' : '400px',
                  backgroundColor: '#000',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box 
                  id="qr-reader" 
                  sx={{ 
                    width: '100%', 
                    height: '100%',
                    '& video': {
                      width: '100% !important',
                      height: '100% !important',
                      objectFit: 'cover'
                    }
                  }} 
                />
                
                {!isScanning && !error && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Stack alignItems="center" spacing={2}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          animation: 'pulse 2s infinite'
                        }}
                      >
                        <Camera sx={{ fontSize: 40, color: 'white' }} />
                      </Paper>
                      <Typography color="white" variant={isMobile ? "body1" : "h6"}>
                        Ready to scan
                      </Typography>
                      <Typography color="rgba(255,255,255,0.7)" variant="body2">
                        Camera starting...
                      </Typography>
                    </Stack>
                  </Box>
                )}

                {/* Scanning Overlay */}
                {isScanning && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <Box
                      sx={{
                        width: isMobile ? Math.min(250, window.innerWidth - 80) : scannerSize,
                        height: isMobile ? Math.min(250, window.innerWidth - 80) : scannerSize,
                        position: 'relative',
                        border: '2px solid rgba(255,255,255,0.5)',
                        borderRadius: 2,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: 'linear-gradient(90deg, transparent, #2196f3, transparent)',
                          animation: 'scan 2s infinite'
                        }
                      }}
                    >
                      {/* Corner indicators */}
                      {[
                        { top: -8, left: -8, borderTop: '4px solid #2196f3', borderLeft: '4px solid #2196f3' },
                        { top: -8, right: -8, borderTop: '4px solid #2196f3', borderRight: '4px solid #2196f3' },
                        { bottom: -8, left: -8, borderBottom: '4px solid #2196f3', borderLeft: '4px solid #2196f3' },
                        { bottom: -8, right: -8, borderBottom: '4px solid #2196f3', borderRight: '4px solid #2196f3' }
                      ].map((style, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'absolute',
                            width: 24,
                            height: 24,
                            ...style,
                            animation: 'pulse 1.5s infinite'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>

              {/* Status */}
              {isScanning && (
                <Alert
                  severity="info"
                  sx={{ mb: 2, flexShrink: 0 }}
                  icon={
                    <Stack direction="row" spacing={0.5}>
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: 'info.main',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite',
                            animationDelay: `${i * 0.16}s`
                          }}
                        />
                      ))}
                    </Stack>
                  }
                >
                  Scanning for QR codes...
                </Alert>
              )}

              {/* Controls */}
              <Stack spacing={2} sx={{ flexShrink: 0 }}>
                {!isScanning && !error && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Camera />}
                    onClick={() => startScanning()}
                    sx={{
                      background: 'linear-gradient(45deg, #2196f3 30%, #9c27b0 90%)',
                      py: isMobile ? 1.5 : 1.5
                    }}
                  >
                    Start Scanning
                  </Button>
                )}

                {isScanning && (
                  <Button
                    variant="contained"
                    size="large"
                    color="error"
                    startIcon={<Stop />}
                    onClick={stopScanning}
                    sx={{ py: isMobile ? 1.5 : 1.5 }}
                  >
                    Stop Scanning
                  </Button>
                )}

                {/* Camera Selector */}
                {cameras.length > 1 && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Camera</InputLabel>
                    <Select
                      value={selectedCamera}
                      label="Camera"
                      onChange={(e) => switchCamera(e.target.value)}
                      startAdornment={<Refresh sx={{ mr: 1 }} />}
                    >
                      {cameras.map((camera, index) => (
                        <MenuItem key={camera.id} value={camera.id}>
                          {camera.label || `Camera ${index + 1}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Container>

        {/* Result Dialog */}
        <Dialog
          open={showResult}
          onClose={handleResultClose}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'up' }}
        >
          <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CheckCircle />
              <Box>
                <Typography variant="h6">Success!</Typography>
                <Typography variant="body2">QR Code detected</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={handleResultClose} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Chip
                icon={React.createElement(getTypeIcon(getResultType(result)), { fontSize: 'small' })}
                label={getResultType(result)}
                color={getResultColor(getResultType(result))}
                variant="filled"
                sx={{ alignSelf: 'flex-start' }}
              />
              
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    lineHeight: 1.6,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  {result}
                </Typography>
              </Paper>

              {isURL(result) && (
                <Button
                  variant="contained"
                  startIcon={<Link />}
                  onClick={() => window.open(result, '_blank')}
                  sx={{
                    background: 'linear-gradient(45deg, #2196f3 30%, #00bcd4 90%)'
                  }}
                >
                  Open Link
                </Button>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleRescan}
              sx={{ flex: 1 }}
            >
              Scan Again
            </Button>
            <Button
              variant="outlined"
              onClick={handleResultClose}
              sx={{ flex: 1 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default QRScanner;