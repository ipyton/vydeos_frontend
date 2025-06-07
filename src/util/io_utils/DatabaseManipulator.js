import Dexie from 'dexie';

// Database schema definition
 class ChatDatabase extends Dexie {
    constructor() {
        super('ChatDatabase');
        this.version(1).stores({
            settings: 'key, value',
            contacts: '[userId+type], userId, type, timestamp',
            messages: '&messageId,[type+receiverId], [type+groupId], [type+receiverId+sessionMessageId]',
            unreadMessages: '[type+senderId],[type+groupId], userId, senderId, sessionMessageId, messageId'
        });

        // Add hooks for auto-updating timestamps
        this.messages.hook('creating', (primKey, obj, trans) => {
            if (obj.time) {
                obj.timestamp = new Date(obj.time).getTime();
            }
        });

        // this.mailbox.hook('creating', (primKey, obj, trans) => {
        //     if (obj.time) {
        //         obj.timestamp = new Date(obj.time).getTime();
        //     }
        // });

        this.unreadMessages.hook('creating', (primKey, obj, trans) => {
            if (obj.sendTime) {
                obj.timestamp = new Date(obj.sendTime).getTime();
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

    static async clearUnreadMessages() {
        try {
            await db.unreadMessages.clear();
            console.log("All unread messages cleared.");
        } catch (error) {
            console.error("Failed to clear unread messages:", error);
        }
    }

    static async getTimestamp() {
        const result = await db.settings.get('timestamp');
        return result ? result.value : null;
    }

    // Contact management
    static async addRecentContacts(messages) {
        if (!messages || messages.length === 0) {
            return [];
        }

        try {
            const contactList = messages.map(message => ({
                userId: message.senderId,
                name: message.name,
                avatar: message.avatar,
                type: message.type,
                timestamp: message.sendTime,
                content: message.content,
                count: message.count || 0
            }));

            await db.contacts.bulkPut(contactList); // 批量 upsert
        } catch (error) {
            console.error('Error adding recent contacts:', error);
            return null;
        }
    }

    static async deleteRecentContact(type,id) {
        try {
            const contact = await db.contacts
                .where('[userId+type]')
                .equals([id, type])
                .first();
            
            if (contact) {
                await db.contacts.delete(contact.id);
            }
            
            //return this.getRecentContacts();
        } catch (error) {
            console.error('Error deleting recent contact:', error);
            //return [];
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

    static async getContactHistory(type, receiverId, limit = 15, offset = 0) {
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



    static async markAsRead(messageId, type, receiverId) {

    }

    static async addMessage(message) {
        try {
            await this.addContactHistory(message);
            //await this.addMailbox(message);
            return true;
        } catch (error) {
            console.error('Error adding message:', error);
            return false;
        }
    }

    static async insertUnreadMessages(unreadMessages) {
        try {
            const dataToInsert = unreadMessages.map((unreadMessage) => ({
                userId: unreadMessage.userId,
                senderId: unreadMessage.senderId,
                sessionMessageId: unreadMessage.sessionMessageId,
                type: unreadMessage.type,
                messageType: unreadMessage.messageType,
                content: unreadMessage.content,
                messageId: unreadMessage.messageId,
                count: unreadMessage.count || 1,
                sendTime: unreadMessage.sendTime
                    ? new Date(unreadMessage.sendTime).getTime()
                    : Date.now()
            }));
            await db.unreadMessages.bulkPut(dataToInsert);
            return true;
        } catch (error) {
            console.error('Error adding unread messages:', error);
            return false;
        }
    }
    
    static async countAllUnreadMessages() {
        let total = 0;
        try {
            await db.unreadMessages.each(msg => {
                total += (msg.count || 0);
            });
            return total;
        } catch (error) {
            console.error("Failed to calculate total unread count:", error);
            return 0;
        }
    }

    static async getUnreadMessages(limit = 5, offset = 0) {
        try {
            return db.unreadMessages
                .orderBy('messageId')
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
            return db.unreadMessages
                .where('[userId+type+senderId]')
                .equals([userId, type, senderId])
                .first();
        } catch (error) {
            console.error('Error getting unread messages by sender:', error);
            return null;
        }
    }

    static async updateUnreadMessageCount(userId, type, senderId, count) {
        try {
            const unreadMessage = await db.unreadMessages
                .where('[userId+type+senderId]')
                .equals([userId, type, senderId])
                .first();

            if (unreadMessage) {
                await db.unreadMessages.put({
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


    static async getTotalUnreadCount() {
        try {
            const unreadMessages = await db.unreadMessages
                .toArray();
            
            return unreadMessages.reduce((total, unread) => total + (unread.count || 0), 0);
        } catch (error) {
            console.error('Error getting total unread count:', error);
            return 0;
        }
    }

    static async getUnreadCountByType(type, userId) {
        try {
            const unreadMessages = await db.unreadMessages
                .where('userId')
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
    static changeCountOfRecentContact(type, id, count) {
        return db.contacts
            .where('[userId+type]')
            .equals([id, type])
            .modify(contact => {
                contact.count = count;
            });
    }
    
    static async deleteUnreadMessage(type, senderId) {
        try {
            const unreadMessage = await db.unreadMessages
                .where('[type+senderId]')
                .equals([type, senderId])
                .first();
            
            if (unreadMessage) {
                await db.unreadMessages.delete(unreadMessage.id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting unread message:', error);
            return false;
        }
    }

}