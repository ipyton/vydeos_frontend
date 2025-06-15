import localforeage from 'localforage';
import { Database } from 'lucide-react';
import MessageUtil from './MessageUtil';
import DatabaseManipulator from './DatabaseManipulator';

export default class MessageMiddleware {

    static async isSessionMessageIdContinuous(startId, messages) {
        if (!Array.isArray(messages) || messages.length === 0) return true;

        for (let i = 0; i < messages.length; i++) {
            const expectedId = startId - i;
            if (messages[i].sessionMessageId !== expectedId) {
                console.log(`Not continuous at index ${i}: expected ${expectedId}, got ${messages[i].sessionMessageId}`);
                return false;
            }
        }

        return true;
    }

    /**
     * 补全 sessionMessageId 的缺失消息
     * @param {number} startId 起始 sessionMessageId（递减方向）
     * @param {number} limit 总共需要多少条
     * @param {Array<Object>} from_network 网络获取的数据（包含 sessionMessageId）
     * @param {Array<Object>} from_local 本地已有的数据（包含 sessionMessageId）
     * @returns {{
     *   filled: Array<Object>,      // 最终补足后 limit 条数据
     *   missingFromLocal: Array<Object> // 补进来的那些 from_network 中的
     * }}
     */

static fillMissingMessages(lastMessageSessionId, limit, from_network, from_local) {
    if (lastMessageSessionId <= 0) {
        return { filled: [], missingFromLocal: [] };
    }
    
    // 创建 Map 时使用复合键来避免冲突
    const localMap = new Map(from_local.map(m => [`${m.messageId}-${m.sessionMessageId}`, m]));
    const networkMap = new Map(from_network.map(m => [`${m.messageId}-${m.sessionMessageId}`, m]));

    const filled = [];
    const missingFromLocal = [];
    const seenMessageIds = new Set(); // 添加去重检查

    for (let i = 0; i < limit; i++) {
        const targetId = lastMessageSessionId - i;
        const localKey = `${targetId}-${targetId}`; // 根据实际数据结构调整
        
        if (localMap.has(localKey)) {
            const message = localMap.get(localKey);
            if (!seenMessageIds.has(message.messageId)) {
                filled.push(message);
                seenMessageIds.add(message.messageId);
            }
        } else if (networkMap.has(localKey)) {
            const fromNet = networkMap.get(localKey);
            if (!seenMessageIds.has(fromNet.messageId)) {
                filled.push(fromNet);
                missingFromLocal.push(fromNet);
                seenMessageIds.add(fromNet.messageId);
            }
        } else {
            break;
        }
    }

    return {
        filled,
        missingFromLocal
    };
}

    static async getContactHistory(type, userId, limit = 15, lastSessionMessageId, groupId) {
        return DatabaseManipulator.getContactHistory(type, userId, lastSessionMessageId,limit,groupId).then(localRes=>{
            console.log(localRes)

            if (MessageMiddleware.isSessionMessageIdContinuous(lastSessionMessageId, localRes) && localRes.length >= limit) {
                return localRes;
            }
            else {
                return MessageUtil.getMessageRecords(type,userId, limit, lastSessionMessageId,groupId).then(async networkRes=> {
                    const result =  MessageMiddleware.fillMissingMessages(lastSessionMessageId, limit, JSON.parse(networkRes.data.message) , localRes||[])
                    console.log(result)
                    await DatabaseManipulator.addContactHistories(result.missingFromLocal)

                    return result.filled.reverse()
                })
            }
        })
    }

}