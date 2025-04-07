importScripts('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');
importScripts("/webworkers/DatabaseManipulator.js");
importScripts('https://cdn.jsdelivr.net/npm/qs/dist/qs.min.js');


let socket;

let token;

let userId;

const connectWebSocket = (url) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket 连接已打开');
        };

        socket.onmessage = (event) => {
            console.log('接收到消息:--------------', event);
            if (event.data === "success") {
                console.log("連接成功!")
             }
            else {

                DatabaseManipulator.addContactHistory(JSON.parse(event.data)).then(()=>{
                postMessage({action:"updateNotification"})
                })
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

function getNewestMessages() {
    return DatabaseManipulator.getTimestamp().then((timestamp) => {
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
            return DatabaseManipulator.batchAddContactHistory(JSON.parse(response.data.message))
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
        userId = key
        getNewestMessages().then(()=>{
            return connectWebSocket("ws://localhost:7910/notification/" + token)
        })

    }
}

postMessage({action:"setToken", key:"key", value:"value"})

//getNewestMessages()

