import axios from "axios";
import store from "../../components/redux/store"; // Adjust path to your Redux store
import { logout, showLoginModal } from "../../components/redux/authSlice"; // Adjust path to your auth actions
import localforage from "localforage";
import { API_BASE_URL } from "./URL";

// Create axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Create axios instance for public requests (no auth required)
const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - automatically add token to authenticated requests
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

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
      
      // Dispatch Redux actions
      store.dispatch(logout());
      store.dispatch(showLoginModal());
      
      // Optional: Redirect to login page instead of showing modal
      // window.location.href = '/login';
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

// Export both clients
export { apiClient, publicClient };

// Export default as the authenticated client
export default apiClient;