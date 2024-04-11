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
//                 delete this.callbacks[e.data.id];
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


setTimeout(function () {
    console.log("sending message")
    socket.send({ userID: 88488, time: 9238042, method: "get" })
}, 1000)


worker.onmessage = workerTimer.onMessage.bind(workerTimer);