// This util is used to processing the messages

export default class MessageProcessingUtil {


    //this can be used only when it comes to initialization stage.
    static async extractUnreadedMessages() {
        let unreadMessageList = []
        await localforage.getItem("friendsList").then(async friendList => {
            if (!friendList) {
                return
            }
            for (let i = 0; i < friendList.length; i++) {

                await localforage.getItem("send_from_" + friendList[i].userId).then(messages => {
                    for (let j = 0; j < messages.length; j++) {
                        if (messages[j].messageId > friendList[i].lastRead) {
                            unreadMessageList.push(messages[j])
                        }
                    }
                })
            }
            // Math.sort()
        })
        await localforage.setItem("unreadMessageList", unreadMessageList)
    }


    static async addUnreadedMessages(message) {
        await localforage.getItem("send_from_" + message.senderId).then(async list => {
            list.push(message)
            await localforage.setItem("send_from_" + message.senderId).then(() => {
                console.log("update new messages successfully")
            })

        })

        await localforage.getItem("mailBox").then(async list => {
            if (!list) list = []
            list.push(message)
            await localforage.setItem("mailBox", list)
        })

    }

}
