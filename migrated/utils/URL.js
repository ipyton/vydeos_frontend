// export const API_BASE_URL = "http://localhost:8080"
// export const FLASK_API_BASE_URL = "http://localhost:8081"
// export const  DOWNLOAD_BASE_URL = "http://localhost:5000"

// API URL configuration for different environments
const DEV_API_URL = 'https://apis.vydeo.xyz/java';
const PROD_API_URL = 'https://apis.vydeo.xyz/java';
const LOCAL_API_URL = 'http://localhost:8080';

// Determine the environment for API calls
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocal = process.env.NEXT_PUBLIC_USE_LOCAL_API === 'true';

// Export the API URL to use
export const API_URL = isLocal ? LOCAL_API_URL : (isDevelopment ? DEV_API_URL : PROD_API_URL);

// Create URL helpers
export const createAssetUrl = (path) => {
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Social media URLs
export const SOCIAL_URLS = {
  FACEBOOK: 'https://facebook.com',
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
  GITHUB: 'https://github.com'
};

// App routes 
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  ABOUT: '/about',
  POSTS: '/posts',
  NOT_FOUND: '/404'
};

// For CDN or media files
export const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'https://media.vydeo.xyz';

// Export default as API_URL for backward compatibility
export default API_URL; 