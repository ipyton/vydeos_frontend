import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Fade,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  SwipeableDrawer
} from '@mui/material';
import { 
  ArrowForward, 
  Chat, 
  Group, 
  VideoLibrary, 
  Security, 
  Speed,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// If we have a theme context, we can use it
import { useThemeMode } from '../../Themes/ThemeContext';
//import GlobeAnimation from './GlobeAnimation';
import Globe from 'react-globe.gl';

const arcsData = [
    {
      startLat: 37.7749, startLng: -122.4194,  // 旧金山
      endLat: 48.8566, endLng: 2.3522,         // 巴黎
      color: ["red", "orange"]
    },
    {
      startLat: 48.8566, startLng: 2.3522,     // 巴黎
      endLat: 35.6895, endLng: 139.6917,       // 东京
      color: ["blue", "cyan"]
    },
    {
      startLat: 35.6895, startLng: 139.6917,   // 东京
      endLat: -33.8688, endLng: 151.2093,      // 悉尼
      color: ["green", "lime"]
    }
  ];

  
// Styles for the landing page
const styles = {
  heroSection: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: { xs: '80px', md: '0' }
  },
  glassCard: (mode) => ({
    backgroundColor: mode === 'dark' 
      ? 'rgba(18, 18, 18, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: { xs: '1.5rem', md: '2rem' },
    boxShadow: mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
  }),
  featureCard: (mode) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    transition: 'transform 0.3s ease-in-out',
    backgroundColor: mode === 'dark' 
      ? 'rgba(30, 30, 30, 0.8)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: mode === 'dark'
        ? '0 12px 40px rgba(0, 0, 0, 0.4)'
        : '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
  }),
  iconStyle: (mode) => ({
    fontSize: '3rem',
    marginBottom: '1rem',
    color: mode === 'dark' ? '#90caf9' : '#1976d2',
  }),
  testimonialCard: (mode) => ({
    height: '100%',
    padding: '1.5rem',
    backgroundColor: mode === 'dark' 
      ? 'rgba(30, 30, 30, 0.8)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
  }),
  primaryButton: (mode) => ({
    backgroundColor: mode === 'dark' ? '#90caf9' : '#1976d2',
    color: mode === 'dark' ? '#121212' : 'white',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '28px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: mode === 'dark' ? '#bbdefb' : '#115293',
    },
  }),
  outlineButton: (mode) => ({
    borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
    color: mode === 'dark' ? '#90caf9' : '#1976d2',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '28px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)',
    },
  }),
  gradientText: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sectionTitle: {
    position: 'relative',
    marginBottom: '2rem',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '4px',
      borderRadius: '2px',
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    },
  },
  mobileDrawer: (mode) => ({
    '& .MuiDrawer-paper': {
      width: '85%',
      maxWidth: '300px',
      backgroundColor: mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '1rem',
    }
  }),
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
  },
  drawerItem: (mode) => ({
    borderRadius: '8px',
    margin: '0.5rem 0',
    '&:hover': {
      backgroundColor: mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)',
    }
  }),
};

// Add navbar styles
const navbarStyles = {
  navbar: (mode) => ({
    background: mode === 'dark' 
      ? 'rgba(18, 18, 18, 0.8)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: mode === 'dark'
      ? '0 4px 20px rgba(0, 0, 0, 0.5)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
  }),
  logo: {
    fontWeight: 700,
    color: '#1976d2',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
  },
  navButton: (mode) => ({
    marginLeft: 2,
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: mode === 'dark' 
        ? '0 4px 12px rgba(144, 202, 249, 0.3)'
        : '0 4px 12px rgba(25, 118, 210, 0.3)',
    }
  }),
};

// Placeholder data
const features = [
  {
    title: "Social Networking",
    description: "Connect with friends, share updates, and build your personal network with our intuitive social features.",
    icon: <Group />
  },
  {
    title: "Real-time Chat",
    description: "Engage in seamless conversations with individuals or groups through our lightning-fast messaging system.",
    icon: <Chat />
  },
  {
    title: "Video Streaming",
    description: "Enjoy high-quality video content with our adaptive streaming technology that works across all devices.",
    icon: <VideoLibrary />
  },
  {
    title: "Enterprise Security",
    description: "Your data is protected with industry-leading encryption and privacy controls that keep you safe online.",
    icon: <Security />
  },
];

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Software Developer",
    comment: "This platform has transformed how our team collaborates. The UI is intuitive and the features are exactly what we needed.",
    avatar: "/images/landing/avatar1.jpg"
  },
  {
    name: "Sarah Miller",
    role: "Content Creator",
    comment: "As a content creator, I've tried many platforms, but this one stands out with its powerful tools and sleek design.",
    avatar: "/images/landing/avatar2.jpg"
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    comment: "The analytics and user management features have helped us understand our audience better and improve our product strategy.",
    avatar: "/images/landing/avatar3.jpg"
  },
];

// Main component
const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const globeRef = useRef();
  
  // Use theme context if available, otherwise fallback to light mode
  const { mode = 'light' } = useThemeMode() || {};
  
  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  // Animation states
  const [showHero, setShowHero] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);

  // Auto-rotate globe
  useEffect(() => {
    let frameId;
    
    const rotateGlobe = () => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.5;
        
        // Make sure controls are updated
        globeRef.current.controls().update();
      }
      frameId = requestAnimationFrame(rotateGlobe);
    };
    
    // Start rotation
    rotateGlobe();
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Animation on page load
  useEffect(() => {
    setShowHero(true);
    
    const featuresTimer = setTimeout(() => setShowFeatures(true), 400);
    const screenshotsTimer = setTimeout(() => setShowScreenshots(true), 600);
    const testimonialsTimer = setTimeout(() => setShowTestimonials(true), 800);
    
    return () => {
      clearTimeout(featuresTimer);
      clearTimeout(screenshotsTimer);
      clearTimeout(testimonialsTimer);
    };
  }, []);

  const handleLogin = () => {
    navigate('/login');
    setMobileDrawerOpen(false);
  };

  const handleRegister = () => {
    navigate('/signup');
    setMobileDrawerOpen(false);
  };

  const handleGetStarted = () => {
    navigate('/login');
    setMobileDrawerOpen(false);
  };

  const handleLearnMore = () => {
    navigate('/about');
    setMobileDrawerOpen(false);
  };

  const toggleMobileDrawer = (open) => () => {
    setMobileDrawerOpen(open);
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={navbarStyles.navbar(mode)}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo */}
            <Typography variant="h5" sx={navbarStyles.logo}>
              <Box component="span" sx={{ color: '#2196F3' }}>Vydeo</Box>.xyz
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Navigation Buttons - Hide on mobile */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Button 
                variant="text" 
                color="primary"
                sx={navbarStyles.navButton(mode)}
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                sx={{
                  ...navbarStyles.navButton(mode),
                  color: mode === 'dark' ? '#121212' : 'white',
                }}
                onClick={handleRegister}
              >
                Register
              </Button>
            </Box>
            
            {/* Mobile Menu Button */}
            <IconButton 
              color="primary"
              aria-label="menu"
              onClick={toggleMobileDrawer(true)}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile Navigation Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer(false)}
        onOpen={toggleMobileDrawer(true)}
        sx={styles.mobileDrawer(mode)}
        disableBackdropTransition={!isMobile}
        disableDiscovery={isMobile}
      >
        <Box sx={styles.drawerHeader}>
          <Typography variant="h6" sx={navbarStyles.logo}>
            <Box component="span" sx={{ color: '#2196F3' }}>Vydeo</Box>.xyz
          </Typography>
          <IconButton onClick={toggleMobileDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              sx={styles.drawerItem(mode)}
              onClick={handleLogin}
            >
              <ListItemText primary="Log in" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              sx={{
                ...styles.drawerItem(mode),
                backgroundColor: '#1976d2',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1565c0',
                }
              }}
              onClick={handleRegister}
            >
              <ListItemText primary="Register" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              sx={styles.drawerItem(mode)}
              onClick={handleLearnMore}
            >
              <ListItemText primary="Learn More" />
            </ListItemButton>
          </ListItem>
        </List>
      </SwipeableDrawer>
      
      {/* Hero Section */}
      <Fade in={showHero} timeout={1000}>
        <Box
          sx={{
            ...styles.heroSection,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url(/images/landing/hero-bg.jpg)`,
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 4, md: 0 } }}>
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ pt: { xs: 0, md: 0 } }}>
                  <Typography variant="h2" gutterBottom sx={{ 
                    color: 'white', 
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                    marginTop: { xs: '0', md: 0 }
                  }}>
                    Connect. Create. <span style={styles.gradientText}>Share.</span>
                  </Typography>
                  <Typography variant="h5" paragraph sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '2rem',
                    maxWidth: '600px',
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                  }}>
                    The all-in-one platform for social networking, content sharing, and real-time communication.
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexDirection: { xs: 'column', sm: 'row' },
                    '& .MuiButton-root': {
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: 'center'
                    }
                  }}>
                    <Button 
                      variant="contained" 
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        ...styles.primaryButton(mode),
                        py: { xs: 1.5, md: 1.2 },
                        fontSize: { xs: '1rem', md: '1rem' }
                      }}
                      onClick={handleGetStarted}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined"
                      size="large"
                      sx={{
                        ...styles.outlineButton(mode),
                        py: { xs: 1.5, md: 1.2 },
                        fontSize: { xs: '1rem', md: '1rem' }
                      }}
                      onClick={handleLearnMore}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                {/* 3D Globe Animation - Responsive for all devices */}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: { xs: '350px', sm: '500px', md: '700px' },
                    height: { xs: '350px', sm: '500px', md: '700px' },
                    position: 'relative',
                    marginTop: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& > div': { width: '100%', height: '100%' }
                  }}
                  className="globe-float"
                >
                  <Globe
                    ref={globeRef}
                    width={isMobile ? 350 : isTablet ? 500 : 700}
                    height={isMobile ? 350 : isTablet ? 500 : 700}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    arcsData={arcsData}
                    arcColor={"color"}
                    arcStroke={0.5}
                    arcAltitude={0.2}
                    arcDashLength={0.4}
                    arcDashGap={0.2}
                    arcDashAnimateTime={4000}
                    atmosphereColor="#1976d2"
                    atmosphereAltitude={0.15}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>

      {/* Features Section */}
      <Slide direction="up" in={showFeatures} timeout={1000}>
        <Box sx={{ py: { xs: 6, md: 12 }, bgcolor: mode === 'dark' ? '#121212' : '#f9f9f9' }}>
          <Container>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ 
                ...styles.sectionTitle,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
              }}
            >
              Key Features
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ 
                mb: { xs: 4, md: 6 }, 
                maxWidth: '800px', 
                mx: 'auto',
                px: 2,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Discover what makes our platform stand out from the crowd
            </Typography>
            
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card 
                    elevation={0}
                    sx={{
                      ...styles.featureCard(mode),
                      height: '100%',
                      padding: { xs: '1rem', md: '1.5rem' }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: { xs: 1, md: 2 } }}>
                      <Box sx={{
                        ...styles.iconStyle(mode),
                        fontSize: { xs: '2.5rem', md: '3rem' }
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography gutterBottom variant="h5" component="h2" sx={{
                        fontSize: { xs: '1.3rem', md: '1.5rem' }
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Slide>

      {/* Screenshots Section */}
      <Slide direction="up" in={showScreenshots} timeout={1000}>
        <Box sx={{ py: { xs: 6, md: 12 } }}>
          <Container>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ 
                ...styles.sectionTitle,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
              }}
            >
              App Screenshots
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ 
                mb: { xs: 4, md: 6 }, 
                maxWidth: '800px', 
                mx: 'auto',
                px: 2,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Take a visual tour of our sleek and intuitive interface
            </Typography>
            
            <Box sx={{ position: 'relative', my: { xs: 2, md: 4 } }}>
              <Grid container spacing={{ xs: 2, md: 2 }}>
                {/* Make screenshots stack vertically on mobile for better visibility */}
                <Grid item xs={12} sm={4}>
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.03)' },
                      mb: { xs: 2, sm: 0 }
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/landing/screenshot1.png"
                      alt="Chat interface"
                      sx={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                        maxHeight: { xs: '300px', sm: 'none' },
                        objectFit: 'cover'
                      }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.03)' },
                      mb: { xs: 2, sm: 0 }
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/landing/screenshot2.png"
                      alt="Feed interface"
                      sx={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                        maxHeight: { xs: '300px', sm: 'none' },
                        objectFit: 'cover'
                      }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.03)' }
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/landing/screenshot3.png"
                      alt="Profile interface"
                      sx={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                        maxHeight: { xs: '300px', sm: 'none' },
                        objectFit: 'cover'
                      }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.03)' }
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/landing/screenshot4.png"
                      alt="Profile interface"
                      sx={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                        maxHeight: { xs: '300px', sm: 'none' },
                        objectFit: 'cover'
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Slide>

      {/* Testimonials Section */}
      <Slide direction="up" in={showTestimonials} timeout={1000}>
        <Box sx={{ py: { xs: 6, md: 12 }, bgcolor: mode === 'dark' ? '#121212' : '#f9f9f9' }}>
          <Container>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ 
                ...styles.sectionTitle,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
              }}
            >
              What People Say
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ 
                mb: { xs: 4, md: 6 }, 
                maxWidth: '800px', 
                mx: 'auto',
                px: 2,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Hear from our satisfied users about their experiences
            </Typography>
            
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    elevation={0}
                    sx={{
                      ...styles.testimonialCard(mode),
                      height: '100%',
                      padding: { xs: '1rem', md: '1.5rem' }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                      <Typography variant="body1" paragraph sx={{ 
                        fontStyle: 'italic',
                        mb: 3,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}>
                        "{testimonial.comment}"
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          sx={{ 
                            width: { xs: 48, md: 56 }, 
                            height: { xs: 48, md: 56 }, 
                            mr: 2 
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.95rem', md: '1.1rem' }
                          }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                          }}>
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Slide>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 4, md: 10 } }}>
        <Container>
          <Paper 
            elevation={0}
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              py: { xs: 4, md: 8 },
              px: { xs: 2, md: 6 },
            }}
          >
            <Grid container alignItems="center" spacing={{ xs: 2, md: 4 }}>
              <Grid item xs={12} md={8}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Ready to get started?
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    mt: 2,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Join thousands of users already enjoying our platform. Sign up today!
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Button 
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.2, md: 1.5 },
                    fontWeight: 'bold',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  Get Started Now
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 