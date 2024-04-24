// const workerTimer = {
//     id: 0,
//     callbacks: {},
//     setInterval: function (cb, interval, context) {
//         this.id++;
//         const id = this.id;
//         this.callbacks[id] = { fn: cb, context: context };
//         worker.postMessage({
//             command: 'interval:start',
//             interval: interval,
//             id: id,
//         });
//         return id;
//     },
//     setTimeout: function (cb, timeout, context) {
//         this.id++;
//         const id = this.id;
//         this.callbacks[id] = { fn: cb, context: context };
//         worker.postMessage({ command: 'timeout:start', timeout: timeout, id: id });
//         return id;
//     },
//     // 监听worker 里面的定时器发送的message 然后执行回调函数
//     onMessage: function (e) {
//         switch (e.data.message) {
//             case 'interval:tick':
//             case 'timeout:tick': {
//                 const callbackItem = this.callbacks[e.data.id];
//                 if (callbackItem && callbackItem.fn)
//                     callbackItem.fn.apply(callbackItem.context);
//                 break;
//             }



//             case 'interval:cleared':
//             case 'timeout:cleared':
//                 dlete this.callbacks[e.data.id];
//                 break;
//         }
//     },

//     // 往worker里面发送销毁指令
//     clearInterval: function (id) {
//         worker.postMessage({ command: 'interval:clear', id: id });
//     },
//     clearTimeout: function (id) {
//         worker.postMessage({ command: 'timeout:clear', id: id });
//     },
// };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



importScripts("localforage.min.js")
let flag = true

console.log("trying to connect")
localforage.getItem("userId").then(
    res => {
        let socket = new WebSocket("ws://localhost:8080/notification/" + res)
        let messageHandler = (event) => {
            console.log(event)
            //isTrusted: true, data: 'success', origin: 'ws://localhost:8080', lastEventId: '', source: null, …
            if (event.data === "success") {
            } else {
                let result = JSON.parse(event.data)
                localforage.getItem("chatLastUpdate").then(async res => {
                    if (res > result.sendTime) return
                    else {
                        if (result.type === "single") {
                            console.log("this is a single class")
                            await localforage.getItem("send_from_" + result.userId).then(res => {
                                localforage.setItem("send_from_" + result.userId, [event.data, ...res])
                            }).then(() => {
                                localforage.setItem("chatLastUpdate", Math.max(res, result.sendTime))
                            })

                        } else if (result.type === "group") {

                        } else if (result.type === "broadcast") {
                        }
                        postMessage(result)
                    }
                }) 
                // data 

            }
            //localforage.setItem("chatLastUpdate", )
        }
        let openHandler = function (e) {
            console.log("ws open successfully!!!!")
            flag = false
        }
            let errorHandler = function (err) {
                setTimeout(() => {
                    console.log("reconnecting.......")
                    socket = new WebSocket("ws://localhost:8080/notification/" + res)
                    socket.onerror = errorHandler
                    socket.onopen = openHandler
                    socket.onmessage = messageHandler

                }, 5000)

            }

        //socket.binaryType = "text frames"
        socket.onopen = openHandler
        socket.onerror = errorHandler
        socket.onmessage = messageHandler
    }
)


