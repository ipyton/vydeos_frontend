import localforage from "localforage";
import { update } from "../../components/redux/UserDetails";
export default class DatabaseManipulator {

    static async updateTimestamp(timestamp) {
        if (!timestamp || timestamp === -1) {
            return;
        }
        return localforage.setItem("timestamp", timestamp);
    }

    static async getTimestamp() {
        return localforage.getItem("timestamp");
    }

    static async addRecentContact(contact) {
        let res = await localforage.getItem("recent_contacts");
        if (!res) res = [];
        for (let i = 0; i < res.length; i++) {
            let ele = res[i];
            if (!ele || !ele.userId) {
                return;
            }
            if (ele.userId === contact.userId && ele.type === contact.type) {
                // already in the friends list. then put it in the first order.
                res = [res[i], ...res.slice(0, i), ...res.slice(i + 1)];
                localforage.setItem("recent_contacts", res);
                return res;
            }

        }
        // do not exist: add it to the first place.
        // and add user empty chat records
        if (contact.type === "group") {
            console.log(contact)
            res = [{ "userId": contact.userId, "name": contact.name, "avatar": contact.avatar, new: false, "type": "group", "remain":0}, ...res];
            console.log(res)
            localforage.setItem("group_" + contact.userId, []);
        } else if (contact.type === "single") {
            res = [{ "userId": contact.userId, "name": contact.name, "avatar": contact.avatar, new: false, "type": "single", "remain":0}, ...res];
            console.log(res)
            localforage.setItem("single_" + contact.userId, []);
        } else {
            return null;
        }
        // do not exist: add it to the first place.
        // and add user empty chat records
        localforage.setItem("recent_contacts", res);
        return res;
    }

    static async contactComeFirst(type, id) {
        let res = await localforage.getItem("recent_contacts");
        if (!res) res = [];
        for (let i = 0; i < res.length; i++) {
            let ele = res[i];
            if (!ele || !ele.userId) {
                return;
            }
            if (ele.userId === id && ele.type === type) {
                // already in the friends list. then put it in the first order.
                res = [res[i], ...res.slice(0, i), ...res.slice(i + 1)];
                localforage.setItem("recent_contacts", res);
                return res;
            }
        }
        localforage.setItem("recent_contacts", res);
        return res;
    }

    static addRemain(type, id, count) {
        return localforage.getItem("recent_contacts").then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].userId === id && res[i].type === type) {
                    res[i].remain += count
                }
            }
            localforage.setItem("recent_contacts", res)
            return res
        })
    }

    static setRemain(type, id, count) {
        return localforage.getItem("recent_contacts").then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].userId === id && res[i].type === type) {
                    res[i].remain = count
                }
            }
            localforage.setItem("recent_contacts", res)
            return res
        })
    }
    static getRemain(type, id){
        return localforage.getItem("recent_contacts").then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].userId === id && res[i].type === type) {
                    return res[i].remain
                }
            }
            return -1
        })
    }

    static getTotalRemain() {
        return localforage.getItem("recent_contacts").then(res => {
            let total = 0
            for (let i = 0; i < res.length; i++) {
                total += res[i].remain
            }
            return total
        })
    }

    static getRecentContactByTypeAndId(type, id) {
        return localforage.getItem("recent_contacts").then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].userId === id && res[i].type === type) {
                    return res[i]
                }
            }
            return null
        })
    }

    static getRecentContact() {
        return localforage.getItem("recent_contacts")
    }

    static async batchAddContactHistory(messages) {
        let result = null;
        let timestamp = -1;
        console.log(messages)
        for (let i = 0; i < messages.length; i++) {
            console.log(messages[i])
            timestamp = Math.max(new Date(messages[i].time).getTime(), timestamp);
            result = this.addContactHistory(messages[i])
        }
        this.updateTimestamp(timestamp)
        return result
    }


    static addContactHistory(message) {
        console.log(message)
        if ((!message.receiverId && !message.groupId) || !message.type) {
            return;    
        }
        const receiverId = message.groupId ? message.groupId : message.receiverId
        if (receiverId === localforage.getItem("userId")) {
            receiverId = message.senderId
        }
        return localforage.getItem(message.type + "_" + receiverId).then(res => {
            console.log("加入" + message.type + "_" + receiverId)
            if (!res) res = []
            res = [message, ...res]
            console.log(message)
            console.log(res)
            this.getRecentContactByTypeAndId(message.type, receiverId).then(recent_contact => {
                if (recent_contact && message.time) {
                    const timestamp = new Date(message.time).getTime();

                    console.log(timestamp + " +++++++" + recent_contact.timestamp)
                    recent_contact.timestamp = Math.max(timestamp,recent_contact.timestamp)
                    
                    this.setRecentContact(recent_contact)
                }
            })
            localforage.setItem(message.type + "_" + receiverId, res)
            this.addRemain(message.type, receiverId,1)
            this.contactComeFirst(message.type, receiverId)
            return res
        })
    }
    static setRecentContact(recent_contact) {
        return localforage.getItem("recent_contacts").then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].userId === recent_contact.userId && res[i].type === recent_contact.type) {
                    res[i].timestamp = recent_contact.timestamp
                    res[i].remain = recent_contact.remain
                }
            }
            localforage.setItem("recent_contacts", res)
            return res
        })
    }
    static getContactHistory(type, receiverId) {
        return localforage.getItem(type + "_" + receiverId).then(res => {
            return res||[]
        })
    }

    static addMailbox(message) {
        if (!message.receiverId || !message.type) {
            return;    
        }
        const receiverId = message.type === "group" ? message.groupId : message.receiverId

        return localforage.getItem("mailbox" + "_" + message.type + "_" + receiverId).then(res => {
            res = [message, ...res]
            localforage.setItem("mailbox" + message.type + "_" + receiverId, res)
            return res
        })
    }

    static getMailbox(type, receiverId) {
        return localforage.getItem("mailbox" + "_" + type + "_" + receiverId).then(res => {
            return res
        })
    }

    static deleteMailbox(messageId, type, receiverId) {
        const mailboxKey = `mailbox_${type}_${receiverId}`;
        return localforage.getItem(mailboxKey).then(res => {
            if (res) {
                // 过滤掉与 messageId 匹配的消息
                const updatedMailbox = res.filter(message => message.id !== messageId);
                // 更新存储
                return localforage.setItem(mailboxKey, updatedMailbox).then(() => updatedMailbox);
            }
            return [];
        });
    }

    static addMessage(message) {
        this.addContactHistory(message)
        this.addMailbox(message)
    }
}
