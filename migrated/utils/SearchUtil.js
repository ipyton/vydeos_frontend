import ApiClient from './ApiClient';
import { API_URL } from './URL';

class SearchUtil {
  /**
   * Search for chat contacts by ID
   * @param {string} searchTerm - The search term to look for
   * @param {function} callback - Callback function to handle results
   */
  static async searchChatContactById(searchTerm, callback) {
    try {
      if (typeof window === 'undefined') {
        callback([]);
        return;
      }

      const response = await ApiClient.get(`${API_URL}/api/search/contacts?query=${encodeURIComponent(searchTerm)}`);
      
      if (response && response.data) {
        callback(response.data);
      } else {
        callback([]);
      }
    } catch (error) {
      console.error('Error searching contacts:', error);
      callback([]);
    }
  }

  /**
   * Search for local results
   * @param {string} searchTerm - The search term to look for
   * @param {function} callback - Callback function to handle results
   */
  static async searchLocalResult(searchTerm, callback) {
    try {
      if (typeof window === 'undefined') {
        callback([]);
        return;
      }

      const response = await ApiClient.get(`${API_URL}/api/search/local?query=${encodeURIComponent(searchTerm)}`);
      
      if (response && response.data) {
        callback(response.data);
      } else {
        callback([]);
      }
    } catch (error) {
      console.error('Error searching local results:', error);
      callback([]);
    }
  }

  /**
   * Search for videos
   * @param {string} searchTerm - The search term to look for
   * @param {function} callback - Callback function to handle results
   */
  static async searchVideos(searchTerm, callback) {
    try {
      if (typeof window === 'undefined') {
        callback([]);
        return;
      }

      const response = await ApiClient.get(`${API_URL}/api/search/videos?query=${encodeURIComponent(searchTerm)}`);
      
      if (response && response.data) {
        callback(response.data);
      } else {
        callback([]);
      }
    } catch (error) {
      console.error('Error searching videos:', error);
      callback([]);
    }
  }

  /**
   * Search for music
   * @param {string} searchTerm - The search term to look for
   * @param {function} callback - Callback function to handle results
   */
  static async searchMusics(searchTerm, callback) {
    try {
      if (typeof window === 'undefined') {
        callback([]);
        return;
      }

      const response = await ApiClient.get(`${API_URL}/api/search/music?query=${encodeURIComponent(searchTerm)}`);
      
      if (response && response.data) {
        callback(response.data);
      } else {
        callback([]);
      }
    } catch (error) {
      console.error('Error searching music:', error);
      callback([]);
    }
  }

  /**
   * Search for posts
   * @param {string} searchTerm - The search term to look for
   * @param {function} callback - Callback function to handle results
   */
  static async searchPosts(searchTerm, callback) {
    try {
      if (typeof window === 'undefined') {
        callback([]);
        return;
      }

      const response = await ApiClient.get(`${API_URL}/api/search/posts?query=${encodeURIComponent(searchTerm)}`);
      
      if (response && response.data) {
        callback(response.data);
      } else {
        callback([]);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
      callback([]);
    }
  }

  /**
   * Universal search across all types
   * @param {string} searchTerm - The search term to look for
   * @param {function} callback - Callback function to handle results
   */
  static async universalSearch(searchTerm, callback) {
    try {
      if (typeof window === 'undefined') {
        callback({ contacts: [], local: [], videos: [], music: [], posts: [] });
        return;
      }

      const response = await ApiClient.get(`${API_URL}/api/search/universal?query=${encodeURIComponent(searchTerm)}`);
      
      if (response && response.data) {
        callback(response.data);
      } else {
        callback({ contacts: [], local: [], videos: [], music: [], posts: [] });
      }
    } catch (error) {
      console.error('Error performing universal search:', error);
      callback({ contacts: [], local: [], videos: [], music: [], posts: [] });
    }
  }
  
  /**
   * Get search suggestions based on partial input
   * @param {string} partialInput - Partial search term
   * @param {function} callback - Callback function to handle results
   */
  static async getSearchSuggestions(partialInput, callback) {
    try {
      if (typeof window === 'undefined' || !partialInput || partialInput.length < 2) {
        callback([]);
        return;
      }

      const response = await ApiClient.get(`${API_URL}/api/search/suggestions?query=${encodeURIComponent(partialInput)}`);
      
      if (response && response.data) {
        callback(response.data);
      } else {
        callback([]);
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      callback([]);
    }
  }
}

export default SearchUtil; 