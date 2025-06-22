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
  scannerSize = 400,
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
          width: isMobile ? Math.min(250, window.innerWidth-80) : scannerSize, 
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
                        Camera waiting...
                      </Typography>
                    </Stack>
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
  PaperProps={{
    sx: {
      borderRadius: isMobile ? 0 : 4,
      backdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      ...(theme.palette.mode === 'dark' && {
        backgroundColor: 'rgba(18, 18, 18, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      })
    }
  }}
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    }
  }}
>
  <DialogTitle 
    sx={{ 
      background: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      p: 3,
      minHeight: 100,
      display: 'flex',
      alignItems: 'center',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)',
        backdropFilter: 'blur(20px)',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
      }
    }}
  >
    <Stack 
      direction="row" 
      spacing={3} 
      alignItems="center"
      sx={{ 
        position: 'relative', 
        zIndex: 2,
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 100%)',
            opacity: 0.5,
          }
        }}
      >
        <CheckCircle sx={{ 
          fontSize: 32, 
          position: 'relative', 
          zIndex: 1,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
          color: '#22c55e'
        }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.9) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5
          }}
        >
          Success!
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            opacity: 0.9,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            fontWeight: 500,
            letterSpacing: '0.01em'
          }}
        >
          QR Code detected successfully
        </Typography>
      </Box>
      <IconButton 
        onClick={handleResultClose} 
        sx={{ 
          color: 'white',
          width: 44,
          height: 44,
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.05) translateY(-1px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Close sx={{ fontSize: 20 }} />
      </IconButton>
    </Stack>
  </DialogTitle>

  <DialogContent sx={{ p: 3, position: 'relative' }}>
    <Stack spacing={3}>
      <Chip
        icon={React.createElement(getTypeIcon(getResultType(result)), { fontSize: 'small' })}
        label={getResultType(result)}
        color={getResultColor(getResultType(result))}
        variant="filled"
        sx={{ 
          alignSelf: 'flex-start',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '& .MuiChip-label': {
            fontWeight: 500,
          }
        }}
      />

      <Paper
        sx={{
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          ...(theme.palette.mode === 'dark' && {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }),
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          }
        }}
      >
        <Typography
          variant="body1"
          sx={{
            wordBreak: 'break-all',
            fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
            lineHeight: 1.6,
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontWeight: 400,
            position: 'relative',
            zIndex: 1,
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            py: 1.5,
            px: 3,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(59, 130, 246, 0.5)',
              '&::before': {
                opacity: 1,
              }
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Open Link
        </Button>
      )}
    </Stack>
  </DialogContent>

  <DialogActions 
    sx={{ 
      p: 3, 
      gap: 2,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <Button
      variant="contained"
      color="success"
      onClick={handleRescan}
      sx={{ 
        flex: 1,
        borderRadius: 3,
        py: 1.5,
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '1rem',
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 6px 20px rgba(34, 197, 94, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      Scan Again
    </Button>
    <Button
      variant="outlined"
      onClick={handleResultClose}
      sx={{ 
        flex: 1,
        borderRadius: 3,
        py: 1.5,
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: theme.palette.mode === 'dark' ? 'white' : 'inherit',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-1px)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
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