import Dexie from 'dexie';

// Database schema definition
class ChatDatabase extends Dexie {
    constructor() {
        super('ChatDatabase');
        this.version(1).stores({
            settings: 'key, value',
            contacts: '&[type+groupId+userId], type, timestamp',
            messages: '&messageId, [type+userId1+userId2+sessionMessageId], [type+userId1+userId2], [type+groupId],[type+groupId+sessionMessageId]',
            unreadMessages: '&[type+groupId+senderId], userId, senderId, sessionMessageId, messageId'
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

function compareStrings(str1, str2) {
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        throw new Error('Both inputs must be strings');
    }

    if (str1 < str2) {
        return { smaller: str1, larger: str2 };
    } else {
        return { smaller: str2, larger: str1 };
    }
}

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
    console.log("addRecentContacts")
    console.log(messages)
    try {
        for (const message of messages) {
            const userId = message.senderId || message.userId || "";
            const type = message.type;      
            const groupId = message.groupId || 0; // Handle undefined groupId
            
            if (type === "single") {
                // Create consistent key format
                    const keyArray = [type, groupId, userId];
                
                    const existing = await db.contacts.get(keyArray);
                    if (existing) {
                        await db.contacts.update(keyArray, {
                            name: message.name || existing.name,
                            avatar: message.avatar || existing.avatar,
                            content: message.content || existing.content,
                            timestamp: message.sendTime || message.timestamp || existing.timestamp || Date.now(),
                            count: message.count !== undefined ? message.count : ((existing.count || 0) + 1),
                            sessionMessageId: message.sessionMessageId || existing.sessionMessageId || -1
                        });
                    } else {
                        await db.contacts.add({
                            userId,
                            groupId, // Include groupId
                            name: message.name || "",
                            avatar: message.avatar || "",
                            type,
                            timestamp: message.sendTime || message.timestamp || Date.now(),
                            content: message.content || "",
                            count: message.count || 1,
                            sessionMessageId: message.sessionMessageId || -1
                        });
                    }

                
            } else if (type === "group") {
                    const keyArray = [type, groupId, ""];
                
                    const existing = await db.contacts.get(keyArray);

                    if (existing) {
                        console.log(message)
                        console.log(existing)
                        await db.contacts.update(keyArray, {
                            userId:"",
                            name: message.name || existing.name,
                            avatar: message.avatar || existing.avatar,
                            content: (message.userId+ ": " + message.content) || existing.content,
                            timestamp: message.sendTime || message.timestamp || existing.timestamp || Date.now(),
                            count: message.count !== undefined ? message.count : ((existing.count || 0) + 1),
                            sessionMessageId: message.sessionMessageId || existing.sessionMessageId || -1
                        });
                    } else {
                        await db.contacts.add({
                            groupId,
                            userId:"",
                            name: message.name || "",
                            avatar: message.avatar || "",
                            type,
                            timestamp: message.sendTime || message.timestamp || Date.now(),
                            content: userId + ": " +  message.content || "",
                            count: message.count || 1,
                            sessionMessageId: message.sessionMessageId || -1
                        });
                    }
                
            }
        }
    } catch (error) {
        console.error('Error adding recent contacts:', error);
        return null;
    }
}


    static async initRecentContacts(messages) {
        console.log("initRecentContacts")
        console.log(messages)
        if (!messages || messages.length === 0) {
            return [];
        }

        try {
            // Create compound keys based on contact type
            const compoundKeys = messages
                .filter(msg => msg.type && (msg.senderId || msg.userId || msg.groupId))
                .map(msg => {
                    if (msg.type === 'group') {
                        return [msg.type, msg.groupId];
                    } else {
                        // Single/direct contact
                        return [msg.type, 0,msg.senderId || msg.userId];
                    }
                })
                .filter(key => key[1]); // Remove entries where second part is undefined

            const existingContacts = await db.contacts.bulkGet(compoundKeys);

            // Create a map using compound key string for O(1) lookup
            const existingContactsMap = new Map();
            existingContacts.forEach(contact => {
                if (contact) {
                    const key = contact.type === 'group'
                        ? `${contact.type}:${contact.groupId}`
                        : `${contact.type}:${contact.userId}`;
                    existingContactsMap.set(key, contact);
                }
            });

            const contactList = messages
                .filter(message => {
                    const type = message.type;
                    if (type === 'group') {
                        return message.groupId; // Group must have groupId
                    } else {
                        return message.senderId || message.userId; // Single must have userId
                    }
                })
                .map(message => {
                    const type = message.type;
                    const isGroup = type === 'group';
                    const id = isGroup ? message.groupId : (message.senderId || message.userId);
                    const key = `${type}:${id}`;
                    const existing = existingContactsMap.get(key) || {};

                    const contact = {
                        userId: isGroup? "":message.userId || message.senderId,
                        type: type,
                        timestamp: message.sendTime ?? existing.timestamp ?? Date.now(),
                        name: message.name ?? existing.name ?? "",
                        avatar: message.avatar ?? existing.avatar ?? "",
                        content: message.content ?? existing.content ?? "",
                        count: message.hasOwnProperty('count') ? message.count : (existing.count ?? 0),
                        sessionMessageId: message.sessionMessageId ?? existing.sessionMessageId ?? -1,
                        groupId:message.groupId || 0
                    };


                    return contact;
                });
                console.log(contactList)
            if (contactList.length > 0) {
                await db.contacts.bulkPut(contactList);
            }

            return contactList;
        } catch (error) {
            console.error('Error adding recent contacts:', error);
            return [];
        }
    }

    static async getNewestSessionMessageId(type, userId,groupId) {
        if (!userId) userId =""
        if (!groupId) groupId = 0
        try {
            
            if (type === "single") {
                const contact = await db.contacts.get({ type, groupId,userId });
                return contact ? contact.sessionMessageId || -1 : -1; // 返回 sessionMessageId 或 -1
            } else if (type === "group") {
                const contact = await db.contacts.get({ type, groupId });
                return contact ? contact.sessionMessageId || -1 : -1;
            }

        } catch (error) {
            console.error('Error getting newest session message ID:', error);
            return -1;
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

    static async deleteContactHistory(criteria) {
        try {
            const query = db.messages;
            let deletedCount = 0;

            if (criteria.type === 'group' && criteria.groupId) {
                // Delete all group messages with specific groupId
                deletedCount = await query
                    .where('[type+groupId]')
                    .equals(['group', criteria.groupId])
                    .delete();
            } else if (
                criteria.type === 'single' &&
                criteria.userId1 &&
                criteria.userId2
            ) {
                const result = DatabaseManipulator.compareStrings(criteria.userId1, criteria.userId2)
                const count = await query
                    .where('[type+userId1+userId2]')
                    .equals(['single', result.smaller, result.larger])
                    .delete();

                deletedCount = count;
            } else {
                console.error('No valid criteria provided');
                return false;
            }

            console.log(`Successfully deleted ${deletedCount} messages`);
            return true;
        } catch (error) {
            console.error('Error deleting messages by criteria:', error);
            return false;
        }
    }




    static async getRecentContactByTypeAndId(type, id, groupId) {
        try {
            if (!groupId) groupId = 0
            if (!id) id = ""
            return db.contacts
                .where('[type+groupId+userId]')
                .equals([type,groupId, id])
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


    static async addContactHistory(message) {
        try {

            if (
                (message.type === 'group' && (!message.groupId)) ||
                (message.type === 'single' && (!message.userId1 || !message.userId2)) ||
                !message.type
            ) {
                return;
            }
            
            const messageData = {
                ...message,
                messageId: message.id || message.messageId,
                timestamp: message.timestamp ? new Date(message.timestamp).getTime() : Date.now()
            };

            // Use put() to handle duplicates automatically based on messageId
            await db.messages.put(messageData);

            return true;
        } catch (error) {
            console.error('Error adding contact history:', error);
            return false;
        }
    }

    static async getContactHistory(type, senderId, beforeSessionMessageId = 0, limit = 15,groupId) {

        console.log({type, senderId, beforeSessionMessageId, limit, groupId})
        const own = localStorage.getItem("userId");
        try {
            let messages;

            if (type === 'group') {
                messages = await db.messages
                    .where('[type+groupId]')
                    .equals([type, groupId])
                    .and(msg => msg.sessionMessageId <= beforeSessionMessageId)
                    .reverse()
                    .limit(limit)
                    .toArray();

            } else {
                const result = compareStrings(own, senderId);

                messages = await db.messages
                    .where('[type+userId1+userId2]')
                    .equals([type, result.smaller, result.larger])
                    .and(msg => msg.sessionMessageId <= beforeSessionMessageId)
                    .reverse()
                    .limit(limit)
                    .toArray();
            }

            return messages.reverse(); // 从旧到新排序
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




    static async insertUnreadMessages(unreadMessages) {
        try {
            const dataToInsert = await Promise.all(unreadMessages.map(async (unreadMessage) => {

                // 查询是否存在已读消息
                const existing = await db.unreadMessages
                    .where('[type+groupId+senderId]')
                    .equals([unreadMessage.type, unreadMessage.type === "group" ? unreadMessage.groupId : 0, unreadMessage.type === "group" ?"":unreadMessage.senderId])
                    .first();

                const previousCount = existing?.count || 0;

                return {
                    userId: unreadMessage.userId,
                    groupId: unreadMessage.groupId || 0,
                    senderId:unreadMessage.type ==="group"? "":unreadMessage.senderId,
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
                        : Date.now(),
                        groupId: unreadMessage.type ==="group" ?  unreadMessage.groupId: 0
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
                if (
                    (message.type === 'group' && (!message.groupId || !message.userId)) ||
                    (message.type === 'single' && (!message.userId1 || !message.userId2)) ||
                    !message.type
                ) {
                    return;
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


    static changeCountOfRecentContact(type, userId,groupId, count) {
        console.log([type,userId,groupId,count])
        if (type === "group") {
        return db.contacts
            .where('[type+groupId+userId]')
            .equals([type,groupId,userId])
            .modify(contact => {
                console.log(contact)
                contact.count = count;
            });
        }else if (type === "single"){
        return db.contacts
            .where('[type+groupId+userId]')
            .equals([type,0, userId])
            .modify(contact => {
                contact.count = count;
            });
        }
    }

    static async deleteUnreadMessage(type, groupId, senderId) {
        try {
            const deletedCount = await db.unreadMessages
                .where('[type+groupId+senderId]')
                .equals([type, groupId,senderId])
                .delete();

            return deletedCount > 0;
        } catch (error) {
            console.error('Error deleting unread message:', error);
            return false;
        }
    }


}