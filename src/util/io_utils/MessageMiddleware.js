import localforeage from 'localforage';
import { Database } from 'lucide-react';
import MessageUtil from './MessageUtil';
import DatabaseManipulator from './DatabaseManipulator';

export default class MessageMiddleware {

    static isSessionMessageIdContinuous(startId, messages) {
        if (!Array.isArray(messages) || messages.length === 0) return true;
        console.log("startId")
        console.log(startId)
        console.log(messages)
        for (let i = messages.length - 1; i >= 0 ; i --) {
            const expectedId = startId - i;
            if (messages[messages.length - i - 1].sessionMessageId !== expectedId) {
                console.log(`Not continuous at index ${messages.length - i - 1}: expected ${expectedId}, got ${messages[messages.length - i - 1].sessionMessageId}`);
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
        const localMap = new Map(from_local.map(m => [m.sessionMessageId, m]));
        const networkMap = new Map(from_network.map(m => [m.sessionMessageId, m]));
        console.log("from local")
        console.log(localMap)
        console.log(networkMap)
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
                continue;
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
                console.log("Local Only")
                console.log(lastSessionMessageId)
                return localRes;
            }
            else {
                console.log("use Internet confs")
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