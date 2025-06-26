import Qs from 'qs';
import { API_URL } from './URL';
import { apiClient } from './ApiClient';

export default class VideoUtil {
  /**
   * Get the video gallery
   * @returns {Promise} - Promise object with video gallery data
   */
  static getGallery() {
    // Check if running on server
    if (typeof window === 'undefined' || !localStorage) {
      return Promise.resolve({ data: [] });
    }

    return apiClient({
      url: `${API_URL}/gallery/get`,
      method: 'get',
      params: { userId: localStorage.getItem("userId") },
    }).catch(err => {
      console.error("Error fetching gallery:", err);
      return { data: [] };
    });
  }

  /**
   * Check if a video is starred
   * @param {Object} videoIdentifier - The video identifier object
   * @returns {Promise} - Promise object with star status
   */
  static isStared(videoIdentifier) {
    if (typeof window === 'undefined' || !videoIdentifier) {
      return Promise.resolve({ data: { stared: false } });
    }

    return apiClient({
      url: `${API_URL}/movie_management/isStared`,
      method: 'get',
      params: { resourceId: videoIdentifier.resource_id, type: videoIdentifier.type },
    }).catch(err => {
      console.error("Error checking star status:", err);
      return { data: { stared: false } };
    });
  }

  /**
   * Star a video
   * @param {Object} movieIdentifier - The movie identifier object
   * @returns {Promise} - Promise object with star result
   */
  static star(movieIdentifier) {
    if (typeof window === 'undefined' || !localStorage || !movieIdentifier) {
      return Promise.resolve({ data: { code: -1 } });
    }

    let language = "en";
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      language = userInfo?.language || "en";
    } catch (e) {
      console.error("Error parsing user info:", e);
    }

    return apiClient({
      url: `${API_URL}/gallery/collect`,
      method: 'post',
      data: { 
        resourceId: movieIdentifier.resource_id, 
        type: movieIdentifier.type, 
        language: language 
      },
      transformRequest: [function (data) {
        return Qs.stringify(data);
      }],
    }).catch(err => {
      console.error("Error starring video:", err);
      return { data: { code: -1 } };
    });
  }

  /**
   * Remove star from a video
   * @param {Object} videoIdentifier - The video identifier object
   * @returns {Promise} - Promise object with remove star result
   */
  static removeStar(videoIdentifier) {
    if (typeof window === 'undefined' || !videoIdentifier) {
      return Promise.resolve({ data: { code: -1 } });
    }

    return apiClient({
      url: `${API_URL}/gallery/remove`,
      method: 'post',
      data: { 
        resourceId: videoIdentifier.resource_id, 
        type: videoIdentifier.type 
      },
      transformRequest: [function (data) {
        return Qs.stringify(data);
      }],
    }).catch(err => {
      console.error("Error removing star:", err);
      return { data: { code: -1 } };
    });
  }

  /**
   * Get video information
   * @param {Object} movieIdentifier - The movie identifier object
   * @param {Function} setState - State setter function
   * @param {string} language - Language code
   * @returns {Promise} - Promise object with video information
   */
  static getVideoInformation(movieIdentifier, setState, language = "en") {
    if (typeof window === 'undefined' || !movieIdentifier) {
      return Promise.resolve({ data: {} });
    }

    return apiClient({
      url: `${API_URL}/movie_management/getVideoInformation`,
      method: 'get',
      params: { 
        resourceId: movieIdentifier.resource_id, 
        type: movieIdentifier.type,
        language: language
      }
    }).then(response => {
      if (setState && response && response.data) {
        setState(response.data);
      }
      return response;
    }).catch(err => {
      console.error("Error fetching video information:", err);
      return { data: {} };
    });
  }

  /**
   * Check if a video is playable
   * @param {Object} movieIdentifier - The movie identifier object
   * @returns {Promise} - Promise object with playable status
   */
  static isPlayable(movieIdentifier) {
    if (typeof window === 'undefined' || !movieIdentifier) {
      return Promise.resolve({ data: { playable: false } });
    }

    return apiClient({
      url: `${API_URL}/movie_management/isPlayable`,
      method: 'get',
      params: { 
        resourceId: movieIdentifier.resource_id, 
        type: movieIdentifier.type 
      }
    }).catch(err => {
      console.error("Error checking playable status:", err);
      return { data: { playable: false } };
    });
  }

  /**
   * Get latest videos for the homepage
   * @param {number} limit - Number of videos to return
   * @returns {Promise} - Promise object with latest videos
   */
  static getLatestVideos(limit = 8) {
    if (typeof window === 'undefined') {
      return Promise.resolve({ data: [] });
    }
    
    return apiClient({
      url: `${API_URL}/gallery/latest`,
      method: 'get',
      params: { limit }
    }).catch(err => {
      console.error("Error fetching latest videos:", err);
      return { data: [] };
    });
  }

  /**
   * Get featured videos for the homepage
   * @param {number} limit - Number of videos to return
   * @returns {Promise} - Promise object with featured videos
   */
  static getFeaturedVideos(limit = 4) {
    if (typeof window === 'undefined') {
      return Promise.resolve({ data: [] });
    }
    
    return apiClient({
      url: `${API_URL}/gallery/featured`,
      method: 'get',
      params: { limit }
    }).catch(err => {
      console.error("Error fetching featured videos:", err);
      return { data: [] };
    });
  }

  /**
   * Get videos by category
   * @param {string} category - Category name
   * @param {number} limit - Number of videos to return
   * @returns {Promise} - Promise object with videos by category
   */
  static getVideosByCategory(category, limit = 8) {
    if (typeof window === 'undefined' || !category) {
      return Promise.resolve({ data: [] });
    }
    
    return apiClient({
      url: `${API_URL}/gallery/category`,
      method: 'get',
      params: { category, limit }
    }).catch(err => {
      console.error(`Error fetching videos for category ${category}:`, err);
      return { data: [] };
    });
  }
} 