import Dexie from 'dexie';

// Database schema definition
 class ChatDatabase extends Dexie {
    constructor() {
        super('ChatDatabase');
        
        this.version(1).stores({
            settings: 'key, value',
            contacts: '[userId+type], userId, type, timestamp, remain, *tags',
            messages: 'messageId, [type+receiverId], [type+groupId], type, time, timestamp, *tags',
            mailbox: 'messageId, [type+receiverId], [type+groupId], type, time, timestamp, *tags',
            unread_messages: '[user_id+type+sender_id], user_id, sender_id, member_id, type, messageType, content, send_time, message_id, count'
        });

        // Add hooks for auto-updating timestamps
        this.messages.hook('creating', (primKey, obj, trans) => {
            if (obj.time) {
                obj.timestamp = new Date(obj.time).getTime();
            }
        });

        this.mailbox.hook('creating', (primKey, obj, trans) => {
            if (obj.time) {
                obj.timestamp = new Date(obj.time).getTime();
            }
        });

        this.unread_messages.hook('creating', (primKey, obj, trans) => {
            if (obj.send_time) {
                obj.timestamp = new Date(obj.send_time).getTime();
            }
        });
    }
}

const db = new ChatDatabase();

export default class DatabaseManipulator {
    
    // Settings management
    static async updateTimestamp(timestamp) {
        if (!timestamp || timestamp === -1) {
            return;
        }
        return db.settings.put({ key: 'timestamp', value: timestamp });
    }

    static async getTimestamp() {
        const result = await db.settings.get('timestamp');
        return result ? result.value : null;
    }

    // Contact management
    static async addRecentContact(contact) {
        try {
            // Use put() instead of add() to handle upsert behavior
            const newContact = {
                userId: contact.userId,
                name: contact.name,
                avatar: contact.avatar,
                type: contact.type,
                timestamp: Date.now(),
                remain: 0
            };

            // Check if contact exists to preserve remain count
            const existingContact = await db.contacts
                .where('[userId+type]')
                .equals([contact.userId, contact.type])
                .first();

            if (existingContact) {
                newContact.remain = existingContact.remain || 0;
            }

            await db.contacts.put(newContact);
            return this.getRecentContacts();
        } catch (error) {
            console.error('Error adding recent contact:', error);
            return null;
        }
    }

    static async contactComeFirst(type, id) {
        try {
            const contact = await db.contacts
                .where('[userId+type]')
                .equals([id, type])
                .first();
            
            if (contact) {
                await db.contacts.put({
                    ...contact,
                    timestamp: Date.now()
                });
            }
            
            return this.getRecentContacts();
        } catch (error) {
            console.error('Error moving contact to first:', error);
            return [];
        }
    }

    static async addRemain(type, id, count) {
        try {
            const contact = await db.contacts
                .where('[userId+type]')
                .equals([id, type])
                .first();
            
            if (contact) {
                await db.contacts.put({
                    ...contact,
                    remain: (contact.remain || 0) + count
                });
            }
            
            return this.getRecentContacts();
        } catch (error) {
            console.error('Error adding remain count:', error);
            return [];
        }
    }

    static async setRemain(type, id, count) {
        try {
            const contact = await db.contacts
                .where('[userId+type]')
                .equals([id, type])
                .first();
            
            if (contact) {
                await db.contacts.put({
                    ...contact,
                    remain: count
                });
            }
            
            return this.getRecentContacts();
        } catch (error) {
            console.error('Error setting remain count:', error);
            return [];
        }
    }

    static async getRemain(type, id) {
        try {
            const contact = await db.contacts
                .where('[userId+type]')
                .equals([id, type])
                .first();
            
            return contact ? contact.remain : -1;
        } catch (error) {
            console.error('Error getting remain count:', error);
            return -1;
        }
    }

    static async getTotalRemain() {
        try {
            const contacts = await db.contacts.toArray();
            return contacts.reduce((total, contact) => total + (contact.remain || 0), 0);
        } catch (error) {
            console.error('Error getting total remain:', error);
            return 0;
        }
    }

    static async getRecentContactByTypeAndId(type, id) {
        try {
            return db.contacts
                .where('[userId+type]')
                .equals([id, type])
                .first();
        } catch (error) {
            console.error('Error getting recent contact:', error);
            return null;
        }
    }

    static async getRecentContacts(limit = 50, offset = 0) {
        try {
            return db.contacts
                .orderBy('timestamp')
                .reverse()
                .offset(offset)
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting recent contacts:', error);
            return [];
        }
    }

    static async setRecentContact(recentContact) {
        try {
            const contact = await db.contacts
                .where('[userId+type]')
                .equals([recentContact.userId, recentContact.type])
                .first();
            
            if (contact) {
                await db.contacts.put({
                    ...contact,
                    timestamp: recentContact.timestamp,
                    remain: recentContact.remain
                });
            }
            
            return this.getRecentContacts();
        } catch (error) {
            console.error('Error setting recent contact:', error);
            return [];
        }
    }

    // Message history management
    static async batchAddContactHistory(messages) {
        try {
            let timestamp = -1;
            console.log(messages);
            
            await db.transaction('rw', db.messages, db.contacts, async () => {
                for (const message of messages) {
                    console.log(message);
                    timestamp = Math.max(new Date(message.time).getTime(), timestamp);
                    await this.addContactHistory(message);
                }
            });
            
            await this.updateTimestamp(timestamp);
            return true;
        } catch (error) {
            console.error('Error batch adding contact history:', error);
            return false;
        }
    }

    static async addContactHistory(message) {
        try {
            console.log(message);
            
            if ((!message.receiverId && !message.groupId) || !message.type) {
                return;
            }

            const receiverId = message.groupId ? message.groupId : message.receiverId;
            
            const messageData = {
                ...message,
                messageId: message.id || message.messageId,
                timestamp: message.time ? new Date(message.time).getTime() : Date.now()
            };

            // Use put() to handle duplicates automatically based on messageId
            await db.messages.put(messageData);

            // Update contact info
            const recentContact = await this.getRecentContactByTypeAndId(message.type, receiverId);
            if (recentContact && message.time) {
                const timestamp = new Date(message.time).getTime();
                const updatedTimestamp = Math.max(timestamp, recentContact.timestamp || 0);
                
                await db.contacts.put({
                    ...recentContact,
                    timestamp: updatedTimestamp
                });
            }

            // Update remain count and move contact to first
            await this.addRemain(message.type, receiverId, 1);
            await this.contactComeFirst(message.type, receiverId);

            return true;
        } catch (error) {
            console.error('Error adding contact history:', error);
            return false;
        }
    }

    static async getContactHistory(type, receiverId, limit = 50, offset = 0) {
        try {
            console.log(`Getting contact history for type: ${type}, receiverId: ${receiverId}, limit: ${limit}, offset: ${offset}`);
            let messages;

            if (type === 'group') {
                messages = await db.messages
                    .orderBy('messageId')
                    .filter(message => message.type === type && message.groupId === receiverId)
                    .offset(offset)
                    .limit(limit)
                    .toArray();
            } else {
                messages = await db.messages
                    .orderBy('messageId')
                    .filter(message => message.type === type && message.receiverId === receiverId)
                    .offset(offset)
                    .limit(limit)
                    .toArray();
            }

            return messages;

        } catch (error) {
            console.error('Error getting contact history:', error);
            return [];
        }
    }

    static async getContactHistoryCount(type, receiverId) {
        try {
            if (type === 'group') {
                return db.messages
                    .where('[type+groupId]')
                    .equals([type, receiverId])
                    .count();
            } else {
                return db.messages
                    .where('[type+receiverId]')
                    .equals([type, receiverId])
                    .count();
            }
        } catch (error) {
            console.error('Error getting contact history count:', error);
            return 0;
        }
    }

    // Mailbox management
    static async addMailbox(message) {
        try {
            if (!message.receiverId || !message.type) {
                return;
            }

            const mailboxData = {
                ...message,
                messageId: message.id || message.messageId,
                timestamp: message.time ? new Date(message.time).getTime() : Date.now()
            };

            // Use put() to handle duplicates automatically based on messageId
            await db.mailbox.put(mailboxData);
            return true;
        } catch (error) {
            console.error('Error adding to mailbox:', error);
            return false;
        }
    }

    static async getMailbox(type, receiverId, limit = 50, offset = 0) {
        try {
            if (type === 'group') {
                return db.mailbox
                    .where('[type+groupId]')
                    .equals([type, receiverId])
                    .reverse()
                    .offset(offset)
                    .limit(limit)
                    .toArray();
            } else {
                return db.mailbox
                    .where('[type+receiverId]')
                    .equals([type, receiverId])
                    .reverse()
                    .offset(offset)
                    .limit(limit)
                    .toArray();
            }
        } catch (error) {
            console.error('Error getting mailbox:', error);
            return [];
        }
    }

    static async getMailboxCount(type, receiverId) {
        try {
            if (type === 'group') {
                return db.mailbox
                    .where('[type+groupId]')
                    .equals([type, receiverId])
                    .count();
            } else {
                return db.mailbox
                    .where('[type+receiverId]')
                    .equals([type, receiverId])
                    .count();
            }
        } catch (error) {
            console.error('Error getting mailbox count:', error);
            return 0;
        }
    }

    static async deleteMailbox(messageId, type, receiverId) {
        try {
            const query = db.mailbox
                .where('messageId').equals(messageId)
                .and(msg => msg.type === type);
            
            let filteredQuery;
            if (type === 'group') {
                filteredQuery = query.and(msg => msg.groupId === receiverId);
            } else {
                filteredQuery = query.and(msg => msg.receiverId === receiverId);
            }

            await filteredQuery.delete();
            return true;
        } catch (error) {
            console.error('Error deleting from mailbox:', error);
            return false;
        }
    }

    static async addMessage(message) {
        try {
            await this.addContactHistory(message);
            await this.addMailbox(message);
            return true;
        } catch (error) {
            console.error('Error adding message:', error);
            return false;
        }
    }

    // Unread messages management
    static async addUnreadMessage(unreadMessage) {
        try {
            const unreadData = {
                user_id: unreadMessage.user_id,
                sender_id: unreadMessage.sender_id,
                member_id: unreadMessage.member_id,
                type: unreadMessage.type,
                messageType: unreadMessage.messageType,
                content: unreadMessage.content,
                send_time: unreadMessage.send_time,
                message_id: unreadMessage.message_id,
                count: unreadMessage.count || 1,
                timestamp: unreadMessage.send_time ? new Date(unreadMessage.send_time).getTime() : Date.now()
            };

            // Check if unread message already exists
            const existingUnread = await db.unread_messages
                .where('[user_id+type+sender_id]')
                .equals([unreadMessage.user_id, unreadMessage.type, unreadMessage.sender_id])
                .first();

            if (existingUnread) {
                // Update existing unread message
                await db.unread_messages.put({
                    ...unreadData,
                    count: existingUnread.count + (unreadMessage.count || 1)
                });
            } else {
                // Add new unread message
                await db.unread_messages.put(unreadData);
            }

            return true;
        } catch (error) {
            console.error('Error adding unread message:', error);
            return false;
        }
    }

    static async getUnreadMessages(userId, limit = 50, offset = 0) {
        try {
            return db.unread_messages
                .where('user_id')
                .equals(userId)
                .orderBy('timestamp')
                .reverse()
                .offset(offset)
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting unread messages:', error);
            return [];
        }
    }

    static async getUnreadMessagesBySender(userId, type, senderId) {
        try {
            return db.unread_messages
                .where('[user_id+type+sender_id]')
                .equals([userId, type, senderId])
                .first();
        } catch (error) {
            console.error('Error getting unread messages by sender:', error);
            return null;
        }
    }

    static async updateUnreadMessageCount(userId, type, senderId, count) {
        try {
            const unreadMessage = await db.unread_messages
                .where('[user_id+type+sender_id]')
                .equals([userId, type, senderId])
                .first();

            if (unreadMessage) {
                await db.unread_messages.put({
                    ...unreadMessage,
                    count: count
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating unread message count:', error);
            return false;
        }
    }

    static async clearUnreadMessages(userId, type, senderId) {
        try {
            await db.unread_messages
                .where('[user_id+type+sender_id]')
                .equals([userId, type, senderId])
                .delete();
            return true;
        } catch (error) {
            console.error('Error clearing unread messages:', error);
            return false;
        }
    }

    static async getTotalUnreadCount(userId) {
        try {
            const unreadMessages = await db.unread_messages
                .where('user_id')
                .equals(userId)
                .toArray();
            
            return unreadMessages.reduce((total, unread) => total + (unread.count || 0), 0);
        } catch (error) {
            console.error('Error getting total unread count:', error);
            return 0;
        }
    }

    static async getUnreadCountByType(userId, type) {
        try {
            const unreadMessages = await db.unread_messages
                .where('user_id')
                .equals(userId)
                .filter(unread => unread.type === type)
                .toArray();
            
            return unreadMessages.reduce((total, unread) => total + (unread.count || 0), 0);
        } catch (error) {
            console.error('Error getting unread count by type:', error);
            return 0;
        }
    }

    // Utility methods for paging
    static async searchMessages(searchTerm, limit = 50, offset = 0) {
        try {
            return db.messages
                .filter(msg => 
                    msg.content && msg.content.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .offset(offset)
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error searching messages:', error);
            return [];
        }
    }

    static async getMessagesByDateRange(startDate, endDate, limit = 50, offset = 0) {
        try {
            const startTimestamp = new Date(startDate).getTime();
            const endTimestamp = new Date(endDate).getTime();

            return db.messages
                .where('timestamp')
                .between(startTimestamp, endTimestamp)
                .offset(offset)
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting messages by date range:', error);
            return [];
        }
    }

    // Database maintenance
    static async clearOldMessages(daysToKeep = 30) {
        try {
            const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
            
            await db.transaction('rw', db.messages, db.mailbox, db.unread_messages, async () => {
                await db.messages.where('timestamp').below(cutoffDate).delete();
                await db.mailbox.where('timestamp').below(cutoffDate).delete();
                await db.unread_messages.where('timestamp').below(cutoffDate).delete();
            });
            
            return true;
        } catch (error) {
            console.error('Error clearing old messages:', error);
            return false;
        }
    }

    static async getDatabaseStats() {
        try {
            const [contactCount, messageCount, mailboxCount, unreadCount] = await Promise.all([
                db.contacts.count(),
                db.messages.count(),
                db.mailbox.count(),
                db.unread_messages.count()
            ]);

            return {
                contacts: contactCount,
                messages: messageCount,
                mailbox: mailboxCount,
                unread_messages: unreadCount
            };
        } catch (error) {
            console.error('Error getting database stats:', error);
            return { contacts: 0, messages: 0, mailbox: 0, unread_messages: 0 };
        }
    }
}