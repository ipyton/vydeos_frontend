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
  Slide,
} from '@mui/material';

import {
  Camera,
  Stop,
  Refresh,
  Link as LinkIcon,
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
import styles from '../../../styles/QRScanner.module.css';

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
  const [isClient, setIsClient] = useState(false);

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Check if we're on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if device is mobile
  useEffect(() => {
    if (!isClient) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient]);

  // Initialize html5-qrcode scanner
  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient]);

  const initializeScanner = async () => {
    try {
      if (typeof window !== 'undefined' && window.Html5Qrcode) {
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

      if (typeof window === 'undefined' || !window.Html5Qrcode) {
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
      'URL': LinkIcon,
      'Contact': ContactPage,
      'WiFi': Wifi,
      'Email': Email,
      'Phone': Phone,
      'Text': TextFields
    };
    return icons[type] || TextFields;
  };

  // Don't render anything on server-side
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box className={styles.loadingContainer}>
          <Card className={styles.loadingCard}>
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Box className={styles.loadingIconContainer}>
                  <CircularProgress size={60} thickness={4} />
                  <Box className={styles.loadingIcon}>
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
      <Box className={`${styles.container} ${isMobile ? styles.containerMobile : styles.containerDesktop}`}>
        <Container
          className={`${styles.contentContainer} ${isMobile ? styles.contentContainerMobile : ''}`}
        >
          <Card
            className={`${styles.card} ${isMobile ? styles.cardMobile : styles.cardDesktop}`}
          >
            <CardContent
              className={`${styles.cardContent} ${isMobile ? styles.cardContentMobile : styles.cardContentDesktop}`}
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
                className={`${styles.scannerArea} ${isMobile ? styles.scannerAreaMobile : ''}`}
              >
                <Box
                  id="qr-reader"
                  className={styles.qrReader}
                  sx={{
                    '& video': {
                      className: styles.qrReaderVideo
                    }
                  }}
                />

                {!isScanning && !error && (
                  <Box className={styles.scannerOverlay}>
                    <Stack alignItems="center" spacing={2}>
                      <Paper className={styles.scanIconContainer}>
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
                      <Box className={`${styles.bouncingDot} ${styles.bouncingDot1}`} />
                      <Box className={`${styles.bouncingDot} ${styles.bouncingDot2}`} />
                      <Box className={`${styles.bouncingDot} ${styles.bouncingDot3}`} />
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
                    className={styles.startScanButton}
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
            className: `${styles.dialogPaper} ${theme.palette.mode === 'dark' ? styles.dialogPaperDark : ''} ${isMobile ? styles.dialogPaperMobile : ''}`
          }}
          BackdropProps={{
            className: styles.dialogBackdrop
          }}
        >
          <DialogTitle
            className={`${styles.dialogTitle} ${styles.dialogTitleGlow}`}
          >
            <Stack
              className={styles.dialogTitleContent}
            >
              <Box
                className={styles.successIconContainer}
              >
                <CheckCircle className={styles.successIcon} />
              </Box>
              <Box className={styles.dialogTitleText}>
                <Typography
                  variant="h5"
                  className={styles.dialogTitleHeading}
                >
                  Success!
                </Typography>
                <Typography
                  variant="body1"
                  className={styles.dialogTitleSubheading}
                >
                  QR Code detected successfully
                </Typography>
              </Box>
              <IconButton
                onClick={handleResultClose}
                className={styles.closeButton}
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
                className={styles.resultChip}
                classes={{
                  label: styles.resultChipLabel
                }}
              />

              <Paper
                className={`${styles.resultPaper} ${theme.palette.mode === 'dark' ? styles.resultPaperDark : ''}`}
              >
                <Typography
                  variant="body1"
                  className={`${styles.resultText} ${isMobile ? styles.resultTextMobile : styles.resultTextDesktop}`}
                >
                  {result}
                </Typography>
              </Paper>

              {isURL(result) && (
                <Button
                  variant="contained"
                  startIcon={<LinkIcon />}
                  onClick={() => window.open(result, '_blank')}
                  className={styles.linkButton}
                >
                  Open Link
                </Button>
              )}
            </Stack>
          </DialogContent>

          <DialogActions
            className={styles.dialogActions}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleRescan}
              className={styles.scanAgainButton}
            >
              Scan Again
            </Button>
            <Button
              variant="outlined"
              onClick={handleResultClose}
              className={styles.closeDialogButton}
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