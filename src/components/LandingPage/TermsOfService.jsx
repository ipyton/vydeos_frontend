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

const TermsOfService = () => {
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
          <Typography color="text.primary">Terms of Service</Typography>
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
            Terms of Service
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="body1" paragraph>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Vydeo.xyz website (the "Service") operated by Vydeo.xyz ("us", "we", or "our").
          </Typography>
          <Typography variant="body1" paragraph>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            1. Accounts
          </Typography>
          <Typography variant="body1" paragraph>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </Typography>
          <Typography variant="body1" paragraph>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            2. Content
          </Typography>
          <Typography variant="body1" paragraph>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
          </Typography>
          <Typography variant="body1" paragraph>
            By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to terminate the account of any user found to be infringing on a copyright.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            3. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Vydeo.xyz and its licensors. The Service is protected by copyright, trademark, and other laws of both the Australia and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Vydeo.xyz.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            4. Links To Other Web Sites
          </Typography>
          <Typography variant="body1" paragraph>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by Vydeo.xyz.
          </Typography>
          <Typography variant="body1" paragraph>
            Vydeo.xyz has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that Vydeo.xyz shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such web sites or services.
          </Typography>
          <Typography variant="body1" paragraph>
            We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            5. Termination
          </Typography>
          <Typography variant="body1" paragraph>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </Typography>
          <Typography variant="body1" paragraph>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            6. Limitation Of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            In no event shall Vydeo.xyz, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            7. Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </Typography>
          <Typography variant="body1" paragraph>
            Vydeo.xyz, its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            8. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms shall be governed and construed in accordance with the laws of Australia, without regard to its conflict of law provisions.
          </Typography>
          <Typography variant="body1" paragraph>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            9. Changes
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </Typography>
          <Typography variant="body1" paragraph>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            10. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms, please contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            Email: legal@vydeo.xyz
          </Typography>
          <Typography variant="body1" paragraph>
            Address: 123 Tech Street, Melbourne, VIC 3000, Australia
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService; 