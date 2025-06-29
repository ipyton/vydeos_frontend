import Qs from 'qs';
import { apiClient } from './ApiClient';
import { API_URL } from './URL';

class PostUtilClass {
  /**
   * Upload a post picture
   * @param {File} pic - The picture file to upload
   * @returns {Promise} - Promise object with upload result
   */
  async uploadPicture(pic) {
    // Skip on server-side
    if (typeof window === 'undefined') {
      return Promise.resolve({ data: { message: '' } });
    }

    try {
      // Dynamically import the ImageCompressor to avoid SSR issues
      const ImageCompressor = (await import('./ImageCompressor')).default;
      const compressedImage = await ImageCompressor.compressImage(pic, 1024);
      
      return apiClient.post(`${API_URL}/file/uploadPostPic`, { file: compressedImage }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).catch(error => {
        console.error('Error uploading post picture:', error);
        return { data: { message: '' } };
      });
    } catch (error) {
      console.error('Error loading ImageCompressor or compressing image:', error);
      return Promise.resolve({ data: { message: '' } });
    }
  }

  /**
   * Send a new post
   * @param {string} content - Post content text
   * @param {Array} pics - Array of picture URLs
   * @param {Array} notice - Users to notify
   * @param {Array} whoCanSee - Users who can see the post
   * @param {string} location - Post location
   * @param {Array} list - Current posts list
   * @param {Function} setList - Function to update posts list
   * @returns {Promise} - Promise object representing the result
   */
  sendPost(content, pics, notice, whoCanSee, location, list, setList) {
    // Skip on server-side
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    const data = { 
      images: pics, 
      content: content, 
      authorName: "author", 
      notice: notice || [], 
      users: whoCanSee || [], 
      location: location || "", 
      voices: [], 
      videos: [], 
      comments: [] 
    };
    
    return apiClient.post(`${API_URL}/post/upload`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response && setList) {
        setList([data, ...list]);
      }
      return response;
    }).catch(error => {
      console.error('Error sending post:', error);
      return null;
    });
  }

  /**
   * Get posts by user ID
   * @param {string} id - User ID
   * @param {Array} list - Current posts list
   * @param {Function} setList - Function to update posts list
   * @returns {Promise} - Promise object representing the result
   */
  getPostsById(id, list = [], setList) {
    // Skip on server-side
    if (typeof window === 'undefined' || !localStorage) {
      return Promise.resolve([]);
    }

    const requestData = Qs.stringify({
      userID: localStorage.getItem("userId") || id
    });

    return apiClient.post(`${API_URL}/post/get_by_user_id`, requestData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (!response || !response.data || !response.data.posts) {
        console.log("Connection error or no posts");
        return [];
      }
      
      if (setList) {
        setList([...list, ...response.data.posts]);
      }
      
      return response.data.posts;
    }).catch(error => {
      console.error('Error getting posts by ID:', error);
      return [];
    });
  }

  /**
   * Get friend posts
   * @param {Array} list - Current posts list
   * @param {Function} setList - Function to update posts list
   * @returns {Promise} - Promise object representing the result
   */
  getFriendPosts(list = [], setList) {
    // Skip on server-side
    if (typeof window === 'undefined') {
      return Promise.resolve([]);
    }

    const requestData = Qs.stringify({});

    return apiClient.post(`${API_URL}/post/get_friends_posts`, requestData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (!response || !response.data || !response.data.posts) {
        console.log("Connection error or no friend posts");
        return [];
      }
      
      if (setList) {
        setList([...list, ...response.data.posts]);
      }
      
      return response.data.posts;
    }).catch(error => {
      console.error('Error getting friend posts:', error);
      return [];
    });
  }

  /**
   * Get recommended posts
   * @param {number} limit - Number of posts to return
   * @returns {Promise} - Promise object with recommended posts
   */
  getRecommendPosts(limit = 10) {
    // Skip on server-side
    if (typeof window === 'undefined') {
      return Promise.resolve([]);
    }
    
    return apiClient.get(`${API_URL}/post/get_recommended`, {
      params: { limit }
    }).then(response => {
      if (!response || !response.data || !response.data.posts) {
        return [];
      }
      return response.data.posts;
    }).catch(error => {
      console.error('Error getting recommended posts:', error);
      return [];
    });
  }

  /**
   * Like a post
   * @param {string} postId - Post ID
   * @returns {Promise} - Promise object representing the result
   */
  likePost(postId) {
    // Skip on server-side
    if (typeof window === 'undefined') {
      return Promise.resolve({ success: false });
    }
    
    return apiClient.post(`${API_URL}/post/like`, { postId }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return { success: true, data: response.data };
    }).catch(error => {
      console.error('Error liking post:', error);
      return { success: false, error };
    });
  }

  /**
   * Comment on a post
   * @param {string} postId - Post ID
   * @param {string} comment - Comment text
   * @returns {Promise} - Promise object representing the result
   */
  commentPost(postId, comment) {
    // Skip on server-side
    if (typeof window === 'undefined') {
      return Promise.resolve({ success: false });
    }
    
    return apiClient.post(`${API_URL}/post/comment`, { postId, comment }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return { success: true, data: response.data };
    }).catch(error => {
      console.error('Error commenting on post:', error);
      return { success: false, error };
    });
  }

  /**
   * Delete a post
   * @param {string} postId - Post ID
   * @returns {Promise} - Promise object representing the result
   */
  deletePost(postId) {
    // Skip on server-side
    if (typeof window === 'undefined') {
      return Promise.resolve({ success: false });
    }
    
    return apiClient.post(`${API_URL}/post/delete`, { postId }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return { success: true, data: response.data };
    }).catch(error => {
      console.error('Error deleting post:', error);
      return { success: false, error };
    });
  }
}

// Create singleton instance
const PostUtil = new PostUtilClass();

export default PostUtil;