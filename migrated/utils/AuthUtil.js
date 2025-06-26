import apiClient from './ApiClient';
import Qs from 'qs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default class AuthUtil {
    static async getPaths() {
        try {
            if (typeof window === 'undefined') {
                return { data: { code: 0, message: JSON.stringify([]) } };
            }
            
            const response = await apiClient({
                url: '/account/getPaths',
                method: 'get',
            });
            
            return response;
        } catch (error) {
            console.error('Error fetching paths:', error);
            return { data: { code: -1, message: 'Failed to fetch paths' } };
        }
    }

    static deletePath(path, roleId) {
        return apiClient.post("/auth/deletePath", {
            roleId: roleId, 
            allowedPaths: [path]
        });
    }

    static getAllPathsByRoleId(roleId) {
        return apiClient.get("/auth/getPathsByRoleId", {
            params: { roleId: roleId }
        });
    }

    static async checkAuth() {
        try {
            if (typeof window === 'undefined') {
                return false;
            }
            
            const token = localStorage.getItem('token');
            if (!token) {
                return false;
            }
            
            const response = await apiClient({
                url: '/account/verify',
                method: 'get',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            return response.data && response.data.code === 0;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }

    static logout() {
        if (typeof window === 'undefined') {
            return;
        }
        
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
        
        // Clear any other auth-related data
        // This is just a placeholder - add any other items you need to clear
    }
}

// Helper function to check if the user is authenticated
export const isAuthenticated = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    
    // Check if token and userId are in localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    return !!(token && userId);
};

// Higher-order function that requires authentication for a component
export const requireAuthentication = async () => {
    // Server-side check returns false
    if (typeof window === 'undefined') {
        return false;
    }
    
    // Client-side check
    const authenticated = isAuthenticated();
    return authenticated;
};

// React hook for authentication 
export const useAuthentication = (redirectTo = '/login') => {
    const router = useRouter();
    
    useEffect(() => {
        // Check if running in browser
        if (typeof window === 'undefined') return;
        
        // Check authentication
        if (!isAuthenticated()) {
            // Redirect to login with current path as redirect parameter
            const currentPath = router.asPath;
            router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        }
    }, [router, redirectTo]);
    
    return { isAuthenticated: isAuthenticated() };
};

// Utility to get redirect URL from query parameters
export const getRedirectUrl = (router, defaultPath = '/') => {
    if (!router || !router.query) return defaultPath;
    
    const { redirect } = router.query;
    return redirect || defaultPath;
};

// Handle login success
export const handleLoginSuccess = (response, router, defaultRedirect = '/') => {
    if (typeof window === 'undefined') {
        return;
    }
    
    const responseData = response?.data;
    
    if (responseData && responseData.code === 0) {
        // Store authentication data
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userId', responseData.userId);
        
        // Get redirect URL from query params or use default
        const redirectUrl = getRedirectUrl(router, defaultRedirect);
        
        // Redirect to the appropriate page
        router.push(redirectUrl);
        return true;
    }
    
    return false;
};

// Handle logout
export const logout = (router, redirectTo = '/login') => {
    if (typeof window === 'undefined') {
        return;
    }
    
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    
    // Optional: Clear other data
    sessionStorage.clear();
    
    // Redirect to login page
    router.push(redirectTo);
}; 