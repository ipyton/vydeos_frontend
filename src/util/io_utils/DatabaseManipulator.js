import localforage from "localforage";

export default class DatabaseManipulator {
    async addRecentContact(contact) {
        const res = await localforage.getItem("recent_contacts");
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

    async contactComeFirst(type, id) {
        const res = await localforage.getItem("recent_contacts");
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

    getRecentContact(type, id) {
        return localforage.get("recent_contacts")
    }

    addContactHistory(message) {
        return localforage.get(message.type + "_" + message.receverId).then(res => {
            localforage.setItem(message.type + "_" + message.receiver, [message, ...res])
            contactComeFirst(message.type, message.receverId)
            return res
        })
    }

    getContactHistory(type, receiverId) {
        return localforage.get(type + "_" + receiverId).then(res => {
            return res
        })
    }


}
