import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useThemeMode } from '../../Themes/ThemeContext';

function Copyright() {
  const { mode } = useThemeMode(); // Access the theme mode
  
  return (
    <Typography 
      variant="body2" 
      color={mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'} 
      align="center"
    >
      {'Copyright © '}
      <Link 
        color={mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'inherit'} 
        href="https://github.com/ipyton/blog"
      >
        Vydeo 0.0.0-0.0.0 Alpha
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Footer(props) {
  const { description, title } = props;
  const { mode } = useThemeMode(); // Access the theme mode

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'background.paper',
        color: mode === 'dark' ? '#ffffff' : 'inherit',
        py: 1,
        borderTop: 1, 
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        position: 'fixed', // Fix the position to the viewport
        bottom: 0, // Stick to the bottom
        left: 0, // Align to the left edge
        width: '100%', // Take full width
        zIndex: 1000, // Ensure it stays above other content
      }}
    >
      <Container maxWidth="lg">
        <Copyright />
      </Container>
    </Box>
  );
}

Footer.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Footer;