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
import { useThemeMode } from '../../../Themes/ThemeContext';

const AboutPage = () => {
  // Simplified personal information
    const { showNotification } = useNotification();
    const { mode } = useThemeMode();
  
  const personalInfo = {
    name: "Noah Chen",
    title: "Developer",
    avatarUrl: "https://pub-54727f9e6f694597be444e52fa082e3a.r2.dev/21750044243_.pic.jpg", // Replace with your image
    location: "Melbourne, Australia",
    bio: "Noah Chen is a Melbourne-based full-stack developer with a strong foundation in backend engineering, cloud infrastructure, and data systems. With hands-on experience in building scalable platforms using technologies like Spring Boot, Flask, React, Kafka, Redis, ScyllaDB, and MinIO, he excels at delivering reliable and high-performance applications. He has contributed to projects ranging from community video-sharing platforms to enterprise-grade network tools, demonstrating both versatility and technical depth. Zhiheng combines his academic background in computer science with practical problem-solving skills to build systems that are efficient, maintainable, and user-focused. He is currently seeking opportunities in backend development, full stack engineering, or data engineering.",
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
    
<Container
  maxWidth="md"
  sx={{
    py: 8,
    bgcolor: mode === 'dark' ? '#121212' : '#FFFFFF',
    color: mode === 'dark' ? '#FFFFFF' : '#000000'
  }}
>
  {/* Header Section */}
  <Paper
    elevation={3}
    sx={{
      p: 4,
      mb: 4,
      borderRadius: 2,
      bgcolor: mode === 'dark' ? '#1E1E1E' : '#FAFAFA',
      color: mode === 'dark' ? '#FFFFFF' : '#000000'
    }}
  >
    <Box display="flex" flexDirection={{ xs:  'column', sm: 'row' }} alignItems="center" mb={3}>
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
        <Typography variant="h6" sx={{ color: mode === 'dark' ? '#BB86FC' : '#6200EE' }} gutterBottom>
          {personalInfo.title}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <LocationIcon fontSize="small" sx={{ color: mode === 'dark' ? '#90CAF9' : '#1976D2', mr: 1 }} />
          <Typography variant="body2" sx={{ color: mode === 'dark' ? '#B0B0B0' : '#555555' }}>
            {personalInfo.location}
          </Typography>
        </Box>
      </Box>
    </Box>

    <Divider sx={{ my: 3, bgcolor: mode === 'dark' ? '#2C2C2C' : '#E0E0E0' }} />

    <Typography variant="h6" component="h2" gutterBottom>
      About Me
    </Typography>
    <Typography variant="body1" paragraph>
      {personalInfo.bio}
    </Typography>
  </Paper>

  {/* Skills Section */}
  <Paper
    elevation={3}
    sx={{
      p: 4,
      mb: 4,
      borderRadius: 2,
      bgcolor: mode === 'dark' ? '#1E1E1E' : '#FAFAFA',
      color: mode === 'dark' ? '#FFFFFF' : '#000000'
    }}
  >
    <Box display="flex" alignItems="center" mb={2}>
      <SkillsIcon sx={{ color: mode === 'dark' ? '#90CAF9' : '#1976D2', mr: 1 }} />
      <Typography variant="h6" component="h2">
        Skills
      </Typography>
    </Box>
    <Grid container spacing={1}>
      {personalInfo.skills.map((skill, index) => (
        <Grid item key={index}>
          <Chip
            label={skill}
            sx={{
              bgcolor: mode === 'dark' ? '#333333' : '#E0E0E0',
              color: mode === 'dark' ? '#FFFFFF' : '#000000'
            }}
          />
        </Grid>
      ))}
    </Grid>
  </Paper>

  {/* Special Thanks Section */}
  <Paper
    elevation={3}
    sx={{
      p: 4,
      borderRadius: 2,
      bgcolor: mode === 'dark' ? '#1E1E1E' : '#FAFAFA',
      color: mode === 'dark' ? '#FFFFFF' : '#000000'
    }}
  >
    <Box display="flex" alignItems="center" mb={3}>
      <FavoriteIcon sx={{ color: mode === 'dark' ? '#90CAF9' : '#1976D2', mr: 1 }} />
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
              bgcolor: mode === 'dark' ? '#121212' : '#FFFFFF',
              color: mode === 'dark' ? '#FFFFFF' : '#000000',
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