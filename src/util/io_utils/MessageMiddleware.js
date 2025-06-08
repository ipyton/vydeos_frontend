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


    static async fillMissingMessages(lastMessageSessionId, limit, from_network, from_local) {
        const localMap = new Map(from_local.map(m => [m.sessionMessageId, m]));
        const networkMap = new Map(from_network.map(m => [m.sessionMessageId, m]));

        const filled = [];
        const missingFromLocal = [];

        for (let i = 0; i < limit; i++) {
            const targetId = lastMessageSessionId - i;

            if (localMap.has(targetId)) {
                filled.push(localMap.get(targetId));
            } else if (networkMap.has(targetId)) {
                const fromNet = networkMap.get(targetId);
                filled.push(fromNet);
                missingFromLocal.push(fromNet);
            } else {
                // 不存在于任一来源，可选：跳过或填 null
                break; // 如果你希望“必须连续”，这里可以 return 失败
            }
        }

        return {
            filled,
            missingFromLocal
        };
    }


    static async getContactHistory(type, userId, limit = 15, lastSessionMessageId = 0) {
        return DatabaseManipulator.getContactHistory(type, userId, limit, lastSessionMessageId).then(localRes=>{
            if (MessageMiddleware.isSessionMessageIdContinuous(lastSessionMessageId, localRes)) {
                return localRes;
            }
            else {
                return MessageUtil.getMessageRecords(type,userId, limit, lastSessionMessageId).then(async networkRes=> {
                    const result = MessageMiddleware.fillMissingMessages(lastSessionMessageId, limit, networkRes, localRes)
                    DatabaseManipulator.addContactHistories(result.missingFromLocal)
                    return result.filled
                })
            }
        })
    }

}