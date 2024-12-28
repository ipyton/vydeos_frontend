import localforage from "localforage";

export default class DatabaseManipulator {
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
            res = [{ "userId": contact.userId, "name": contact.name, "avatar": contact.avatar, new: false, "type": "group" }, ...res];
            localforage.setItem("group_" + contact.userId, []);
        } else if (contact.type === "single") {
            res = [{ "userId": contact.userId, "name": contact.name, "avatar": contact.avatar, new: false, "type": "single" }, ...res];
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

    static getRecentContact() {
        return localforage.getItem("recent_contacts")
    }

    static addContactHistory(message) {
        console.log(message)
        return localforage.getItem(message.type + "_" + message.receiverId).then(res => {
            res = [message, ...res]
            localforage.setItem(message.type + "_" + message.receiverId, res)
            this.contactComeFirst(message.type, message.receiverId)
            return res
        })
    }

    static getContactHistory(type, receiverId) {
        return localforage.getItem(type + "_" + receiverId).then(res => {
            return res
        })
    }

    static addMailbox(message) {
        
    }

    static getMailbox() {

    }

    static deleteMailbox() {

    }


}
