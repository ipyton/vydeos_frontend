import axios from "axios";
import localforage from "localforage";
import { API_BASE_URL, FLASK_API_BASE_URL } from "./URL";

// For Next.js, we need to handle store imports differently to avoid SSR issues
let store;
if (typeof window !== 'undefined') {
  // Only import the store on the client side
  import('../components/redux/store').then((module) => {
    store = module.default;
  });
}

// Create axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for public requests (no auth required)
const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

const flaskClient = axios.create({
  baseURL: FLASK_API_BASE_URL,
  timeout: 5000,
});

const downloadClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Only add interceptors on the client side
if (typeof window !== 'undefined') {
  flaskClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.token = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token expiration
  flaskClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // Check for token expiration
      if (
        error.response?.status === 401 || 
        error.response?.data?.message === 'token expired' ||
        error.response?.data?.code === -1
      ) {
        console.log('Token expired, logging out user');
        
        // Clear stored tokens and user data
        localStorage.removeItem("token");
        await localforage.removeItem("userId");
        
        // Import auth actions dynamically
        const { logout, showLoginModal } = await import('../components/redux/authSlice');
        
        // Dispatch Redux actions
        if (store) {
          store.dispatch(logout());
          store.dispatch(showLoginModal());
        }
      }
      
      return Promise.reject(error);
    }
  );

  downloadClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.token = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token expiration
  downloadClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // Check for token expiration
      if (
        error.response?.status === 401 || 
        error.response?.data?.message === 'token expired' ||
        error.response?.data?.code === 401
      ) {
        console.log('Token expired, logging out user');
        
        // Clear stored tokens and user data
        localStorage.removeItem("token");
        await localforage.removeItem("userId");
        
        // Import auth actions dynamically
        const { logout, showLoginModal } = await import('../components/redux/authSlice');
        
        // Dispatch Redux actions
        if (store) {
          store.dispatch(logout());
          store.dispatch(showLoginModal());
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Request interceptor - automatically add token to authenticated requests
  apiClient.interceptors.request.use(
    async config => {
      // Only run on client side
      if (typeof window === 'undefined') return config;
      
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token expiration
  apiClient.interceptors.response.use(
    response => response,
    error => {
      // Handle error globally
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status } = error.response;
        
        // Handle 401 Unauthorized
        if (status === 401) {
          // Only run on client side
          if (typeof window !== 'undefined') {
            // Clear authentication data
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('isLoggedIn');
            
            // Redirect to login page
            window.location.href = '/login';
          }
        }
        
        // Handle 403 Forbidden
        if (status === 403) {
          console.error('Permission denied:', error.response.data);
        }
        
        // Handle 404 Not Found
        if (status === 404) {
          console.error('Resource not found:', error.response.data);
        }
        
        // Handle 500 Server Error
        if (status >= 500) {
          console.error('Server error:', error.response.data);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network error - no response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  // Optional: Add response interceptor to public client for general error handling
  publicClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle general errors for public API calls
      console.error('API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

// Export both clients
export { apiClient, publicClient, flaskClient, downloadClient };

// Export default as the authenticated client
export default apiClient; 