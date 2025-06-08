import Dexie from 'dexie';

// Database schema definition
 class ChatDatabase extends Dexie {
    constructor() {
        super('ChatDatabase');
        this.version(1).stores({
            settings: 'key, value',
            contacts: '[type+userId], userId, type, timestamp',
            messages: '&messageId,[type+receiverId], [type+groupId], [type+receiverId+sessionMessageId]',
            unreadMessages: '[type+senderId], [type+groupId], userId, senderId, sessionMessageId, messageId'
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

static async addRecentContacts(messages) {
    if (!messages || messages.length === 0) {
        return [];
    }

    try {
        for (const message of messages) {
            const userId = message.senderId || message.userId;
            const type = message.type;
            const key = [type, userId]; // 用于索引查找

            const existing = await db.contacts.get(key);

            if (existing) {
                await db.contacts.update(key, {
                    name: message.name || existing.name,
                    avatar: message.avatar || existing.avatar,
                    content: message.content || existing.content,
                    timestamp: message.sendTime || Date.now(),
                    count: (existing.count || 0) + 1,
                });
            } else {
                await db.contacts.add({
                    userId,
                    name: message.name || "",
                    avatar: message.avatar || "",
                    type,
                    timestamp: message.sendTime || Date.now(),
                    content: message.content || "",
                    count: message.count || 1,
                });
            }
        }
    } catch (error) {
        console.error('Error adding recent contacts:', error);
        return null;
    }
}
    static async initRecentContacts(messages) {
        if (!messages || messages.length === 0) {
            return [];
        }
        
        try {
            //console.log(messages[0].senderId, messages[0].type);
            const contactList = messages.map(message => ({
                userId: message.senderId || message.userId,
                name: message.name||"",
                avatar: message.avatar||"",
                type: message.type,
                timestamp: message.sendTime|| Date.now(),
                content: message.content||"",
                count: message.count || 0
            }));

            await db.contacts.bulkPut(contactList); // 批量 upsert
        } catch (error) {
            console.error('Error adding recent contacts:', error);
            return null;
        }
    }

    static async deleteRecentContact(type, id) {
        try {
            await db.contacts
                .where('[type+userId]')
                .equals([type, id])
                .delete(); // 直接批量删除所有匹配项
        } catch (error) {
            console.error('Error deleting recent contact:', error);
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

    // static async addRemain(type, id, count) {
    //     try {
    //         const contact = await db.contacts
    //             .where('[userId+type]')
    //             .equals([id, type])
    //             .first();
            
    //         if (contact) {
    //             await db.contacts.put({
    //                 ...contact,
    //                 remain: (contact.remain || 0) + count
    //             });
    //         }
            
    //         return this.getRecentContacts();
    //     } catch (error) {
    //         console.error('Error adding remain count:', error);
    //         return [];
    //     }
    // }

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


    //Message history management
    // static async batchAddContactHistory(messages) {
    //     try {
    //         let timestamp = -1;
    //         console.log(messages);
            
    //         await db.transaction('rw', db.messages, db.contacts, async () => {
    //             for (const message of messages) {
    //                 console.log(message);
    //                 timestamp = Math.max(new Date(message.time).getTime(), timestamp);
    //                 await this.addContactHistory(message);
    //             }
    //         });
            
    //         await this.updateTimestamp(timestamp);
    //         return true;
    //     } catch (error) {
    //         console.error('Error batch adding contact history:', error);
    //         return false;
    //     }
    // }

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
                    .orderBy('sessionMessageId')
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




    // static async addMessage(message) {
    //     try {
    //         await this.addContactHistory(message);
    //         //await this.addMailbox(message);
    //         return true;
    //     } catch (error) {
    //         console.error('Error adding message:', error);
    //         return false;
    //     }
    // }



    static async insertUnreadMessages(unreadMessages) {
        try {
            const dataToInsert = await Promise.all(unreadMessages.map(async (unreadMessage) => {
                const key = `${unreadMessage.type}+${unreadMessage.senderId}`;

                // 查询是否存在已读消息
                const existing = await db.unreadMessages
                    .where('[type+senderId]')
                    .equals([unreadMessage.type, unreadMessage.senderId])
                    .first();

                const previousCount = existing?.count || 0;

                return {
                    userId: unreadMessage.userId,
                    senderId: unreadMessage.senderId,
                    sessionMessageId: unreadMessage.sessionMessageId,
                    type: unreadMessage.type,
                    messageType: unreadMessage.messageType,
                    content: unreadMessage.content,
                    messageId: unreadMessage.messageId,
                    count: previousCount + 1, // 累加
                    sendTime: unreadMessage.sendTime
                        ? new Date(unreadMessage.sendTime).getTime()
                        : Date.now()
                };
            }));

            await db.unreadMessages.bulkPut(dataToInsert);
            return true;
        } catch (error) {
            console.error('Error adding unread messages:', error);
            return false;
        }
    }


        static async initUnreadMessages(unreadMessages) {
        try {
            const dataToInsert = await Promise.all(unreadMessages.map(async (unreadMessage) => {
                const key = `${unreadMessage.type}+${unreadMessage.senderId}`;
                return {
                    userId: unreadMessage.userId,
                    senderId: unreadMessage.senderId,
                    sessionMessageId: unreadMessage.sessionMessageId,
                    type: unreadMessage.type,
                    messageType: unreadMessage.messageType,
                    content: unreadMessage.content,
                    messageId: unreadMessage.messageId,
                    count: unreadMessage.count, // 累加
                    sendTime: unreadMessage.sendTime
                        ? new Date(unreadMessage.sendTime).getTime()
                        : Date.now()
                };
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
                console.log(unreadMessages);
                console.log("unreadMessages", unreadMessages);
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


    static async addContactHistories(messages) {
        try {
            if (!Array.isArray(messages) || messages.length === 0) {
                return;
            }

            const messageDataList = [];

            for (const message of messages) {
                if ((!message.receiverId && !message.groupId) || !message.type) {
                    continue; // skip invalid message
                }

                const messageData = {
                    ...message,
                    messageId: message.id || message.messageId,
                    timestamp: message.time ? new Date(message.time).getTime() : Date.now()
                };

                messageDataList.push(messageData);
            }

            if (messageDataList.length > 0) {
                await db.messages.bulkPut(messageDataList); // Use bulkPut for efficiency
            }

            return true;
        } catch (error) {
            console.error('Error adding contact histories:', error);
            return false;
        }
    }


    static changeCountOfRecentContact(type, id, count) {
        return db.contacts
            .where('[type+userId]')
            .equals([type, id])
            .modify(contact => {
                contact.count = count;
            });
    }
    
    static async deleteUnreadMessage(type, senderId) {
        try {
            console.log(`Deleting unread message for type: ${type}, senderId: ${senderId}`);
            const deletedCount = await db.unreadMessages
                .where('[type+senderId]')
                .equals([type, senderId])
                .delete();
                
            console.log(`Deleted ${deletedCount} messages`);
            return deletedCount > 0;
        } catch (error) {
            console.error('Error deleting unread message:', error);
            return false;
        }
    }

static async addCountToRecentContact(type, id,timestamp) {
    try {
        const contact = await db.contacts.get({ type, userId: id });

        if (contact) {
            const newCount = (contact.count === 0 || contact.count == null)
                ? 1
                : contact.count + 1;

            await db.contacts.update([type, id], {
                count: newCount,
                timestamp: timestamp || Date.now(), // 可选更新时间
            });
        } else {
            // 如果找不到，是否新建？视业务逻辑而定，这里暂不处理
            console.warn('Contact not found:', type, id);
        }
    } catch (error) {
        console.error('Failed to update count:', error);
    }
}
}