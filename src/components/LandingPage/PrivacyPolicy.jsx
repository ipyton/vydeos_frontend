import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Breadcrumbs,
  Link
} from '@mui/material';
import { useThemeMode } from '../../Themes/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const PrivacyPolicy = () => {
  const { mode = 'light' } = useThemeMode() || {};
  const navigate = useNavigate();

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
          <Typography color="text.primary">Privacy Policy</Typography>
        </Breadcrumbs>

        <Paper 
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
            mb: 4
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
            Privacy Policy
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="body1" paragraph>
            At Vydeo.xyz, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, participate in activities on the website, or otherwise contact us.
          </Typography>
          <Typography variant="body1" paragraph>
            The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use. The personal information we collect may include:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">Name and contact data (such as email address, phone number)</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">Credentials (such as passwords, password hints, and similar security information)</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">Profile data (such as username, profile picture, interests, preferences)</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">Payment data (such as billing address and payment method details)</Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use personal information collected via our website for a variety of business purposes described below:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">To provide and maintain our services</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">To manage your account and provide you with customer support</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">To process transactions and send related information including confirmations and invoices</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">To send administrative information to you</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">To send you marketing and promotional communications</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">To respond to your inquiries and solve any potential issues you might have</Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            3. Sharing Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </Typography>
          <Typography variant="body1" paragraph>
            We may also disclose your information:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li">
              <Typography variant="body1">To comply with any court order, law, or legal process, including to respond to any government or regulatory request</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">To enforce or apply our terms of use and other agreements</Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of our company, our customers, or others</Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            4. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls.
          </Typography>
          <Typography variant="body1" paragraph>
            The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our website, you are responsible for keeping this password confidential. We ask you not to share your password with anyone.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            5. Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" paragraph>
            We may use cookies and similar tracking technologies to track the activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            6. Third-Party Websites
          </Typography>
          <Typography variant="body1" paragraph>
            Our website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            7. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            8. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
          </Typography>
          <Typography variant="body1" paragraph>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            9. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            Email: privacy@vydeo.xyz
          </Typography>
          <Typography variant="body1" paragraph>
            Address: 123 Tech Street, Melbourne, VIC 3000, Australia
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy; 