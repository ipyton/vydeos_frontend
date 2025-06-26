/**
 * DatabaseManipulator.js
 * Utility class for handling client-side database operations
 * Uses Dexie.js (IndexedDB wrapper) for storage
 */

// Only import Dexie on the client side
let Dexie = null;

// Handle dynamic import of Dexie
const importDexie = async () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!Dexie) {
    Dexie = (await import('dexie')).default;
  }
  
  return Dexie;
};

class DatabaseManipulator {
  /**
   * Initialize the database and create necessary stores
   * @returns {Promise<Dexie>} - Dexie database instance
   */
  static async getDatabase() {
    try {
      const dexie = await importDexie();
      if (!dexie) return null;
      
      const db = new dexie('BlogDatabase');
      
      db.version(1).stores({
        messages: '++id, senderId, receiverId, timestamp, read, content, type, groupId',
        contacts: 'id, name, avatar, lastMessage, lastMessageTime, unreadCount',
        posts: '++id, authorId, title, content, publishDate, likes, comments',
        settings: 'key',
        unreadMessages: '++id, senderId, receiverId, timestamp, content, type, groupId',
        contactHistories: '++id, senderId, receiverId, timestamp, content, type, groupId'
      });
      
      return db;
    } catch (error) {
      console.error('Error initializing database:', error);
      return null;
    }
  }
  
  /**
   * Add unread messages to the database
   * @param {Array} messages - Array of message objects
   * @returns {Promise<boolean>} - Success status
   */
  static async insertUnreadMessages(messages) {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      await db.unreadMessages.bulkAdd(messages);
      return true;
    } catch (error) {
      console.error('Error inserting unread messages:', error);
      return false;
    }
  }
  
  /**
   * Initialize unread messages in the database
   * @param {Array} messages - Array of message objects
   * @returns {Promise<boolean>} - Success status
   */
  static async initUnreadMessages(messages) {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      await db.unreadMessages.clear();
      if (messages && messages.length > 0) {
        await db.unreadMessages.bulkAdd(messages);
      }
      return true;
    } catch (error) {
      console.error('Error initializing unread messages:', error);
      return false;
    }
  }
  
  /**
   * Clear all unread messages from the database
   * @returns {Promise<boolean>} - Success status
   */
  static async clearUnreadMessages() {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      await db.unreadMessages.clear();
      return true;
    } catch (error) {
      console.error('Error clearing unread messages:', error);
      return false;
    }
  }
  
  /**
   * Delete a specific unread message
   * @param {string} type - Message type (single or group)
   * @param {string} groupId - Group ID (for group messages)
   * @param {string} userId - User ID (for single messages)
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteUnreadMessage(type, groupId, userId) {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      if (type === 'single') {
        await db.unreadMessages.where('senderId').equals(userId).delete();
      } else if (type === 'group') {
        await db.unreadMessages.where('groupId').equals(groupId).delete();
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting unread message:', error);
      return false;
    }
  }
  
  /**
   * Add contact histories to the database
   * @param {Array} histories - Array of contact history objects
   * @returns {Promise<boolean>} - Success status
   */
  static async addContactHistories(histories) {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      await db.contactHistories.bulkAdd(histories);
      return true;
    } catch (error) {
      console.error('Error adding contact histories:', error);
      return false;
    }
  }
  
  /**
   * Add recent contacts to the database
   * @param {Array} contacts - Array of contact objects
   * @returns {Promise<boolean>} - Success status
   */
  static async addRecentContacts(contacts) {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      for (const contact of contacts) {
        const { type, senderId, groupId, content, timestamp } = contact;
        
        if (type === 'single') {
          // Check if contact exists
          const existingContact = await db.contacts
            .where('id')
            .equals(senderId)
            .first();
          
          if (existingContact) {
            // Update existing contact
            await db.contacts.update(senderId, {
              lastMessage: content,
              lastMessageTime: timestamp,
              unreadCount: (existingContact.unreadCount || 0) + 1
            });
          } else {
            // Add new contact
            await db.contacts.add({
              id: senderId,
              name: contact.senderName || 'Unknown',
              avatar: contact.senderAvatar || '',
              lastMessage: content,
              lastMessageTime: timestamp,
              unreadCount: 1
            });
          }
        } else if (type === 'group') {
          // Handle group contacts
          const existingGroup = await db.contacts
            .where('id')
            .equals(`group_${groupId}`)
            .first();
          
          if (existingGroup) {
            // Update existing group
            await db.contacts.update(`group_${groupId}`, {
              lastMessage: content,
              lastMessageTime: timestamp,
              unreadCount: (existingGroup.unreadCount || 0) + 1
            });
          } else {
            // Add new group
            await db.contacts.add({
              id: `group_${groupId}`,
              name: contact.groupName || 'Group Chat',
              avatar: contact.groupAvatar || '',
              lastMessage: content,
              lastMessageTime: timestamp,
              unreadCount: 1,
              isGroup: true,
              groupId: groupId
            });
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error adding recent contacts:', error);
      return false;
    }
  }
  
  /**
   * Initialize recent contacts in the database
   * @param {Array} contacts - Array of contact objects
   * @returns {Promise<boolean>} - Success status
   */
  static async initRecentContacts(contacts) {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      // Don't clear existing contacts, just update them
      return await this.addRecentContacts(contacts);
    } catch (error) {
      console.error('Error initializing recent contacts:', error);
      return false;
    }
  }
  
  /**
   * Change the unread count for a contact
   * @param {string} type - Contact type (single or group)
   * @param {string} userId - User ID for single contacts
   * @param {string} groupId - Group ID for group contacts
   * @param {number} count - New unread count
   * @returns {Promise<boolean>} - Success status
   */
  static async changeCountOfRecentContact(type, userId, groupId, count) {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      if (type === 'single') {
        await db.contacts.update(userId, { unreadCount: count });
      } else if (type === 'group') {
        await db.contacts.update(`group_${groupId}`, { unreadCount: count });
      }
      
      return true;
    } catch (error) {
      console.error('Error changing count of recent contact:', error);
      return false;
    }
  }
  
  /**
   * Store a post to local database
   * @param {Object} post - Post object
   * @returns {Promise<boolean>} - Success status
   */
  static async storePost(post) {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      await db.posts.add(post);
      return true;
    } catch (error) {
      console.error('Error storing post:', error);
      return false;
    }
  }
  
  /**
   * Get all stored posts
   * @returns {Promise<Array>} - Array of post objects
   */
  static async getPosts() {
    try {
      const db = await this.getDatabase();
      if (!db) return [];
      
      return await db.posts.toArray();
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  }
  
  /**
   * Clear all data from database (for logout)
   * @returns {Promise<boolean>} - Success status
   */
  static async clearAllData() {
    try {
      const db = await this.getDatabase();
      if (!db) return false;
      
      await Promise.all([
        db.messages.clear(),
        db.contacts.clear(),
        db.posts.clear(),
        db.settings.clear(),
        db.unreadMessages.clear(),
        db.contactHistories.clear()
      ]);
      
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }
}

export default DatabaseManipulator; 