const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const glob = require('glob');
const mdToPdf = require('md-to-pdf');
const { execSync } = require('child_process');
const SVGtoPDF = require('svg-to-pdfkit');

// Create docs directory if it doesn't exist
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Create diagrams directory if it doesn't exist
const diagramsDir = path.join(docsDir, 'diagrams');
if (!fs.existsSync(diagramsDir)) {
  fs.mkdirSync(diagramsDir, { recursive: true });
}

// Documentation metadata
const projectName = 'React Web Application';
const version = require('./package.json').version;
const author = require('./package.json').author || 'Project Team';

// Helper function to create a PDF document
async function createPdf(title, fileName, contentGenerator) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: title,
        Author: author,
        Subject: `${title} - Documentation`,
        Keywords: 'documentation, react, web application',
        CreationDate: new Date(),
      }
    });

    const outputPath = path.join(docsDir, fileName);
    const stream = fs.createWriteStream(outputPath);
    
    doc.pipe(stream);

    // Add title
    doc.fontSize(24).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text(`Version: ${version}`, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Add content
    doc.fontSize(12).font('Helvetica');
    contentGenerator(doc);

    // Finalize the PDF
    doc.end();

    stream.on('finish', () => {
      console.log(`Created ${outputPath}`);
      resolve(outputPath);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

// Helper function to add SVG to PDF
function addSvgToPdf(doc, svgPath, options = {}) {
  const defaultOptions = { 
    width: 500, 
    height: 400,
    preserveAspectRatio: true,
    align: 'center'
  };
  
  const svgOptions = { ...defaultOptions, ...options };
  
  try {
    if (fs.existsSync(svgPath)) {
      const svg = fs.readFileSync(svgPath, 'utf8');
      SVGtoPDF(doc, svg, doc.page.margins.left, doc.y, svgOptions);
      doc.moveDown(2);
      return true;
    } else {
      console.warn(`SVG file not found: ${svgPath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error adding SVG to PDF: ${error.message}`);
    return false;
  }
}

// First generate diagrams
require('./architecture-diagram');

// Function to generate project overview document
async function generateProjectOverview() {
  await createPdf('Project Overview', 'project-overview.pdf', (doc) => {
    doc.fontSize(16).font('Helvetica-Bold').text('Introduction', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'This document provides an overview of Vydeo, a feature-rich React-based social video platform. The application allows users to share and consume video content, chat with friends, and engage with a community of content creators. Built on React 18 with Material UI components, the application delivers a responsive and modern user experience on all devices.',
      { align: 'justify' }
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Project Architecture', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application follows a modular component-based architecture built with React 18 and uses Redux Toolkit for state management. It implements a single-page application (SPA) model with client-side routing via React Router v6. The application communicates with multiple backend services (Java and Python) via RESTful APIs and uses WebSockets for real-time features such as chat and notifications.',
      { align: 'justify' }
    );
    doc.moveDown();

    // Add architecture diagram
    doc.text('Architecture Diagram:', { align: 'center' });
    doc.moveDown(0.5);
    addSvgToPdf(doc, path.join(diagramsDir, 'architecture-diagram.svg'));

    doc.fontSize(16).font('Helvetica-Bold').text('Key Features', { underline: true });
    doc.fontSize(12).font('Helvetica');
    doc.list([
      'Secure JWT-based authentication with token refresh mechanism',
      'Real-time chat with message history, WebSocket notifications, and online status indicators',
      'Video content management with support for uploads, playback, and comments',
      'Social features including friends list, activity feeds, and user profiles',
      'Advanced search capabilities with instant results and filters',
      'Theme switching between light and dark modes with persistent user preferences',
      'QR code scanning functionality for quick connections',
      'Role-based access control for administrative features',
      'Offline data persistence using LocalForage and IndexedDB',
      'Push notifications support through service workers',
      'Mobile-responsive design optimized for all screen sizes'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Technology Stack', { underline: true });
    doc.fontSize(12).font('Helvetica');
    doc.list([
      'Frontend Framework: React 18 with functional components and hooks',
      'State Management: Redux Toolkit for global state and React Context for UI state',
      'UI Components: Material UI 5.x with custom theme implementation',
      'Routing: React Router v6 with protected routes',
      'API Communication: Axios with interceptors for token management',
      'Real-time Communication: WebSocket for live chat and notifications',
      'Data Storage: LocalForage for client-side persistence with IndexedDB',
      'Authentication: JWT-based auth with secure token storage',
      'Offline Support: Service workers for background tasks and offline functionality',
      'Media Handling: Custom utilities for image compression and video processing',
      'Form Handling: Material UI form components with custom validation'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(16).font('Helvetica-Bold').text('Backend Integration', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application integrates with multiple backend services:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Java API (https://apis.vydeo.xyz/java): Primary backend for core functionality',
      'Python API (https://apis.vydeo.xyz/py): Specialized services for data processing and AI features',
      'WebSocket Server (wss://apis.vydeo.xyz/ws): Real-time communication for chat and notifications',
      'Download Service: Dedicated service for handling large file downloads'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(16).font('Helvetica-Bold').text('Target Audience', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application is designed for content creators, social media users, and video enthusiasts:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Content creators who want to share videos and build a following',
      'Users seeking to discover and engage with video content',
      'Social media users looking for real-time interaction with friends',
      'Communities centered around specific video content categories'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(16).font('Helvetica-Bold').text('Application Modules', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application is organized into several key functional modules:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Authentication: User registration, login, and account management',
      'Video Platform: Video browsing, playback, and interaction',
      'Social Network: Friend management, activities, and profile features',
      'Messaging: Real-time chat with individuals and groups',
      'Content Management: Upload, edit, and manage video content',
      'Search: Advanced search capabilities across all content types',
      'Settings: User preferences and application configuration',
      'Admin Tools: User management and system administration'
    ], { bulletRadius: 2, textIndent: 20 });
  });
}

// Function to generate API documentation
async function generateApiDocumentation() {
  await createPdf('API Documentation', 'api-documentation.pdf', (doc) => {
    doc.fontSize(16).font('Helvetica-Bold').text('API Overview', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'This document provides detailed specifications for the RESTful API endpoints used by the Blog Web Application. The API is hosted at https://api.blogapp.com/v1 and uses JWT authentication with rate limiting of 100 requests per minute per user.',
      { align: 'justify' }
    );
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('API Standards');
    doc.fontSize(12).font('Helvetica').text(
      'All API responses follow a standard format with appropriate HTTP status codes:',
      { align: 'justify' }
    );
    doc.fontSize(11).font('Courier').text(
      '{\n' +
      '  "code": 200, // HTTP status code\n' +
      '  "success": true, // boolean indicating success\n' +
      '  "message": "Operation successful", // human-readable message\n' +
      '  "data": {}, // response payload\n' +
      '  "timestamp": "2023-07-15T12:34:56Z" // ISO timestamp\n' +
      '}'
    );
    doc.moveDown();

    // Document authentication endpoints
    doc.fontSize(14).font('Helvetica-Bold').text('Authentication Endpoints');
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Login');
    doc.fontSize(11).font('Helvetica').text('Endpoint: /auth/login');
    doc.text('Method: POST');
    doc.text('Description: Authenticates a user and returns a JWT token with 24-hour validity');
    doc.text('Rate Limit: 10 attempts per minute per IP');
    doc.text('Request Body: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "username": "string", // Email or username\n' +
      '  "password": "string", // Min 8 characters\n' +
      '  "rememberMe": boolean, // Optional, default: false\n' +
      '  "deviceInfo": { // Device information for security\n' +
      '    "deviceId": "string",\n' +
      '    "platform": "string",\n' +
      '    "browserName": "string"\n' +
      '  }\n' +
      '}'
    );
    doc.fontSize(11).font('Helvetica').text('Response: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "code": 200,\n' +
      '  "success": true,\n' +
      '  "message": "Login successful",\n' +
      '  "data": {\n' +
      '    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n' +
      '    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n' +
      '    "expiresIn": 86400,\n' +
      '    "userId": "u123456789",\n' +
      '    "userRole": "user",\n' +
      '    "firstName": "John",\n' +
      '    "lastName": "Doe",\n' +
      '    "profileImage": "https://cdn.blogapp.com/profiles/john-doe.jpg"\n' +
      '  }\n' +
      '}'
    );
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Sign Up');
    doc.fontSize(11).font('Helvetica').text('Endpoint: /auth/signup');
    doc.text('Method: POST');
    doc.text('Description: Registers a new user with email verification');
    doc.text('Rate Limit: 5 attempts per hour per IP');
    doc.text('Request Body: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "username": "string", // 3-20 alphanumeric characters\n' +
      '  "email": "string", // Valid email format\n' +
      '  "password": "string", // Min 8 chars, 1 uppercase, 1 number, 1 special\n' +
      '  "firstName": "string",\n' +
      '  "lastName": "string",\n' +
      '  "termsAccepted": boolean, // Must be true\n' +
      '  "marketingConsent": boolean // Optional\n' +
      '}'
    );
    doc.fontSize(11).font('Helvetica').text('Response: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "code": 201,\n' +
      '  "success": true,\n' +
      '  "message": "User registered successfully. Please verify your email.",\n' +
      '  "data": {\n' +
      '    "userId": "u123456789",\n' +
      '    "verificationSent": true,\n' +
      '    "verificationExpiry": "2023-07-15T14:34:56Z"\n' +
      '  }\n' +
      '}'
    );
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Refresh Token');
    doc.fontSize(11).font('Helvetica').text('Endpoint: /auth/refresh');
    doc.text('Method: POST');
    doc.text('Description: Obtains a new access token using a refresh token');
    doc.text('Request Body: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "refreshToken": "string" // Valid refresh token\n' +
      '}'
    );
    doc.fontSize(11).font('Helvetica').text('Response: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "code": 200,\n' +
      '  "success": true,\n' +
      '  "message": "Token refreshed successfully",\n' +
      '  "data": {\n' +
      '    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n' +
      '    "expiresIn": 86400\n' +
      '  }\n' +
      '}'
    );
    doc.moveDown(2);

    // Document user endpoints
    doc.fontSize(14).font('Helvetica-Bold').text('Blog Post Endpoints');
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Get All Posts');
    doc.fontSize(11).font('Helvetica').text('Endpoint: /posts');
    doc.text('Method: GET');
    doc.text('Description: Retrieves paginated blog posts with optional filtering');
    doc.text('Authentication: Optional - Authenticated users receive personalized results');
    doc.text('Query Parameters:');
    doc.fontSize(10).font('Helvetica').list([
      'page: number (default: 1) - Current page number',
      'limit: number (default: 10, max: 50) - Items per page',
      'sort: string (default: "createdAt") - Sort field (createdAt, title, likes)',
      'order: string (default: "desc") - Sort order (asc, desc)',
      'category: string - Filter by category',
      'tag: string - Filter by tag',
      'author: string - Filter by author ID',
      'search: string - Search in title and content'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.fontSize(11).font('Helvetica').text('Response: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "code": 200,\n' +
      '  "success": true,\n' +
      '  "message": "Posts retrieved successfully",\n' +
      '  "data": {\n' +
      '    "posts": [\n' +
      '      {\n' +
      '        "id": "p123456789",\n' +
      '        "title": "Getting Started with React 18",\n' +
      '        "excerpt": "Learn the basics of React 18 and its new features",\n' +
      '        "author": {\n' +
      '          "id": "u987654321",\n' +
      '          "username": "reactmaster",\n' +
      '          "profileImage": "https://cdn.blogapp.com/profiles/reactmaster.jpg"\n' +
      '        },\n' +
      '        "coverImage": "https://cdn.blogapp.com/posts/react18-cover.jpg",\n' +
      '        "createdAt": "2023-07-10T08:15:30Z",\n' +
      '        "updatedAt": "2023-07-10T10:22:15Z",\n' +
      '        "category": "Programming",\n' +
      '        "tags": ["React", "JavaScript", "Frontend"],\n' +
      '        "readTime": 8,\n' +
      '        "likes": 124,\n' +
      '        "comments": 18,\n' +
      '        "isLiked": true, // Only present for authenticated users\n' +
      '        "isBookmarked": false // Only present for authenticated users\n' +
      '      },\n' +
      '      // More posts...\n' +
      '    ],\n' +
      '    "pagination": {\n' +
      '      "total": 142,\n' +
      '      "pages": 15,\n' +
      '      "currentPage": 1,\n' +
      '      "hasNext": true,\n' +
      '      "hasPrev": false\n' +
      '    }\n' +
      '  }\n' +
      '}'
    );
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Create Blog Post');
    doc.fontSize(11).font('Helvetica').text('Endpoint: /posts');
    doc.text('Method: POST');
    doc.text('Description: Creates a new blog post');
    doc.text('Authentication: Required (User or Admin role)');
    doc.text('Request Body: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "title": "string", // 10-150 characters\n' +
      '  "content": "string", // HTML content, min 100 characters\n' +
      '  "excerpt": "string", // Optional, max 300 characters\n' +
      '  "coverImage": "string", // Optional, URL or base64\n' +
      '  "category": "string", // Must be one of predefined categories\n' +
      '  "tags": ["string"], // Optional, max 5 tags\n' +
      '  "status": "string", // "draft" or "published"\n' +
      '  "seoTitle": "string", // Optional, max 70 characters\n' +
      '  "seoDescription": "string", // Optional, max 160 characters\n' +
      '  "allowComments": boolean // Optional, default: true\n' +
      '}'
    );
    doc.fontSize(11).font('Helvetica').text('Response: ');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "code": 201,\n' +
      '  "success": true,\n' +
      '  "message": "Blog post created successfully",\n' +
      '  "data": {\n' +
      '    "id": "p123456789",\n' +
      '    "title": "Getting Started with React 18",\n' +
      '    "slug": "getting-started-with-react-18",\n' +
      '    "url": "https://blogapp.com/posts/getting-started-with-react-18",\n' +
      '    "status": "published",\n' +
      '    "createdAt": "2023-07-15T12:34:56Z"\n' +
      '  }\n' +
      '}'
    );
    
    doc.moveDown();
    
    // Add comment endpoints
    doc.fontSize(14).font('Helvetica-Bold').text('Comment Endpoints');
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Get Comments for Post');
    doc.fontSize(11).font('Helvetica').text('Endpoint: /posts/{postId}/comments');
    doc.text('Method: GET');
    doc.text('Description: Retrieves comments for a specific blog post with pagination');
    doc.text('Path Parameters: postId - ID of the blog post');
    doc.text('Query Parameters: page, limit, sort (createdAt, likes), order (asc, desc)');
    doc.fontSize(11).font('Helvetica').text('Response Structure: Paginated list of comments with nested replies');
  });
}

// Function to generate user guide
async function generateUserGuide() {
  await createPdf('User Guide', 'user-guide.pdf', (doc) => {
    doc.fontSize(16).font('Helvetica-Bold').text('Introduction', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'This user guide provides comprehensive instructions on using the Blog Web Application, a feature-rich platform designed for content creators and readers. Version 2.3.0 introduces several new features and improvements over the previous version.',
      { align: 'justify' }
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('System Requirements', { underline: true });
    doc.fontSize(12).font('Helvetica').text('The application is compatible with:');
    doc.list([
      'Desktop: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+',
      'Mobile: iOS Safari 14+, Android Chrome 90+',
      'Minimum screen resolution: 320px width (responsive design)',
      'JavaScript must be enabled',
      'Cookies must be enabled for authentication'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Getting Started', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'To begin using the Blog Web Application, you need to create an account or log in with an existing one. The application supports both standard email/password authentication and social login options.',
      { align: 'justify' }
    );
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Creating an Account');
    doc.fontSize(12).font('Helvetica');
    doc.text('To create a new account:');
    doc.moveDown(0.5);
    doc.list([
      'Navigate to https://blogapp.com/signup or tap the "Sign Up" button on the login screen.',
      'Enter your username (3-20 characters, alphanumeric only).',
      'Enter your email address (will require verification).',
      'Create a strong password (minimum 8 characters with at least one uppercase letter, one number, and one special character).',
      'Review and accept the Terms of Service and Privacy Policy.',
      'Optional: Enable two-factor authentication for enhanced security.',
      'Click the "Create Account" button.',
      'Check your email for a verification link and click it to activate your account.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    doc.text('Refer to Figure 1 in the Appendix for a screenshot of the sign-up form.');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Logging In');
    doc.fontSize(12).font('Helvetica');
    doc.text('To log in to your account:');
    doc.moveDown(0.5);
    doc.list([
      'Navigate to https://blogapp.com/login or click "Log In" on the homepage.',
      'Enter your username or email address.',
      'Enter your password.',
      'Optional: Check "Remember me" to stay logged in for 30 days.',
      'Click the "Log In" button.',
      'If you have two-factor authentication enabled, enter the verification code from your authenticator app.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    doc.text('Alternative login methods:');
    doc.list([
      'Click "Continue with Google" to log in with your Google account.',
      'Click "Continue with Apple" to log in with your Apple ID.',
      'Click "Continue with Twitter" to log in with your Twitter account.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Dashboard', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'After logging in, you\'ll be directed to your personalized dashboard, which displays:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Recommended blog posts based on your reading history and preferences',
      'Latest posts from authors you follow',
      'Your reading list (saved articles)',
      'Your draft posts (if you are a content creator)',
      'Notifications (comments, likes, new followers)',
      'Quick access to popular categories'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    doc.text('To customize your dashboard:');
    doc.list([
      'Click the "Customize" button in the top-right corner of the dashboard.',
      'Select which widgets to show/hide and drag to rearrange them.',
      'Choose your preferred layout (grid, list, or compact).',
      'Click "Save Changes" to apply your customizations.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Reading Content', { underline: true });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Browsing Articles');
    doc.fontSize(12).font('Helvetica').text(
      'To discover and read blog posts:',
      { align: 'justify' }
    );
    doc.list([
      'Use the search bar at the top to find specific content (supports advanced filters).',
      'Browse categories by clicking on the category tabs in the navigation menu.',
      'Explore trending topics in the "Trending Now" section.',
      'View personalized recommendations in the "For You" section.',
      'Check the "New" section for the latest publications across all categories.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Reading Experience');
    doc.fontSize(12).font('Helvetica').text(
      'While reading an article, you can:',
      { align: 'justify' }
    );
    doc.list([
      'Adjust text size using the "A-" and "A+" buttons in the reading toolbar.',
      'Switch between light and dark mode using the theme toggle in the top-right corner.',
      'Save articles to your reading list by clicking the bookmark icon.',
      'Share articles via email, social media, or copy the link using the share button.',
      'Highlight text by selecting it and clicking the highlight icon in the popup menu.',
      'Add private notes to highlighted sections for your reference.',
      'Enable "Focus Mode" by clicking the distraction-free icon to hide sidebars and comments.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Creating Content', { underline: true });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Writing a Blog Post');
    doc.fontSize(12).font('Helvetica').text(
      'To create and publish a new blog post:',
      { align: 'justify' }
    );
    doc.list([
      'Click the "Write" button in the navigation bar.',
      'Enter a compelling title (10-150 characters).',
      'Use the rich text editor to write and format your content:',
      '  • Format text using the toolbar (bold, italic, headings, etc.).',
      '  • Insert images by clicking the image icon or drag-and-drop.',
      '  • Add links by selecting text and clicking the link icon.',
      '  • Insert code snippets using the code block option.',
      '  • Add tables, quotes, and horizontal rules as needed.',
      'Add relevant tags (up to 5) to help readers discover your content.',
      'Select a category that best fits your post.',
      'Upload a cover image (recommended size: 1200x630 pixels).',
      'Write a brief excerpt (max 300 characters) to appear in previews.',
      'Preview your post by clicking the "Preview" button.',
      'Click "Save as Draft" to save without publishing.',
      'Click "Publish" when you\'re ready to make it live.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(16).font('Helvetica-Bold').text('Managing Your Account', { underline: true });
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Profile Settings');
    doc.fontSize(12).font('Helvetica').text(
      'To update your profile information:',
      { align: 'justify' }
    );
    doc.list([
      'Click your profile picture in the top-right corner.',
      'Select "Settings" from the dropdown menu.',
      'In the "Profile" tab, you can:',
      '  • Update your profile picture and cover image',
      '  • Edit your display name and username',
      '  • Update your bio and social media links',
      '  • Set your location and preferred language',
      'Click "Save Changes" to apply your updates.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Notification Settings');
    doc.fontSize(12).font('Helvetica').text(
      'To customize your notification preferences:',
      { align: 'justify' }
    );
    doc.list([
      'Go to Settings > Notifications.',
      'Choose which notifications to receive via email and/or in-app:',
      '  • New followers',
      '  • Comments on your posts',
      '  • Likes and shares',
      '  • Replies to your comments',
      '  • Posts from followed authors',
      '  • Newsletter and digest emails',
      'Set your preferred notification frequency (immediate, daily digest, weekly digest).',
      'Click "Save Preferences" to apply your settings.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(16).font('Helvetica-Bold').text('Troubleshooting', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'If you encounter any issues while using the application:',
      { align: 'justify' }
    );
    doc.list([
      'Clear your browser cache and cookies.',
      'Try using a different supported browser.',
      'Check your internet connection.',
      'Ensure you\'re using the latest version of the application.',
      'For login issues, use the "Forgot Password" feature to reset your credentials.',
      'Contact support at support@blogapp.com or use the in-app chat support.'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Common Issues and Solutions');
    doc.fontSize(12).font('Helvetica');
    
    doc.text('Issue: Unable to log in');
    doc.text('Solutions:');
    doc.list([
      'Ensure your username/email and password are correct',
      'Check if Caps Lock is enabled',
      'Reset your password if you\'ve forgotten it',
      'Clear browser cookies and try again',
      'Check if your account has been verified (new accounts)'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.text('Issue: Images not uploading');
    doc.text('Solutions:');
    doc.list([
      'Check that your image is in a supported format (JPG, PNG, GIF, WebP)',
      'Ensure the file size is under 5MB',
      'Try compressing the image first',
      'Check your internet connection',
      'Try a different browser or device'
    ], { bulletRadius: 2, textIndent: 20 });
  });
}

// Function to generate component documentation
async function generateComponentDocumentation() {
  await createPdf('Component Documentation', 'component-documentation.pdf', (doc) => {
    doc.fontSize(16).font('Helvetica-Bold').text('Component Overview', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'This document provides detailed information about the key components used in the Blog Web Application. The application follows a component-based architecture with atomic design principles, organizing components into atoms, molecules, organisms, templates, and pages.',
      { align: 'justify' }
    );
    doc.moveDown();

    // Add component hierarchy diagram
    doc.text('Component Hierarchy Diagram:', { align: 'center' });
    doc.moveDown(0.5);
    addSvgToPdf(doc, path.join(diagramsDir, 'component-hierarchy.svg'));
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Component Organization');
    doc.fontSize(12).font('Helvetica').text(
      'Components are organized following atomic design principles:',
      { align: 'justify' }
    );
    doc.list([
      'Atoms: Basic building blocks like Button, Input, Icon, Typography',
      'Molecules: Simple combinations of atoms like SearchBar, FormField, Card',
      'Organisms: Complex UI sections like Header, Sidebar, CommentSection',
      'Templates: Page layouts that arrange organisms into a complete page structure',
      'Pages: Specific instances of templates that present actual content'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    // Document Account components
    doc.fontSize(14).font('Helvetica-Bold').text('Authentication Components');
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Login Component');
    doc.fontSize(11).font('Helvetica').text('Path: src/components/AccountIssue/Login/index.jsx');
    doc.text('Purpose: Handles user login functionality with form validation and error handling');
    doc.text('Key Features:');
    doc.list([
      'Supports email/username and password authentication',
      'Integrates with OAuth providers (Google, Apple, Twitter)',
      'Implements client-side validation before submission',
      'Handles and displays server errors appropriately',
      'Supports "Remember me" functionality',
      'Includes password visibility toggle',
      'Provides password recovery link'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.text('Props:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  setLoginState: PropTypes.func.isRequired, // Updates parent component with login status\n' +
      '  redirectPath: PropTypes.string, // Path to redirect after successful login\n' +
      '  onLoginSuccess: PropTypes.func, // Optional callback after successful login\n' +
      '  showRememberMe: PropTypes.bool, // Whether to show remember me checkbox\n' +
      '  showSocialLogin: PropTypes.bool // Whether to show social login options\n' +
      '}'
    );
    doc.fontSize(11).font('Helvetica').text('State:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  formValues: { username: string, password: string, rememberMe: boolean },\n' +
      '  formErrors: { username: string, password: string },\n' +
      '  isLoading: boolean,\n' +
      '  showPassword: boolean,\n' +
      '  serverError: string,\n' +
      '  redirectToReferrer: boolean\n' +
      '}'
    );
    doc.moveDown();
    doc.fontSize(11).font('Helvetica').text('Usage Example:');
    doc.fontSize(10).font('Courier').text(
      '<Login\n' +
      '  setLoginState={(loggedIn) => updateAuthState(loggedIn)}\n' +
      '  redirectPath="/dashboard"\n' +
      '  onLoginSuccess={() => trackAnalytics("user_login")}\n' +
      '  showRememberMe={true}\n' +
      '  showSocialLogin={true}\n' +
      '/>'
    );
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('SignUp Component');
    doc.fontSize(11).font('Helvetica').text('Path: src/components/AccountIssue/SignUp/index.jsx');
    doc.text('Purpose: Handles new user registration with multi-step form process');
    doc.text('Key Features:');
    doc.list([
      'Multi-step registration flow (account details, profile setup, preferences)',
      'Progressive form validation at each step',
      'Password strength indicator',
      'Username availability checker',
      'Terms & conditions acceptance',
      'Email verification integration',
      'Profile setup guidance'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.text('Props:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  onSignupComplete: PropTypes.func, // Callback when signup is successful\n' +
      '  referralCode: PropTypes.string, // Optional referral code\n' +
      '  initialStep: PropTypes.number, // Which step to start on (default: 1)\n' +
      '  analyticsTracker: PropTypes.func // Function to track signup steps\n' +
      '}'
    );
    doc.fontSize(11).font('Helvetica').text('State:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  currentStep: number,\n' +
      '  formValues: {\n' +
      '    username: string,\n' +
      '    email: string,\n' +
      '    password: string,\n' +
      '    confirmPassword: string,\n' +
      '    firstName: string,\n' +
      '    lastName: string,\n' +
      '    termsAccepted: boolean\n' +
      '  },\n' +
      '  formErrors: { ... }, // Validation errors\n' +
      '  isSubmitting: boolean,\n' +
      '  isUsernameTaken: boolean,\n' +
      '  passwordStrength: number, // 0-5 scale\n' +
      '  serverError: string\n' +
      '}'
    );
    doc.moveDown();

    // Document Animation components
    doc.fontSize(14).font('Helvetica-Bold').text('Animation Components');
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Aurora Component');
    doc.fontSize(11).font('Helvetica').text('Path: src/Animations/Aurora/Aurora.jsx');
    doc.text('Purpose: Provides a dynamic Aurora Borealis effect as a background visual');
    doc.text('Implementation: Uses Canvas API with WebGL for performant particle animations');
    doc.text('Key Features:');
    doc.list([
      'Responsive design that adapts to container dimensions',
      'Configurable colors, intensity, and animation speed',
      'Performance optimized with requestAnimationFrame',
      'Automatic pause when not in viewport to save resources',
      'Fallback static gradient for devices with WebGL disabled'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.text('Props:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Container width\n' +
      '  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Container height\n' +
      '  colorPalette: PropTypes.arrayOf(PropTypes.string), // Array of color hex codes\n' +
      '  particleCount: PropTypes.number, // Number of particles to render\n' +
      '  speed: PropTypes.number, // Animation speed multiplier\n' +
      '  intensity: PropTypes.number, // Color intensity (0.0-1.0)\n' +
      '  interactive: PropTypes.bool, // Whether mouse movement affects animation\n' +
      '  disableAnimation: PropTypes.bool // For performance-sensitive environments\n' +
      '}'
    );
    doc.fontSize(11).font('Helvetica').text('Usage Example:');
    doc.fontSize(10).font('Courier').text(
      '<Aurora\n' +
      '  width="100%"\n' +
      '  height="400px"\n' +
      '  colorPalette={["#1a2a6c", "#b21f1f", "#fdbb2d"]}\n' +
      '  particleCount={1000}\n' +
      '  speed={1.5}\n' +
      '  intensity={0.8}\n' +
      '  interactive={true}\n' +
      '/>'
    );
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Iridescence Component');
    doc.fontSize(11).font('Helvetica').text('Path: src/Animations/Iridescence/Iridescence.jsx');
    doc.text('Purpose: Creates a subtle iridescent shimmer effect on UI elements');
    doc.text('Implementation: CSS-based animation using gradient overlays and CSS variables');
    doc.text('Key Features:');
    doc.list([
      'Light-weight CSS-only implementation for optimal performance',
      'Configurable gradient direction and shimmer speed',
      'Supports both light and dark mode with appropriate contrast',
      'Can be applied to buttons, cards, and section backgrounds',
      'Accessibility-friendly with reduced motion preference support'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.text('Props:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Container width\n' +
      '  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Container height\n' +
      '  direction: PropTypes.oneOf([\'horizontal\', \'vertical\', \'diagonal\']), // Shimmer direction\n' +
      '  speed: PropTypes.oneOf([\'slow\', \'medium\', \'fast\']), // Animation speed\n' +
      '  intensity: PropTypes.number, // Effect intensity (0.0-1.0)\n' +
      '  children: PropTypes.node // Content to apply effect to\n' +
      '}'
    );
    doc.moveDown();

    // Document Content components
    doc.fontSize(14).font('Helvetica-Bold').text('Content Components');
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('BlogPostEditor Component');
    doc.fontSize(11).font('Helvetica').text('Path: src/components/Contents/TextEditor/index.jsx');
    doc.text('Purpose: Rich text editor for creating and editing blog posts');
    doc.text('Implementation: Built on top of TipTap editor with custom extensions');
    doc.text('Key Features:');
    doc.list([
      'WYSIWYG editing experience with formatting toolbar',
      'Support for images, videos, code blocks, and embeds',
      'Markdown shortcuts for power users (# for headings, ** for bold, etc.)',
      'Auto-save functionality to prevent data loss',
      'Draft versioning with restore capability',
      'Word count and reading time estimation',
      'SEO optimization suggestions',
      'Custom block components (callouts, tables, galleries)'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.text('Props:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  initialContent: PropTypes.string, // HTML or markdown content to initialize editor\n' +
      '  onSave: PropTypes.func.isRequired, // Callback when content is saved\n' +
      '  onPublish: PropTypes.func, // Callback when publish button is clicked\n' +
      '  autoSaveInterval: PropTypes.number, // Time in ms between auto-saves\n' +
      '  toolbarConfig: PropTypes.shape({ // Configure which toolbar items to show\n' +
      '    basic: PropTypes.bool, // bold, italic, underline\n' +
      '    headings: PropTypes.bool,\n' +
      '    lists: PropTypes.bool,\n' +
      '    media: PropTypes.bool,\n' +
      '    advanced: PropTypes.bool // code, tables, etc.\n' +
      '  }),\n' +
      '  maxLength: PropTypes.number, // Maximum character count\n' +
      '  readOnly: PropTypes.bool, // Whether editor is in read-only mode\n' +
      '  placeholder: PropTypes.string, // Placeholder text when editor is empty\n' +
      '}'
    );
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('BlogPostCard Component');
    doc.fontSize(11).font('Helvetica').text('Path: src/components/Contents/Item/Article/index.jsx');
    doc.text('Purpose: Displays a preview card for blog posts in listings and search results');
    doc.text('Implementation: Responsive card component with multiple display variants');
    doc.text('Variants:');
    doc.list([
      'Standard: Image, title, excerpt, author, timestamp, engagement metrics',
      'Compact: Title, author, timestamp only (for sidebar listings)',
      'Featured: Larger image, title, excerpt, author with background image',
      'List: Horizontal layout for search results and feed views',
      'Minimal: Just title and timestamp for notification contexts'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.text('Props:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  post: PropTypes.shape({ // Post data object\n' +
      '    id: PropTypes.string.isRequired,\n' +
      '    title: PropTypes.string.isRequired,\n' +
      '    excerpt: PropTypes.string,\n' +
      '    coverImage: PropTypes.string,\n' +
      '    createdAt: PropTypes.string,\n' +
      '    readTime: PropTypes.number,\n' +
      '    category: PropTypes.string,\n' +
      '    tags: PropTypes.arrayOf(PropTypes.string),\n' +
      '    author: PropTypes.shape({\n' +
      '      id: PropTypes.string,\n' +
      '      name: PropTypes.string,\n' +
      '      avatar: PropTypes.string\n' +
      '    }),\n' +
      '    metrics: PropTypes.shape({\n' +
      '      likes: PropTypes.number,\n' +
      '      comments: PropTypes.number,\n' +
      '      shares: PropTypes.number\n' +
      '    })\n' +
      '  }).isRequired,\n' +
      '  variant: PropTypes.oneOf([\'standard\', \'compact\', \'featured\', \'list\', \'minimal\']),\n' +
      '  onClick: PropTypes.func, // Click handler for the card\n' +
      '  showAuthor: PropTypes.bool, // Whether to show author info\n' +
      '  showMetrics: PropTypes.bool, // Whether to show engagement metrics\n' +
      '  isBookmarked: PropTypes.bool, // Whether post is bookmarked by user\n' +
      '  onBookmarkToggle: PropTypes.func // Handler for bookmark toggle\n' +
      '}'
    );
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Layout Components');
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('AppLayout Component');
    doc.fontSize(11).font('Helvetica').text('Path: src/components/Layout/AppLayout.jsx');
    doc.text('Purpose: Main application layout wrapper that provides common UI elements');
    doc.text('Features:');
    doc.list([
      'Responsive layout with mobile, tablet, and desktop breakpoints',
      'Header with navigation, search, and user menu',
      'Optional sidebar with customizable content',
      'Footer with site links and information',
      'Toast notification container',
      'Theme switching capability',
      'Authentication state awareness'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.text('Props:');
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  children: PropTypes.node.isRequired, // Page content\n' +
      '  title: PropTypes.string, // Page title for SEO and browser tab\n' +
      '  description: PropTypes.string, // Meta description\n' +
      '  showHeader: PropTypes.bool, // Whether to show header\n' +
      '  showFooter: PropTypes.bool, // Whether to show footer\n' +
      '  showSidebar: PropTypes.bool, // Whether to show sidebar\n' +
      '  sidebarContent: PropTypes.node, // Custom sidebar content\n' +
      '  headerTransparent: PropTypes.bool, // Whether header has transparent background\n' +
      '  containerClassName: PropTypes.string, // Additional CSS class for container\n' +
      '  requireAuth: PropTypes.bool, // Whether page requires authentication\n' +
      '  fullWidth: PropTypes.bool // Whether to use full width layout\n' +
      '}'
    );
    doc.moveDown();
  });
}

// Function to generate deployment guide
async function generateDeploymentGuide() {
  await createPdf('Deployment Guide', 'deployment-guide.pdf', (doc) => {
    doc.fontSize(16).font('Helvetica-Bold').text('Deployment Overview', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'This document provides detailed instructions for deploying the Blog Web Application to various environments. The application is designed to be deployed as a static site that connects to backend API services.',
      { align: 'justify' }
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Prerequisites', { underline: true });
    doc.fontSize(12).font('Helvetica').text('Before deploying the application, ensure you have:');
    doc.list([
      'Node.js v16.14.0 or higher installed on your build environment',
      'npm v8.3.0 or higher or yarn v1.22.0 or higher',
      'Access to the target deployment environment (hosting service credentials)',
      'Backend API services properly configured and accessible',
      'Environment variables for the target environment',
      'SSL certificate for production deployments (required for PWA features)',
      'Domain name configured with DNS settings pointing to your hosting provider'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Environment Configuration', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application requires specific environment variables for each deployment environment:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.fontSize(14).font('Helvetica-Bold').text('Production Environment Variables');
    doc.fontSize(10).font('Courier').text(
      '# API Configuration\n' +
      'NEXT_PUBLIC_API_URL=https://api.blogapp.com/v1\n' +
      'NEXT_PUBLIC_SOCKET_URL=https://api.blogapp.com\n' +
      'NEXT_PUBLIC_ASSET_URL=https://cdn.blogapp.com\n' +
      '\n' +
      '# Analytics and Monitoring\n' +
      'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X\n' +
      'NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxx.ingest.sentry.io/xxxxxxx\n' +
      '\n' +
      '# Authentication\n' +
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID=production-google-client-id.apps.googleusercontent.com\n' +
      'NEXT_PUBLIC_APPLE_CLIENT_ID=com.blogapp.production\n' +
      '\n' +
      '# Feature Flags\n' +
      'NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false\n' +
      'NEXT_PUBLIC_ENABLE_MOCK_API=false\n' +
      'NEXT_PUBLIC_MAINTENANCE_MODE=false'
    );
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Staging Environment Variables');
    doc.fontSize(10).font('Courier').text(
      '# API Configuration\n' +
      'NEXT_PUBLIC_API_URL=https://api-staging.blogapp.com/v1\n' +
      'NEXT_PUBLIC_SOCKET_URL=https://api-staging.blogapp.com\n' +
      'NEXT_PUBLIC_ASSET_URL=https://cdn-staging.blogapp.com\n' +
      '\n' +
      '# Analytics and Monitoring\n' +
      'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA-XXXXXXXX-X\n' +
      'NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxx.ingest.sentry.io/staging-xxxxxxx\n' +
      '\n' +
      '# Authentication\n' +
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID=staging-google-client-id.apps.googleusercontent.com\n' +
      'NEXT_PUBLIC_APPLE_CLIENT_ID=com.blogapp.staging\n' +
      '\n' +
      '# Feature Flags\n' +
      'NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=true\n' +
      'NEXT_PUBLIC_ENABLE_MOCK_API=false\n' +
      'NEXT_PUBLIC_MAINTENANCE_MODE=false'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Building for Production', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'To create an optimized production build, follow these steps:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.list([
      'Ensure all environment variables are properly configured in your .env.production file',
      'Run linting and tests to ensure code quality: npm run lint && npm test',
      'Generate the production build: npm run build',
      'Verify the build by running it locally: npm run start',
      'The optimized production files will be created in the "build" directory'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown(0.5);
    
    doc.fontSize(10).font('Courier').text(
      '# Example build script for CI/CD pipeline\n' +
      'npm ci --production\n' +
      'npm run lint\n' +
      'npm test\n' +
      'npm run build'
    );
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica').text(
      'The production build includes:',
      { align: 'justify' }
    );
    doc.list([
      'Minified JavaScript bundles with code splitting',
      'Optimized CSS with vendor prefixes',
      'Compressed static assets',
      'Service worker for offline functionality',
      'Web App Manifest for PWA capabilities',
      'Static HTML for initial rendering',
      'Source maps for error tracking (optional, can be disabled)'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Deployment Options', { underline: true });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Deploying to Netlify');
    doc.fontSize(12).font('Helvetica');
    doc.text('Netlify provides an easy way to deploy the application with continuous integration:');
    doc.moveDown(0.5);
    doc.list([
      'Create a netlify.toml file in the project root:',
    ], { bulletRadius: 2, textIndent: 20 });
    doc.fontSize(10).font('Courier').text(
      '[build]\n' +
      '  command = "npm run build"\n' +
      '  publish = "build"\n' +
      '\n' +
      '[context.production]\n' +
      '  environment = { NODE_VERSION = "16.14.0" }\n' +
      '\n' +
      '[[redirects]]\n' +
      '  from = "/*"\n' +
      '  to = "/index.html"\n' +
      '  status = 200'
    );
    doc.fontSize(12).font('Helvetica');
    doc.moveDown();
    doc.list([
      'Connect your GitHub repository to Netlify:',
      '  1. Log in to Netlify and click "New site from Git"',
      '  2. Select GitHub and authorize Netlify',
      '  3. Select your repository',
      '  4. Configure build settings using the netlify.toml file',
      '  5. Configure environment variables in the Netlify UI (Settings > Build & deploy > Environment)',
      '  6. Click "Deploy site"',
      'Set up a custom domain:',
      '  1. Go to Domain settings in Netlify',
      '  2. Click "Add custom domain"',
      '  3. Enter your domain and follow instructions to configure DNS'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Deploying to Vercel');
    doc.fontSize(12).font('Helvetica');
    doc.text('Vercel is optimized for Next.js applications and offers similar ease of use:');
    doc.moveDown(0.5);
    doc.list([
      'Create a vercel.json file in the project root:',
    ], { bulletRadius: 2, textIndent: 20 });
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "version": 2,\n' +
      '  "builds": [\n' +
      '    { "src": "package.json", "use": "@vercel/static-build" }\n' +
      '  ],\n' +
      '  "routes": [\n' +
      '    { "src": "/static/(.*)", "dest": "/static/$1" },\n' +
      '    { "src": "/favicon.ico", "dest": "/favicon.ico" },\n' +
      '    { "src": "/asset-manifest.json", "dest": "/asset-manifest.json" },\n' +
      '    { "src": "/manifest.json", "dest": "/manifest.json" },\n' +
      '    { "src": "/service-worker.js", "headers": { "cache-control": "s-maxage=0" }, "dest": "/service-worker.js" },\n' +
      '    { "src": "/(.*)", "dest": "/index.html" }\n' +
      '  ]\n' +
      '}'
    );
    doc.fontSize(12).font('Helvetica');
    doc.moveDown();
    doc.list([
      'Deploy to Vercel:',
      '  1. Install Vercel CLI: npm i -g vercel',
      '  2. Login to Vercel: vercel login',
      '  3. Deploy: vercel --prod',
      'Alternatively, connect your GitHub repository to Vercel:',
      '  1. Log in to Vercel and click "New Project"',
      '  2. Select your repository',
      '  3. Configure build settings and environment variables',
      '  4. Click "Deploy"'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Deploying to AWS S3 + CloudFront');
    doc.fontSize(12).font('Helvetica');
    doc.text('For more control and scalability, deploy to AWS using S3 for storage and CloudFront for content delivery:');
    doc.moveDown(0.5);
    doc.list([
      'Create an S3 bucket:',
      '  1. Go to AWS S3 console and create a new bucket',
      '  2. Enable "Static website hosting" in bucket properties',
      '  3. Set the index document to "index.html" and error document to "index.html"',
      '  4. Update the bucket policy to allow public read access:',
    ], { bulletRadius: 2, textIndent: 20 });
    doc.fontSize(10).font('Courier').text(
      '{\n' +
      '  "Version": "2012-10-17",\n' +
      '  "Statement": [\n' +
      '    {\n' +
      '      "Sid": "PublicReadGetObject",\n' +
      '      "Effect": "Allow",\n' +
      '      "Principal": "*",\n' +
      '      "Action": "s3:GetObject",\n' +
      '      "Resource": "arn:aws:s3:::your-bucket-name/*"\n' +
      '    }\n' +
      '  ]\n' +
      '}'
    );
    doc.fontSize(12).font('Helvetica');
    doc.moveDown();
    doc.list([
      'Deploy the build to S3:',
      '  1. Build the project: npm run build',
      '  2. Deploy to S3 using AWS CLI:',
    ], { bulletRadius: 2, textIndent: 20 });
    doc.fontSize(10).font('Courier').text('aws s3 sync build/ s3://your-bucket-name --delete');
    doc.fontSize(12).font('Helvetica');
    doc.moveDown();
    doc.list([
      'Set up CloudFront:',
      '  1. Create a new CloudFront distribution',
      '  2. Set the origin domain to your S3 website endpoint',
      '  3. Configure cache behavior:',
      '     • Default TTL: 86400 (1 day)',
      '     • Compress objects automatically: Yes',
      '     • Forward query strings: Yes',
      '  4. Set the default root object to "index.html"',
      '  5. Configure error pages:',
      '     • HTTP Error Code: 403, 404',
      '     • Response Page Path: /index.html',
      '     • HTTP Response Code: 200',
      '  6. Create and attach SSL certificate using AWS Certificate Manager',
      '  7. Set up custom domain in CloudFront settings'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Deploying with Docker');
    doc.fontSize(12).font('Helvetica');
    doc.text('For containerized deployments, use Docker with Nginx as a web server:');
    doc.moveDown(0.5);
    doc.list([
      'Create a Dockerfile in the project root:',
    ], { bulletRadius: 2, textIndent: 20 });
    doc.fontSize(10).font('Courier').text(
      '# Build stage\n' +
      'FROM node:16-alpine as build\n' +
      'WORKDIR /app\n' +
      'COPY package*.json ./\n' +
      'RUN npm ci\n' +
      'COPY . .\n' +
      'RUN npm run build\n' +
      '\n' +
      '# Production stage\n' +
      'FROM nginx:alpine\n' +
      'COPY --from=build /app/build /usr/share/nginx/html\n' +
      'COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf\n' +
      'EXPOSE 80\n' +
      'CMD ["nginx", "-g", "daemon off;"]'
    );
    doc.fontSize(12).font('Helvetica');
    doc.moveDown();
    doc.text('Create an nginx.conf file in an nginx directory:');
    doc.fontSize(10).font('Courier').text(
      'server {\n' +
      '  listen 80;\n' +
      '  server_name _;\n' +
      '  root /usr/share/nginx/html;\n' +
      '  index index.html;\n' +
      '  \n' +
      '  # Enable gzip\n' +
      '  gzip on;\n' +
      '  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\n' +
      '  \n' +
      '  location / {\n' +
      '    try_files $uri $uri/ /index.html;\n' +
      '  }\n' +
      '  \n' +
      '  # Cache static assets\n' +
      '  location /static/ {\n' +
      '    expires 1y;\n' +
      '    add_header Cache-Control "public, max-age=31536000";\n' +
      '  }\n' +
      '}'
    );
    doc.fontSize(12).font('Helvetica');
    doc.moveDown();
    doc.list([
      'Build and run the Docker container:',
      '  1. Build the Docker image: docker build -t blogapp .',
      '  2. Run the container: docker run -p 8080:80 blogapp',
      '  3. Access the application at http://localhost:8080',
      'For production deployment:',
      '  1. Push the image to a container registry (Docker Hub, AWS ECR, etc.)',
      '  2. Deploy to your container orchestration platform (Kubernetes, ECS, etc.)'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Continuous Integration/Continuous Deployment', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'Set up CI/CD pipelines to automate testing and deployment:',
      { align: 'justify' }
    );
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('GitHub Actions');
    doc.text('Create a workflow file at .github/workflows/deploy.yml:');
    doc.fontSize(10).font('Courier').text(
      'name: Deploy\n\n' +
      'on:\n' +
      '  push:\n' +
      '    branches: [ main ]\n\n' +
      'jobs:\n' +
      '  test:\n' +
      '    runs-on: ubuntu-latest\n' +
      '    steps:\n' +
      '      - uses: actions/checkout@v3\n' +
      '      - name: Setup Node.js\n' +
      '        uses: actions/setup-node@v3\n' +
      '        with:\n' +
      '          node-version: 16\n' +
      '          cache: \'npm\'\n' +
      '      - name: Install dependencies\n' +
      '        run: npm ci\n' +
      '      - name: Run linter\n' +
      '        run: npm run lint\n' +
      '      - name: Run tests\n' +
      '        run: npm test\n\n' +
      '  deploy:\n' +
      '    needs: test\n' +
      '    runs-on: ubuntu-latest\n' +
      '    steps:\n' +
      '      - uses: actions/checkout@v3\n' +
      '      - name: Setup Node.js\n' +
      '        uses: actions/setup-node@v3\n' +
      '        with:\n' +
      '          node-version: 16\n' +
      '          cache: \'npm\'\n' +
      '      - name: Install dependencies\n' +
      '        run: npm ci\n' +
      '      - name: Build\n' +
      '        run: npm run build\n' +
      '        env:\n' +
      '          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}\n' +
      '          # Add other environment variables\n' +
      '      - name: Deploy to AWS S3\n' +
      '        uses: jakejarvis/s3-sync-action@master\n' +
      '        with:\n' +
      '          args: --delete\n' +
      '        env:\n' +
      '          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}\n' +
      '          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n' +
      '          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n' +
      '          SOURCE_DIR: "build"\n' +
      '      - name: Invalidate CloudFront cache\n' +
      '        uses: chetan/invalidate-cloudfront-action@master\n' +
      '        env:\n' +
      '          DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}\n' +
      '          PATHS: "/*"\n' +
      '          AWS_REGION: "us-east-1"\n' +
      '          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n' +
      '          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Post-Deployment Verification', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'After deploying, perform these checks to ensure everything is working correctly:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Verify all pages load correctly and are responsive on different devices',
      'Check that API endpoints are connected and returning data',
      'Test authentication flows (login, signup, password reset)',
      'Ensure static assets (images, fonts, etc.) are loading properly',
      'Verify service worker registration and offline functionality',
      'Run Lighthouse audit to check performance, accessibility, SEO, and PWA compliance',
      'Check console for any errors or warnings',
      'Monitor error tracking service (Sentry) for any unexpected errors',
      'Test critical user flows (posting, commenting, navigation)'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(16).font('Helvetica-Bold').text('Rollback Procedures', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'If issues are detected after deployment, follow these rollback procedures:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica-Bold').text('Netlify/Vercel Rollback');
    doc.list([
      'Go to the Deployments section in your hosting dashboard',
      'Find the last known good deployment',
      'Click "Restore deployment" or equivalent option',
      'Verify the rollback was successful'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('AWS S3/CloudFront Rollback');
    doc.list([
      'Deploy the previous version from CI/CD or manually:',
      '  aws s3 sync s3://your-backup-bucket/previous-version/ s3://your-production-bucket/ --delete',
      'Invalidate CloudFront cache:',
      '  aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
  });
}

// Function to generate development guide
async function generateDevelopmentGuide() {
  await createPdf('Development Guide', 'development-guide.pdf', (doc) => {
    doc.fontSize(16).font('Helvetica-Bold').text('Development Overview', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'This document provides comprehensive guidelines and best practices for developing the Blog Web Application. It covers setup instructions, architecture, coding standards, and workflows for contributors.',
      { align: 'justify' }
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Development Environment Setup', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'To set up your development environment, follow these steps:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Prerequisites');
    doc.list([
      'Node.js v16.14.0 or higher (LTS recommended)',
      'npm v8.3.0 or higher (comes with Node.js)',
      'Git v2.30.0 or higher',
      'Visual Studio Code (recommended) with ESLint and Prettier extensions',
      'Chrome or Firefox with React Developer Tools extension'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Installation Steps');
    doc.list([
      'Clone the repository: git clone https://github.com/organization/blog-web-app.git',
      'Navigate to the project directory: cd blog-web-app',
      'Install dependencies: npm install',
      'Create a .env.local file based on .env.example and configure environment variables',
      'Start the development server: npm run dev',
      'The application will be available at http://localhost:3000'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Environment Variables');
    doc.text('Create a .env.local file in the project root with the following variables:');
    doc.fontSize(10).font('Courier').text(
      'NEXT_PUBLIC_API_URL=http://localhost:4000/api\n' +
      'NEXT_PUBLIC_SOCKET_URL=http://localhost:4000\n' +
      'NEXT_PUBLIC_ASSET_URL=http://localhost:4000/assets\n' +
      'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X\n' +
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com\n' +
      'NEXT_PUBLIC_ENABLE_MOCK_API=true # Set to false when using real API'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Project Structure', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The project follows a feature-based organization with the following structure:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);

    doc.list([
      'src/ - Source code directory',
      '  ├── Animations/ - Animation components and effects',
      '  ├── components/ - React components organized by feature',
      '  │   ├── AccountIssue/ - Authentication components',
      '  │   ├── Contents/ - Content display components',
      '  │   ├── Errors/ - Error handling and display components',
      '  │   ├── Header/ - Navigation and header components',
      '  │   ├── redux/ - Redux store, slices, and actions',
      '  │   └── ... - Other component categories',
      '  ├── Providers/ - React context providers',
      '  │   ├── NotificationProvider.jsx - Notification system provider',
      '  │   └── SearchProvider.js - Search context provider',
      '  ├── Themes/ - Theme definitions and theming context',
      '  ├── util/ - Utility functions and helpers',
      '  │   ├── data_structures/ - Custom data structure implementations',
      '  │   └── io_utils/ - API and I/O utilities',
      '  ├── App.js - Main application component',
      '  └── index.js - Application entry point',
      'public/ - Static assets and files',
      '  ├── images/ - Image assets',
      '  ├── serviceworkers/ - Service worker scripts',
      '  └── webworkers/ - Web worker scripts'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Feature Organization');
    doc.fontSize(12).font('Helvetica').text(
      'Each feature is organized following this structure:',
      { align: 'justify' }
    );
    doc.list([
      'components/FeatureName/ - Root feature directory',
      '  ├── index.jsx - Main entry point/container component',
      '  ├── FeatureName.module.css - Feature-specific styles (if not using styled components)',
      '  ├── SubComponent/ - Sub-component directory',
      '  │   ├── index.jsx - Sub-component implementation',
      '  │   └── SubComponent.test.jsx - Component tests',
      '  ├── hooks/ - Feature-specific custom hooks',
      '  └── utils/ - Feature-specific utility functions'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Development Workflow', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'Follow these guidelines when developing new features or fixing bugs:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Git Workflow');
    doc.list([
      'Always branch from develop: git checkout -b feature/your-feature-name',
      'Use conventional commit messages: feat(component): add new feature',
      'Submit pull requests against the develop branch',
      'Ensure CI checks pass before requesting review',
      'Squash commits before merging'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Branch Naming Convention');
    doc.list([
      'feature/feature-name - For new features',
      'bugfix/issue-description - For bug fixes',
      'hotfix/issue-description - For critical production fixes',
      'refactor/component-name - For code refactoring',
      'docs/documentation-description - For documentation updates'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Commit Message Format');
    doc.text('Follow the Conventional Commits specification:');
    doc.fontSize(10).font('Courier').text(
      '<type>[optional scope]: <description>\n\n' +
      '[optional body]\n\n' +
      '[optional footer(s)]'
    );
    doc.fontSize(12).font('Helvetica').text('Types include:');
    doc.list([
      'feat: A new feature',
      'fix: A bug fix',
      'docs: Documentation changes',
      'style: Changes that do not affect the meaning of the code',
      'refactor: Code change that neither fixes a bug nor adds a feature',
      'perf: Code change that improves performance',
      'test: Adding or correcting tests',
      'build: Changes to the build system or external dependencies',
      'ci: Changes to CI configuration files and scripts'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Coding Standards', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'Adhere to the following coding standards to maintain code quality:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('General Guidelines');
    doc.list([
      'Use functional components with hooks instead of class components',
      'Use TypeScript for type safety when adding new components',
      'Follow the principle of single responsibility (each component does one thing well)',
      'Keep components small and focused (< 300 lines recommended)',
      'Use named exports instead of default exports for better refactoring support',
      'Avoid prop drilling; use context or state management when props are passed through many layers',
      'Prefer composition over inheritance for component reuse',
      'Use error boundaries to gracefully handle component errors'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('React Best Practices');
    doc.list([
      'Memoize expensive components using React.memo()',
      'Use the useCallback() hook for event handlers passed to child components',
      'Use the useMemo() hook for expensive calculations',
      'Lazy load components for code splitting: const Component = React.lazy(() => import(\'./Component\'))',
      'Add meaningful alt text to all images for accessibility',
      'Use semantic HTML elements (e.g., <button> instead of <div onClick={...}>)',
      'Use proper ARIA attributes for accessibility',
      'Avoid direct DOM manipulation; use refs when necessary'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('State Management');
    doc.list([
      'Use local state (useState) for component-specific state',
      'Use context (useContext) for state shared between a few components',
      'Use Redux for application-wide state or complex state logic',
      'Follow the Redux Toolkit guidelines for reducer organization',
      'Use createSlice() to define reducers and actions',
      'Normalize complex state structures in Redux',
      'Use selectors for accessing and computing derived state'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Testing', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The project uses Jest and React Testing Library for testing. Run tests with:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.fontSize(11).font('Courier').text('npm test             # Run all tests\nnpm test -- --watch  # Run tests in watch mode');
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica').text(
      'Follow these guidelines for writing tests:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Component Testing');
    doc.list([
      'Test behavior rather than implementation details',
      'Use React Testing Library\'s queries in this order of preference:',
      '  1. Accessible queries (getByRole, getByLabelText, getByPlaceholderText, getByText)',
      '  2. Test ID queries (getByTestId) as a last resort',
      'Simulate user interactions using userEvent rather than fireEvent when possible',
      'Test alternative states (loading, error, empty, etc.)',
      'Use mock data consistently across tests',
      'Isolate component tests by mocking external dependencies'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Test Organization');
    doc.list([
      'Co-locate tests with the components they test',
      'Use descriptive test names following the pattern: "renders/behaves/handles [expected behavior] when [condition]"',
      'Group related tests using describe blocks',
      'Use beforeEach for common setup logic',
      'Keep tests independent of each other'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Example Test');
    doc.fontSize(10).font('Courier').text(
      'import { render, screen } from \'@testing-library/react\';\n' +
      'import userEvent from \'@testing-library/user-event\';\n' +
      'import LoginForm from \'./LoginForm\';\n\n' +
      'describe(\'LoginForm\', () => {\n' +
      '  const mockLogin = jest.fn();\n\n' +
      '  beforeEach(() => {\n' +
      '    mockLogin.mockClear();\n' +
      '  });\n\n' +
      '  it(\'submits username and password when form is submitted\', async () => {\n' +
      '    render(<LoginForm onSubmit={mockLogin} />);\n\n' +
      '    // Fill out form\n' +
      '    await userEvent.type(screen.getByLabelText(/username/i), \'testuser\');\n' +
      '    await userEvent.type(screen.getByLabelText(/password/i), \'password123\');\n\n' +
      '    // Submit form\n' +
      '    await userEvent.click(screen.getByRole(\'button\', { name: /log in/i }));\n\n' +
      '    // Assert\n' +
      '    expect(mockLogin).toHaveBeenCalledWith({\n' +
      '      username: \'testuser\',\n' +
      '      password: \'password123\',\n' +
      '    });\n' +
      '  });\n' +
      '});'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Performance Optimization', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'Follow these guidelines to ensure optimal application performance:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Use React.lazy() and Suspense for code splitting',
      'Implement windowing for long lists with react-window or react-virtualized',
      'Optimize images using WebP format and responsive sizes',
      'Use pagination or infinite scrolling for large datasets',
      'Implement proper caching strategies for API calls',
      'Memoize expensive calculations with useMemo()',
      'Use service workers for offline support and caching',
      'Minimize bundle size by tree-shaking and dynamic imports',
      'Optimize critical rendering path by deferring non-essential resources'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Performance Monitoring');
    doc.text('Use the following tools to monitor and improve performance:');
    doc.list([
      'Lighthouse in Chrome DevTools for overall performance audits',
      'React DevTools Profiler for component rendering performance',
      'WebPageTest for real-world performance testing',
      'Bundle analyzer: npm run analyze'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Troubleshooting', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'Common development issues and solutions:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Node Module Issues');
    doc.text('If you encounter dependency issues:');
    doc.list([
      'Delete node_modules directory: rm -rf node_modules',
      'Clear npm cache: npm cache clean --force',
      'Reinstall dependencies: npm install'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('API Connection Issues');
    doc.text('If the application cannot connect to the API:');
    doc.list([
      'Ensure the API server is running',
      'Check that NEXT_PUBLIC_API_URL is correctly set in .env.local',
      'Verify network connectivity and CORS configuration',
      'Check browser console for specific error messages',
      'Set NEXT_PUBLIC_ENABLE_MOCK_API=true to use mock data for development'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
  });
}

// Function to generate architecture documentation
async function generateArchitectureDocumentation() {
  await createPdf('Architecture Documentation', 'architecture-documentation.pdf', (doc) => {
    doc.fontSize(16).font('Helvetica-Bold').text('Architecture Overview', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'This document provides a comprehensive description of the Vydeo application architecture. The application is built as a modern React single-page application (SPA) with a focus on real-time communication, video content management, and social features.',
      { align: 'justify' }
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('High-Level Architecture', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The Vydeo application follows a client-side architecture built with React 18, using Redux for global state management and Context API for theme and UI state. The application communicates with multiple backend services via RESTful APIs and uses WebSockets for real-time features including chat, notifications, and content updates.',
      { align: 'justify' }
    );
    doc.moveDown();
    doc.text('The application architecture consists of the following major layers:');
    doc.list([
      'Presentation Layer: React components with Material UI, organized by feature',
      'State Management Layer: Redux store for global state and Context API for theme and UI state',
      'Service Layer: API clients, WebSocket communication, and utility services',
      'Persistence Layer: LocalForage and browser storage for offline data access'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    // Add data flow diagram
    doc.text('Data Flow Diagram:', { align: 'center' });
    doc.moveDown(0.5);
    addSvgToPdf(doc, path.join(diagramsDir, 'data-flow-diagram.svg'));
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('System Context', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The Vydeo application interacts with several external systems:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Java API Service (https://apis.vydeo.xyz/java): Primary RESTful backend for core functionality',
      'Python API Service (https://apis.vydeo.xyz/py): Specialized service for data processing and ML features',
      'WebSocket Server (wss://apis.vydeo.xyz/ws): Real-time communication for chat and notifications',
      'Download Service: Dedicated service for handling large media file downloads',
      'Push Notification Service: Browser-based push notifications via Service Workers'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Backend API Integration');
    doc.fontSize(10).font('Courier').text(
      '// API client configuration from actual codebase\n' +
      'const apiClient = axios.create({\n' +
      '  baseURL: API_BASE_URL,  // https://apis.vydeo.xyz/java\n' +
      '  timeout: 5000\n' +
      '});\n\n' +
      'const flaskClient = axios.create({\n' +
      '  baseURL: FLASK_API_BASE_URL,  // https://apis.vydeo.xyz/py\n' +
      '  timeout: 5000\n' +
      '});\n\n' +
      '// Each client has interceptors for authentication\n' +
      'apiClient.interceptors.request.use(\n' +
      '  (config) => {\n' +
      '    const token = localStorage.getItem("token");\n' +
      '    if (token) {\n' +
      '      config.headers.token = token;\n' +
      '    }\n' +
      '    return config;\n' +
      '  }\n' +
      ');'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Core Components', { underline: true });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Frontend Architecture');
    doc.fontSize(12).font('Helvetica');
    doc.text('The frontend application is organized into feature-based components with the following structure:');
    doc.list([
      'src/ - Source code directory',
      '  ├── components/ - React components organized by feature',
      '  │   ├── AccountIssue/ - Authentication related components',
      '  │   │   ├── Login/ - Login functionality',
      '  │   │   ├── SignUp/ - Registration functionality',
      '  │   │   └── Forget/ - Password recovery',
      '  │   ├── Contents/ - Main content components',
      '  │   │   ├── Videos/ - Video browsing and playback',
      '  │   │   ├── Chat/ - Messaging functionality',
      '  │   │   ├── FriendList/ - Friend management',
      '  │   │   ├── VideoList/ - Video listings and recommendations',
      '  │   │   └── Settings/ - User preferences',
      '  │   ├── Header/ - Navigation and search components',
      '  │   ├── Errors/ - Error handling components',
      '  │   └── redux/ - Redux state management',
      '  ├── Providers/ - Context providers',
      '  │   ├── NotificationProvider.jsx - Notification handling',
      '  │   └── SearchProvider.js - Search functionality',
      '  ├── Themes/ - Theme definitions',
      '  │   └── ThemeContext.js - Light/dark mode theming',
      '  ├── Animations/ - Animation components',
      '  ├── util/ - Utility functions',
      '  │   ├── io_utils/ - API and data utilities',
      '  │   └── data_structures/ - Custom data handling',
      '  ├── App.js - Main application component',
      '  └── index.js - Application entry point'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Data Flow');
    doc.fontSize(12).font('Helvetica').text(
      'The application follows a unidirectional data flow pattern:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      '1. User interacts with a component, triggering an event handler',
      '2. Event handler dispatches an action to the Redux store',
      '3. For API operations:',
      '   a. The appropriate API client (apiClient, flaskClient) sends the request',
      '   b. Token interceptors automatically add authentication headers',
      '   c. Response interceptors handle token expiration and errors',
      '4. Redux reducers process actions and update state',
      '5. Connected components re-render based on state changes',
      '6. For real-time features, WebSockets provide immediate updates'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Redux Store Structure');
    doc.fontSize(10).font('Courier').text(
      '// Actual Redux store configuration from the codebase\n' +
      'export default configureStore({\n' +
      '  reducer: {\n' +
      '    searchResult: searchResult,\n' +
      '    userDetails: userDetails,\n' +
      '    search: Search,\n' +
      '    refreshMessages: refreshMessagesReducer,\n' +
      '    refreshSideBar: refreshSideBarReducer,\n' +
      '    refreshMailBox: refreshMailBoxReducer,\n' +
      '    auth: authReducer,\n' +
      '    scrollCursor: scrollCursorReducer\n' +
      '  },\n' +
      '})'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Authentication Flow', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application uses JWT-based authentication with token persistence:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    
    doc.fontSize(14).font('Helvetica-Bold').text('Login Process');
    doc.list([
      '1. User enters credentials in the Login component',
      '2. On form submission, credentials are sent to the authentication API',
      '3. Server validates credentials and returns a JWT token',
      '4. The Redux login action is dispatched with the token and user data',
      '5. Token is stored in localStorage and user state in Redux',
      '6. API client interceptors automatically use the token for subsequent requests',
      '7. User is redirected to the main application content'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Token Expiration Handling');
    doc.list([
      '1. API client interceptors detect 401 Unauthorized responses',
      '2. The logout action is dispatched to clear authentication state',
      '3. User is presented with the login screen',
      '4. localStorage and localForage data are cleared for security'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(14).font('Helvetica-Bold').text('Authentication Code Implementation');
    doc.fontSize(10).font('Courier').text(
      '// Authentication slice from actual codebase\n' +
      'const authSlice = createSlice({\n' +
      '  name: \'auth\',\n' +
      '  initialState: {\n' +
      '    isAuthenticated: false,\n' +
      '    showLoginModal: false,\n' +
      '    user: null,\n' +
      '    token: null,\n' +
      '    isLoading: false,\n' +
      '  },\n' +
      '  reducers: {\n' +
      '    login: (state, action) => {\n' +
      '      state.isAuthenticated = true;\n' +
      '      state.user = action.payload.user;\n' +
      '      state.token = action.payload.token;\n' +
      '      \n' +
      '      // Store auth data in localStorage\n' +
      '      localStorage.setItem(\'isLoggedIn\', \'true\');\n' +
      '      localStorage.setItem(\'token\', action.payload.token);\n' +
      '      if (action.payload.user?.userId) {\n' +
      '        localStorage.setItem(\'userId\', action.payload.user.userId);\n' +
      '      }\n' +
      '    },\n' +
      '    logout: (state) => {\n' +
      '      state.isAuthenticated = false;\n' +
      '      state.user = null;\n' +
      '      state.token = null;\n' +
      '      \n' +
      '      // Clear stored auth data\n' +
      '      localStorage.removeItem(\'isLoggedIn\');\n' +
      '      localStorage.removeItem(\'token\');\n' +
      '      localStorage.removeItem(\'userId\');\n' +
      '    }\n' +
      '    // ... other reducers\n' +
      '  }\n' +
      '});'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Theme Management', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application implements a theme switching capability using React Context and Material UI\'s ThemeProvider:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      '1. ThemeContext.js defines the theme context and provider',
      '2. Theme preferences (light/dark) are persisted in localStorage',
      '3. The ThemeContextProvider wraps the application and provides theme values',
      '4. Material UI theme is dynamically created based on the selected mode',
      '5. Component styling is adjusted automatically based on the current theme'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(10).font('Courier').text(
      '// Theme implementation from the actual codebase\n' +
      'export const ThemeContextProvider = ({ children }) => {\n' +
      '  const [mode, setMode] = useState(\'dark\');\n' +
      '  \n' +
      '  // Load saved theme from localStorage\n' +
      '  useEffect(() => {\n' +
      '    const savedMode = localStorage.getItem(\'mode\');\n' +
      '    if (savedMode === \'light\' || savedMode === \'dark\') {\n' +
      '      setMode(savedMode);\n' +
      '    }\n' +
      '  }, []);\n' +
      '  \n' +
      '  // Save theme changes to localStorage\n' +
      '  useEffect(() => {\n' +
      '    localStorage.setItem(\'mode\', mode);\n' +
      '  }, [mode]);\n' +
      '  \n' +
      '  const toggleMode = () => {\n' +
      '    setMode((prev) => (prev === \'light\' ? \'dark\' : \'light\'));\n' +
      '  };\n' +
      '  \n' +
      '  // Create Material UI theme based on mode\n' +
      '  const theme = useMemo(() => createTheme({\n' +
      '    palette: {\n' +
      '      mode,\n' +
      '      // Custom theme colors\n' +
      '      background: {\n' +
      '        default: mode === \'dark\' ? \'#000000\' : \'#ffffff\',\n' +
      '        paper: mode === \'dark\' ? \'rgba(0,0,0,0.6)\' : \'#ffffff\',\n' +
      '      },\n' +
      '      // ... other theme settings\n' +
      '    }\n' +
      '  }), [mode]);\n' +
      '  \n' +
      '  return (\n' +
      '    <ThemeContext.Provider value={{ mode, toggleMode }}>\n' +
      '      <ThemeProvider theme={theme}>\n' +
      '        <CssBaseline enableColorScheme />\n' +
      '        {children}\n' +
      '      </ThemeProvider>\n' +
      '    </ThemeContext.Provider>\n' +
      '  );\n' +
      '};'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Offline Support and Data Persistence', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application implements offline support and data persistence through:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Service Workers: Registered for background processing and push notifications',
      'LocalForage: IndexedDB-based persistent storage for application data',
      'LocalStorage: For simple key-value storage of user preferences and tokens',
      'Push Notifications: Using the browser\'s Push API for notifications when the app is closed'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(10).font('Courier').text(
      '// Service worker registration from the actual codebase\n' +
      'if (\'serviceWorker\' in navigator) {\n' +
      '  navigator.serviceWorker.register(\'/serviceworkers/NotificationReceiver.js\').then(\n' +
      '    registration => {\n' +
      '      navigator.serviceWorker.ready.then(readyRegistration => {\n' +
      '        if (Notification.permission === \'granted\') {\n' +
      '          register(readyRegistration); // Register for push notifications\n' +
      '        } else if (Notification.permission === \'default\') {\n' +
      '          Notification.requestPermission().then(permission => {\n' +
      '            if (permission === \'granted\') {\n' +
      '              register(readyRegistration);\n' +
      '            }\n' +
      '          });\n' +
      '        }\n' +
      '      });\n' +
      '    }\n' +
      '  );\n' +
      '}'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Routing and Navigation', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application uses React Router v6 for client-side routing with authentication protection:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'BrowserRouter provides the routing context for the application',
      'Authentication-based conditional rendering controls access to routes',
      'The Contents component contains all authenticated routes',
      'When not authenticated, the AccountIssue component is shown instead',
      'Error components handle specific error conditions like network issues'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(10).font('Courier').text(
      '// Main routing structure from App.js\n' +
      'if (!isAuthenticated || showLoginModal) {\n' +
      '  return (\n' +
      '    <ThemeContextProvider>\n' +
      '      <AccountIssue\n' +
      '        loginState={isAuthenticated}\n' +
      '        setLoginState={(newState) => {\n' +
      '          // Login state management\n' +
      '        }}\n' +
      '      />\n' +
      '    </ThemeContextProvider>\n' +
      '  );\n' +
      '}\n\n' +
      'if (isAuthenticated) {\n' +
      '  return (\n' +
      '    <BrowserRouter>\n' +
      '      <ThemeContextProvider>\n' +
      '        <Contents\n' +
      '          setLogin={async (newState) => {\n' +
      '            // Login/logout handling\n' +
      '          }}\n' +
      '        />\n' +
      '      </ThemeContextProvider>\n' +
      '    </BrowserRouter>\n' +
      '  );\n' +
      '}'
    );
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Error Handling', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application implements comprehensive error handling:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'Dedicated error components for specific error scenarios:',
      '  • NetworkError: Displayed when internet connectivity is lost',
      '  • EndpointNotAvailableError: Shown when API endpoints are unreachable',
      '  • NotFoundError: For 404 errors when navigating to non-existent routes',
      'API error handling through axios interceptors',
      'Authentication error handling with automatic logout on token expiration',
      'Notifications for user feedback on operations'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
    
    doc.fontSize(16).font('Helvetica-Bold').text('Real-time Communication', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application uses WebSockets for real-time features:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'WebSocket connection to wss://apis.vydeo.xyz/ws',
      'Real-time chat messaging between users',
      'Push notifications for new messages and content updates',
      'Message handlers for different types of real-time events',
      'Integration with Redux for state updates on WebSocket events'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Security Considerations', { underline: true });
    doc.fontSize(12).font('Helvetica').text(
      'The application implements the following security measures:',
      { align: 'justify' }
    );
    doc.moveDown(0.5);
    doc.list([
      'JWT-based authentication with secure token storage',
      'Automatic token handling through API client interceptors',
      'Token expiration management and automatic logout',
      'Secure WebSocket communication with token authentication',
      'Environment-specific API endpoints for development and production',
      'Proper data clearing on logout to prevent information leakage'
    ], { bulletRadius: 2, textIndent: 20 });
    doc.moveDown();
  });
}

// Generate all documentation
async function generateAllDocs() {
  try {
    console.log('Generating documentation...');
    
    await generateProjectOverview();
    await generateApiDocumentation();
    await generateUserGuide();
    await generateComponentDocumentation();
    await generateDeploymentGuide();
    await generateDevelopmentGuide();
    await generateArchitectureDocumentation();
    
    console.log('Documentation generation completed successfully!');
    console.log(`PDF files are available in the ${docsDir} directory.`);
  } catch (error) {
    console.error('Error generating documentation:', error);
  }
}

// Run the documentation generator
generateAllDocs(); 