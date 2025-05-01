import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Avatar, 
  Divider, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Email as EmailIcon, 
  LinkedIn as LinkedInIcon, 
  GitHub as GitHubIcon, 
  LocationOn as LocationIcon,
  Code as SkillsIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { useNotification } from '../../../Providers/NotificationProvider';

const AboutPage = () => {
  // Simplified personal information
    const { showNotification } = useNotification();
  
  const personalInfo = {
    name: "Your Name",
    title: "Frontend Developer",
    avatarUrl: "https://via.placeholder.com/150", // Replace with your image
    location: "City, Country",
    bio: "Frontend developer passionate about building intuitive user interfaces and accessible web applications. I enjoy working with modern JavaScript frameworks and learning new technologies.",
    skills: ["React", "JavaScript", "Material UI", "HTML/CSS", "Redux"],
    social: {
      linkedin: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourusername"
    },
    // Special thanks section
    specialThanks: [
      {
        name: "The React Team",
        contribution: "For creating an amazing library that makes UI development enjoyable"
      },
      {
        name: "Material UI Contributors",
        contribution: "For the incredible component library that powers this site"
      },
      {
        name: "My Mentors",
        contribution: "For their guidance and support throughout my journey"
      },
      {
        name: "Open Source Community",
        contribution: "For sharing knowledge and resources freely"
      }
    ]
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" mb={3}>
          <Avatar 
            src={personalInfo.avatarUrl}
            alt={personalInfo.name}
            sx={{ 
              width: 150, 
              height: 150, 
              mr: { xs: 0, sm: 4 },
              mb: { xs: 2, sm: 0 }
            }}
          />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {personalInfo.name}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {personalInfo.title}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {personalInfo.location}
              </Typography>
            </Box>
            <Box display="flex" mt={2}>
              <IconButton 
                color="primary" 
                aria-label="LinkedIn profile"
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                aria-label="GitHub profile"
                href={personalInfo.social.github}
                target="_blank" 
                rel="noopener"
              >
                <GitHubIcon />
              </IconButton>
              <Button 
                variant="outlined" 
                startIcon={<EmailIcon />}
                href="#contact"
                sx={{ ml: 1 }}
              >
                Contact
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" component="h2" gutterBottom>
          About Me
        </Typography>
        <Typography variant="body1" paragraph>
          {personalInfo.bio}
        </Typography>
      </Paper>

      {/* Skills Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <SkillsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Skills
          </Typography>
        </Box>
        <Grid container spacing={1}>
          {personalInfo.skills.map((skill, index) => (
            <Grid item key={index}>
              <Chip
                label={skill}
                color="primary"
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Special Thanks Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <FavoriteIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Special Thanks
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {personalInfo.specialThanks.map((thanks, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  bgcolor: 'background.default',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {thanks.name}
                </Typography>
                <Typography variant="body2">
                  {thanks.contribution}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={4}>
          <Typography variant="body1" fontStyle="italic">
            "Thank you to everyone who has been part of this journey. Your support and encouragement make all the difference."
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;