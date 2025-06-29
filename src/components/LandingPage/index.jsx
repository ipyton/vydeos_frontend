import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import { 
  ArrowForward, 
  Chat, 
  Group, 
  VideoLibrary, 
  Security, 
  Speed,
  Menu as MenuIcon
} from '@mui/icons-material';

// If we have a theme context, we can use it
import { useThemeMode } from '../../Themes/ThemeContext';
import GlobeAnimation from './GlobeAnimation';

// Styles for the landing page
const styles = {
  heroSection: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  glassCard: (mode) => ({
    backgroundColor: mode === 'dark' 
      ? 'rgba(18, 18, 18, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '2rem',
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
  
  // Use theme context if available, otherwise fallback to light mode
  const { mode = 'light' } = useThemeMode() || {};
  
  // Animation states
  const [showHero, setShowHero] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);

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
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    navigate('/about');
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
              <Box component="span" sx={{ color: '#2196F3' }}>B</Box>log
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Navigation Buttons */}
            <Box sx={{ display: { xs: isMobile ? 'none' : 'flex' } }}>
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
            {isMobile && (
              <IconButton 
                color="primary"
                aria-label="menu"
                onClick={() => {}}
                sx={{ display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Hero Section */}
      <Fade in={showHero} timeout={1000}>
        <Box
          sx={{
            ...styles.heroSection,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url(/images/landing/hero-bg.jpg)`,
          }}
        >
          <Container>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h2" gutterBottom sx={{ 
                    color: 'white', 
                    fontWeight: 700,
                    fontSize: isMobile ? '2.5rem' : '3.5rem',
                    lineHeight: 1.2,
                    marginTop: { xs: '80px', md: 0 }
                  }}>
                    Connect. Create. <span style={styles.gradientText}>Share.</span>
                  </Typography>
                  <Typography variant="h5" paragraph sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '2rem',
                    maxWidth: '600px'
                  }}>
                    The all-in-one platform for social networking, content sharing, and real-time communication.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                    <Button 
                      variant="contained" 
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={styles.primaryButton(mode)}
                      onClick={handleGetStarted}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined"
                      size="large"
                      sx={styles.outlineButton(mode)}
                      onClick={handleLearnMore}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
                {/* 3D Globe Animation */}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '400px',
                    height: '400px',
                    position: 'relative',
                    marginTop: '2rem',
                    className: 'globe-float'
                  }}
                  className="globe-float"
                >
                  <GlobeAnimation size={400} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>

      {/* Features Section */}
      <Slide direction="up" in={showFeatures} timeout={1000}>
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: mode === 'dark' ? '#121212' : '#f9f9f9' }}>
          <Container>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={styles.sectionTitle}
            >
              Key Features
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
            >
              Discover what makes our platform stand out from the crowd
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card 
                    elevation={0}
                    sx={styles.featureCard(mode)}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Box sx={styles.iconStyle(mode)}>
                        {feature.icon}
                      </Box>
                      <Typography gutterBottom variant="h5" component="h2">
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
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
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={styles.sectionTitle}
            >
              App Screenshots
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
            >
              Take a visual tour of our sleek and intuitive interface
            </Typography>
            
            <Box sx={{ position: 'relative', my: 4 }}>
              <Grid container spacing={2}>
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
                      src="/images/landing/screenshot1.jpg"
                      alt="Chat interface"
                      sx={{ width: '100%', height: 'auto', display: 'block' }}
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
                      src="/images/landing/screenshot2.jpg"
                      alt="Feed interface"
                      sx={{ width: '100%', height: 'auto', display: 'block' }}
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
                      src="/images/landing/screenshot3.jpg"
                      alt="Profile interface"
                      sx={{ width: '100%', height: 'auto', display: 'block' }}
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
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: mode === 'dark' ? '#121212' : '#f9f9f9' }}>
          <Container>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={styles.sectionTitle}
            >
              What People Say
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
            >
              Hear from our satisfied users about their experiences
            </Typography>
            
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card 
                    elevation={0}
                    sx={styles.testimonialCard(mode)}
                  >
                    <CardContent>
                      <Typography variant="body1" paragraph sx={{ 
                        fontStyle: 'italic',
                        mb: 3 
                      }}>
                        "{testimonial.comment}"
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
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
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container>
          <Paper 
            elevation={0}
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              py: { xs: 5, md: 8 },
              px: { xs: 3, md: 6 },
            }}
          >
            <Grid container alignItems="center" spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 700,
                    fontSize: isMobile ? '1.8rem' : '2.5rem'
                  }}
                >
                  Ready to get started?
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    mt: 2
                  }}
                >
                  Join thousands of users already enjoying our platform. Sign up today!
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button 
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem',
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