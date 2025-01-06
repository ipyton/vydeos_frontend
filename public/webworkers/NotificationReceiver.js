//刚启动的时候
importScripts('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');

let socket;



const connectWebSocket = (url) => {
    console.log("asdasdasd------")
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
    axios({
        url: "localhost:5050" + "/chat/getAll",
        method: 'post',
        data: { token: localStorage.getItem("token") },
        transformRequest: [function (data) {
            return Qs.stringify(data)
        }],
        headers: {
            tokens: localStorage.getItem("token"),
        }
    }).catch(err => {
        console.log(err)
    }).then(
        async response => {
            if (response === undefined || response.data === undefined) {
                console.log("login error")
                return
            }
            let responseData = response.data
            await localforage.setItem("userId", response.data.message)
            setState(responseData.code === 1)
            console.log(responseData.code === 1)
        }
    )
}
