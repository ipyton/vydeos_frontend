//刚启动的时候
importScripts('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');
importScripts("/webworkers/DatabaseManipulator.js");
importScripts('https://cdn.jsdelivr.net/npm/qs/dist/qs.min.js');


let socket;

let token;

const connectWebSocket = (url) => {
    console.log(url)
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket 连接已打开');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('接收到消息:', data);
            // 将消息传递给 Service Worker
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage(data);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket 错误:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket 连接已关闭');
        };
    }
};
console.log("webworker start ----")

function getNewestMessages() {
    DatabaseManipulator.getTimestamp().then((timestamp) => {
        if (!timestamp) {
            timestamp = -1
        }
        axios({
        url: "http://localhost:8080" + "/chat/getNewestMessages",
        method: 'post',
        data:{
            timestamp: timestamp
        },

    headers: {
            token: token,
            'Content-Type': 'application/json',

        }
    }).catch(err => {
        console.log(err)
    }).then(
        async response => {
            if (response === undefined || response.data === undefined) {
                console.log("error")
                return
            }
            if (!response || !response.data || !response.data.message) {
                console.log("error")
                return
            }
            DatabaseManipulator.batchAddContactHistory(JSON.parse(response.data.message)).then(
                ()=>{
                }
            )
            //console.log(JSON.parse(response.data.message))
            // await localforage.setItem("userId", response.data.message)
            // setState(responseData.code === 1)
            // console.log(responseData.code === 1)
        }
    )

    })

}
onmessage = (event) => {
    const {action, key, value} = event.data
    console.log(event.data)
    if (action === "setToken") {
        token = value
        getNewestMessages()

    }
}

postMessage({action:"setToken", key:"key", value:"value"})

//getNewestMessages()

