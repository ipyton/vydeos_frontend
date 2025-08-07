import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Button,
  IconButton
} from '@mui/material';
import { useThemeMode } from '../../Themes/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  NavigateNext as NavigateNextIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';

const AboutUs = () => {
  const { mode = 'light' } = useThemeMode() || {};
  const navigate = useNavigate();

  // Team members data
  const teamMembers = [
    {
      name: 'Noah Chen',
      role: 'Founder & CEO',
      bio: 'Noah is a full-stack developer with expertise in building scalable web applications. He founded Vydeo.xyz with the vision of creating a platform that connects people through high-quality video content.',
      avatar: '/images/landing/avatar1.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/noah-chen',
        github: 'https://github.com/noah-chen',
        twitter: 'https://twitter.com/noah_chen'
      }
    },
    {
      name: 'Sarah Miller',
      role: 'Chief Product Officer',
      bio: 'Sarah brings over 10 years of product management experience to the team. She is passionate about creating intuitive user experiences and driving product innovation.',
      avatar: '/images/landing/avatar2.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/sarah-miller',
        github: 'https://github.com/sarah-miller',
        twitter: 'https://twitter.com/sarah_miller'
      }
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Michael leads our engineering team with his extensive background in cloud infrastructure and distributed systems. He ensures our platform is robust, secure, and scalable.',
      avatar: '/images/landing/avatar3.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/michael-chen',
        github: 'https://github.com/michael-chen',
        twitter: 'https://twitter.com/michael_chen'
      }
    }
  ];

  // Company milestones
  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Vydeo.xyz was established with the mission to revolutionize video sharing and social networking.'
    },
    {
      year: '2021',
      title: 'Beta Launch',
      description: 'Our platform was released in beta to a select group of users, gathering valuable feedback for improvements.'
    },
    {
      year: '2022',
      title: 'Public Launch',
      description: 'Vydeo.xyz officially launched to the public, introducing innovative features for content creators and viewers.'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'We expanded our services globally, supporting multiple languages and regional content.'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: mode === 'dark' ? '#121212' : '#f9f9f9',
      pt: '80px', // Space for navbar
      pb: 8
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 4, mt: 2 }}
        >
          <Link 
            color="inherit" 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary">About Us</Typography>
        </Breadcrumbs>

        {/* Hero Section */}
        <Paper 
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
            mb: 4,
            backgroundImage: `linear-gradient(to right, ${mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'}, ${mode === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)'}), url(/images/landing/hero-bg.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: mode === 'dark' ? '#FFFFFF' : '#000000'
            }}>
              About Vydeo.xyz
            </Typography>
            <Typography variant="h6" sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              mb: 4,
              color: mode === 'dark' ? '#CCCCCC' : '#333333'
            }}>
              Connecting people through innovative video sharing and social networking
            </Typography>
          </Box>
        </Paper>

        {/* Our Story */}
        <Paper 
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
            mb: 4
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            Our Story
          </Typography>
          
          <Typography variant="body1" paragraph>
            Vydeo.xyz was born from a simple idea: to create a platform where people could easily share high-quality video content and build meaningful connections. Founded in 2020, our journey began when a group of passionate developers and content creators came together with a shared vision.
          </Typography>
          
          <Typography variant="body1" paragraph>
            We noticed that existing platforms were either too focused on short-form content or too complex for casual users. We wanted to build something that combined the best of both worlds—a platform that was intuitive enough for anyone to use, yet powerful enough for professional content creators.
          </Typography>
          
          <Typography variant="body1" paragraph>
            After months of development and testing, we launched our beta version to a select group of users. Their feedback was invaluable, helping us refine our features and user experience. In 2022, we officially launched Vydeo.xyz to the public, and we've been growing ever since.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Today, Vydeo.xyz is a thriving community of creators and viewers from around the world. We're constantly innovating and improving our platform to provide the best possible experience for our users. Our commitment to quality, privacy, and user satisfaction remains at the core of everything we do.
          </Typography>
        </Paper>

        {/* Our Mission and Values */}
        <Paper 
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
            mb: 4
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            Our Mission & Values
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ color: mode === 'dark' ? '#90CAF9' : '#1976D2' }}>
            Mission
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Our mission is to empower creators and connect communities through innovative video technology. We strive to build a platform where quality content can be shared freely, where creators are fairly rewarded for their work, and where viewers can discover content that resonates with their interests.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ color: mode === 'dark' ? '#90CAF9' : '#1976D2' }}>
            Core Values
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Innovation</Typography>
                <Typography variant="body2">
                  We continuously push the boundaries of what's possible in video sharing and social networking.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Quality</Typography>
                <Typography variant="body2">
                  We prioritize high-quality content and experiences in everything we do.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Community</Typography>
                <Typography variant="body2">
                  We foster a supportive environment where creators and viewers can connect and grow together.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Privacy</Typography>
                <Typography variant="body2">
                  We respect user privacy and are committed to protecting personal data.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Inclusivity</Typography>
                <Typography variant="body2">
                  We welcome diverse perspectives and ensure our platform is accessible to all.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Transparency</Typography>
                <Typography variant="body2">
                  We operate with honesty and openness in all our interactions with users and partners.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Our Team */}
        <Paper 
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
            mb: 4
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Meet Our Team
          </Typography>
          
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={1}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: mode === 'dark' ? '#2A2A2A' : '#FFFFFF',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      src={member.avatar}
                      alt={member.name}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <IconButton size="small" color="primary" component="a" href={member.social.linkedin} target="_blank">
                        <LinkedInIcon />
                      </IconButton>
                      <IconButton size="small" color="primary" component="a" href={member.social.github} target="_blank">
                        <GitHubIcon />
                      </IconButton>
                      <IconButton size="small" color="primary" component="a" href={member.social.twitter} target="_blank">
                        <TwitterIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Company Milestones */}
        <Paper 
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
            mb: 4
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Our Journey
          </Typography>
          
          <Box sx={{ position: 'relative' }}>
            {/* Timeline line */}
            <Box 
              sx={{ 
                position: 'absolute',
                left: { xs: 20, sm: 40 },
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: mode === 'dark' ? '#333333' : '#E0E0E0',
                zIndex: 0
              }} 
            />
            
            {/* Milestones */}
            {milestones.map((milestone, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex',
                  mb: 4,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Box 
                  sx={{
                    width: { xs: 40, sm: 80 },
                    height: { xs: 40, sm: 80 },
                    borderRadius: '50%',
                    bgcolor: mode === 'dark' ? '#2196F3' : '#1976D2',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mr: 3,
                    boxShadow: 3
                  }}
                >
                  <Typography variant="h6">{milestone.year}</Typography>
                </Box>
                <Box sx={{ pt: 1 }}>
                  <Typography variant="h6" gutterBottom>{milestone.title}</Typography>
                  <Typography variant="body1">{milestone.description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Call to Action */}
        <Paper 
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Join Our Community
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
            We're excited to have you join our growing community of creators and viewers. Sign up today to start sharing your content and connecting with others.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ px: 4 }}
            >
              Sign Up
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ px: 4 }}
            >
              Log In
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutUs; 