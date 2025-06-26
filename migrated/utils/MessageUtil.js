import apiClient from './ApiClient';
import Qs from 'qs';

class MessageUtil {
  /**
   * Get unread messages for the current user
   * @returns {Promise} API response with unread messages
   */
  static async getUnreadMessages() {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { data: { code: 0, message: "[]" } };
      }

      const response = await apiClient({
        url: '/messages/unread',
        method: 'get',
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      return { data: { code: -1, message: 'Failed to fetch unread messages' } };
    }
  }

  /**
   * Mark messages as read
   * @param {string} type - Message type (single or group)
   * @param {string} userId - User ID for direct messages
   * @param {string} groupId - Group ID for group messages
   * @returns {Promise} API response
   */
  static async markAsRead(type, userId, groupId) {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { data: { code: 0, message: "Success" } };
      }

      let endpoint = '/messages/read';
      let data = {};
      
      if (type === 'single') {
        data.userId = userId;
        data.type = 'single';
      } else if (type === 'group') {
        data.groupId = groupId;
        data.type = 'group';
      } else {
        return { data: { code: -1, message: 'Invalid message type' } };
      }
      
      const response = await apiClient({
        url: endpoint,
        method: 'post',
        data,
      });
      
      return response;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return { data: { code: -1, message: 'Failed to mark messages as read' } };
    }
  }

  /**
   * Send a message
   * @param {Object} message - Message object
   * @param {string} message.type - Message type (single or group)
   * @param {string} message.receiverId - Recipient user ID (for direct messages)
   * @param {string} message.groupId - Group ID (for group messages)
   * @param {string} message.content - Message content
   * @returns {Promise} API response
   */
  static async sendMessage(message) {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { data: { code: 0, message: "Success" } };
      }

      const { type, receiverId, groupId, content } = message;
      
      if (!type || !content) {
        return { data: { code: -1, message: 'Missing required fields' } };
      }
      
      let endpoint = '/messages/send';
      let data = { type, content };
      
      if (type === 'single' && receiverId) {
        data.receiverId = receiverId;
      } else if (type === 'group' && groupId) {
        data.groupId = groupId;
      } else {
        return { data: { code: -1, message: 'Invalid message data' } };
      }
      
      const response = await apiClient({
        url: endpoint,
        method: 'post',
        data,
      });
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return { data: { code: -1, message: 'Failed to send message' } };
    }
  }

  /**
   * Get message history for a conversation
   * @param {string} type - Conversation type (single or group)
   * @param {string} userId - User ID for direct messages
   * @param {string} groupId - Group ID for group messages
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of messages per page
   * @returns {Promise} API response
   */
  static async getMessageHistory(type, userId, groupId, page = 1, limit = 20) {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { data: { code: 0, message: "[]" } };
      }

      let endpoint = '/messages/history';
      let params = { page, limit, type };
      
      if (type === 'single' && userId) {
        params.userId = userId;
      } else if (type === 'group' && groupId) {
        params.groupId = groupId;
      } else {
        return { data: { code: -1, message: 'Invalid message query parameters' } };
      }
      
      const response = await apiClient({
        url: endpoint,
        method: 'get',
        params,
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching message history:', error);
      return { data: { code: -1, message: 'Failed to fetch message history' } };
    }
  }

  /**
   * Delete a message
   * @param {string} messageId - Message ID
   * @returns {Promise} API response
   */
  static async deleteMessage(messageId) {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { data: { code: 0, message: "Success" } };
      }

      if (!messageId) {
        return { data: { code: -1, message: 'Missing message ID' } };
      }
      
      const response = await apiClient({
        url: `/messages/${messageId}`,
        method: 'delete',
      });
      
      return response;
    } catch (error) {
      console.error('Error deleting message:', error);
      return { data: { code: -1, message: 'Failed to delete message' } };
    }
  }

  /**
   * Get all contacts for the current user
   * @returns {Promise} API response
   */
  static async getContacts() {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { data: { code: 0, message: "[]" } };
      }

      const response = await apiClient({
        url: '/contacts',
        method: 'get',
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return { data: { code: -1, message: 'Failed to fetch contacts' } };
    }
  }
}

export default MessageUtil; 