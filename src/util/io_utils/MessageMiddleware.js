import localforeage from 'localforage';
import { Database } from 'lucide-react';
import MessageUtil from './MessageUtil';

export default class MessageMiddleware {
  
    static isOverlapping(networkMessageList, localMessageList) {
        // 1. networkMessageList 为空 → 返回 true
        if (!networkMessageList || networkMessageList.length === 0) {
            return true;
        }

        // 2. networkMessageList 有内容，但 localMessageList 为空 → 返回 "no"
        if (!localMessageList || localMessageList.length === 0) {
            return false;
        }

        // 3. 构建 localMessageList 的 messageId Set，提高查重效率
        const localIds = new Set(localMessageList.map(msg => msg.messageId));

        // 4. 检查是否有重合的 messageId
        for (const netMsg of networkMessageList) {
            if (localIds.has(netMsg.messageId)) {
            return true;
            }
        }

        // 没有重合
        return false;
    }

    static deletedFilter(messageList) {
        if (!Array.isArray(messageList)) return [];

        return messageList.filter(msg => msg.delete === false || msg.delete == null);
    }

  static getMessageListByUserId(type, userId, lastMessageId) {
    // everytime query local message then compare with network message. no better way.
    //last messageId is the previous message id.
    if (!type || !userId) {
      return [];
    }
    if(!lastMessageId) {
        DatabaseManipulator.getUnreadMessages(userId).then((res) => {
            if (res == null || res.length === 0) {
                // 如果没有未读消息，访问本地
                DatabaseManipulator.getContactHistory(type, userId).then((history) => {
                    if (history && history.length > 0) {
                        // 如果有历史记录，返回最新的消息列表
                        return this.deletedFilter(history);
                    } else {
                        // 如果没有历史记录，返回空数组
                        return [];
                    }
                })
            } else {
                // 如果有未读消息，外访网络
                MessageUtil.getContactHistory(type, userId).then((history) => {
                    if (history && history.length > 0) {
                        // 如果有历史记录，返回最新的消息列表
                        return this.deletedFilter(history);
                    } else {
                        // 如果没有历史记录，返回空数组
                        return [];
                    }
                })
            }
        })
    } else {
        //分页模式

        DatabaseManipulator.getContactHistory(type, userId, lastMessageId).then((history) => {
            if (history && history.length > 0) {
                // 如果有历史记录，外访一下对比一下
                MessageUtil.getContactHistory(type, userId, lastMessageId).then((networkHistory) => {
                    if (networkHistory && networkHistory.length > 0) {
                        this.isOverlapping(networkHistory, history).then((overlap) => {
                            if (overlap) {
                                // 如果有重合，返回本地消息列表
                                return this.deletedFilter(history);
                            } else {
                                // 如果没有重合，返回网络消息列表
                                return this.deletedFilter(networkHistory);
                            }
                        });
                    } else {
                        // 如果没有网络历史记录，返回本地消息列表
                        return this.deletedFilter(history);
                    }})
                return this.deletedFilter(history);
            } else {
                // 如果没有历史记录，直接外访
                MessageUtil.getContactHistory(type, userId, lastMessageId).then((networkHistory) => {
                    if (networkHistory && networkHistory.length > 0) {
                        // 如果有网络历史记录，返回最新的消息列表
                        return this.deletedFilter(networkHistory);
                    } else {
                        // 如果没有网络历史记录，返回空数组
                        return [];
                    }
                });
            }
        });
    }

    let localMessageList = DatabaseManipulator.getMessageListByUserId(type, userId);
 

    localforage.getItem("newwork_results").then((useNetwork) => {

    })
    if (useNetwork) {
      // 如果使用网络数据，说明上次使用的是本地或者是网络
      setUseNetwork(false);
    } else {
        //如果使用的是本地，上一次也有可能是网络或者本地


    }

    // 1. 获取网络消息列表
    let networkMessageList = MessageUtil.getMessageListByUserId(type, userId);

    // 3. 检查是否有重合的消息
    if (this.isOverlapping(networkMessageList, localMessageList)) {
      // 4. 如果有重合，返回本地消息列表
      return this.deletedFilter(localMessageList);
    } else {
      // 5. 如果没有重合，返回网络消息列表
      return this.deletedFilter(networkMessageList);
    }
  }

  // Additional methods for searching messages can be added here
}