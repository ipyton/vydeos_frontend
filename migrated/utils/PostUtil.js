import apiClient from './ApiClient';

class PostUtil {
  /**
   * Get posts by user ID
   * @param {string} userId - The user ID
   * @param {Array} existingPosts - Existing posts array
   * @param {Function} setArticles - Function to set articles state
   */
  static async getPostsById(userId, existingPosts = [], setArticles = null) {
    try {
      if (!userId) {
        console.error('getUserPosts: No user ID provided');
        return [];
      }
      
      const response = await apiClient({
        url: `/posts/user/${userId}`,
        method: 'get',
      });
      
      if (response.data && response.data.code === 0) {
        const posts = JSON.parse(response.data.message);
        if (setArticles) {
          setArticles([...existingPosts, ...posts]);
        }
        return posts;
      } else {
        console.error('Failed to fetch user posts:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  }
  
  /**
   * Get posts from friends
   * @param {Array} existingPosts - Existing posts array
   * @param {Function} setArticles - Function to set articles state
   */
  static async getFriendPosts(existingPosts = [], setArticles = null) {
    try {
      const response = await apiClient({
        url: '/posts/friends',
        method: 'get',
      });
      
      if (response.data && response.data.code === 0) {
        const posts = JSON.parse(response.data.message);
        if (setArticles) {
          setArticles([...existingPosts, ...posts]);
        }
        return posts;
      } else {
        console.error('Failed to fetch friend posts:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching friend posts:', error);
      return [];
    }
  }
  
  /**
   * Create a new post
   * @param {FormData} formData - Form data containing post details and media
   * @returns {Promise} - API response
   */
  static async createPost(formData) {
    try {
      const response = await apiClient({
        url: '/posts',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
  
  /**
   * Like a post
   * @param {string} postId - The post ID
   * @returns {Promise} - API response
   */
  static async likePost(postId) {
    try {
      if (!postId) {
        console.error('likePost: No post ID provided');
        return null;
      }
      
      const response = await apiClient({
        url: `/posts/${postId}/like`,
        method: 'post',
      });
      
      return response;
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
      throw error;
    }
  }
  
  /**
   * Comment on a post
   * @param {string} postId - The post ID
   * @param {string} content - Comment content
   * @returns {Promise} - API response
   */
  static async commentPost(postId, content) {
    try {
      if (!postId || !content) {
        console.error('commentPost: Missing required parameters');
        return null;
      }
      
      const response = await apiClient({
        url: `/posts/${postId}/comment`,
        method: 'post',
        data: { content },
      });
      
      return response;
    } catch (error) {
      console.error(`Error commenting on post ${postId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get a post by ID
   * @param {string} postId - The post ID
   * @returns {Promise} - API response
   */
  static async getPostById(postId) {
    try {
      if (!postId) {
        console.error('getPostById: No post ID provided');
        return null;
      }
      
      const response = await apiClient({
        url: `/posts/${postId}`,
        method: 'get',
      });
      
      if (response.data && response.data.code === 0) {
        return JSON.parse(response.data.message);
      } else {
        console.error('Failed to fetch post:', response.data);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error);
      return null;
    }
  }

  /**
   * Mock method to generate dummy posts for testing
   * @param {number} count - Number of posts to generate
   * @returns {Array} - Array of dummy posts
   */
  static getMockPosts(count = 5) {
    const mockPosts = [];
    for (let i = 0; i < count; i++) {
      mockPosts.push({
        id: `mock-${Date.now()}-${i}`,
        title: `Sample Post ${i + 1}`,
        content: `This is a sample post content for post number ${i + 1}. It contains some text to demonstrate how posts would appear in the UI.`,
        authorName: 'Demo User',
        authorAvatar: 'https://i.pravatar.cc/150?img=' + (i + 1),
        publishDate: new Date(Date.now() - i * 86400000).toISOString(),
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 20),
        imageUrl: i % 2 === 0 ? `https://picsum.photos/800/400?random=${i}` : null,
      });
    }
    return mockPosts;
  }
}

export default PostUtil;