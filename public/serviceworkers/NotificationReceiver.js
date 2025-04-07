let socket;



self.addEventListener('install', (event) => {
    console.log('Service Worker 安装完成');

    event.waitUntil(self.skipWaiting());
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/\_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


// 如果用户授予了权限，则订阅推送通知




self.addEventListener('activate', (event) => {
    console.log("activated")

    event.waitUntil(self.clients.claim());  // 控制当前客户端，立即生效


    // } else {
    //     console.log('Push notification permission denied');
    // }


});
self.addEventListener('push', (e) => {

    let data = event.data.json();
    const image = 'https://cdn.glitch.com/614286c9-b4fc-4303-a6a9-a4cef0601b74%2Flogo.png?v=1605150951230';
    const options = {
        body: data.options.body,
        icon: image
    }
    self.registration.showNotification(
        data.title,
        options
    );
});

self.addEventListener('message', (event) => {
    console.log('Service Worker 收到消息:', event.data);
    let data = event.data.json();
    const image = 'https://cdn.glitch.com/614286c9-b4fc-4303-a6a9-a4cef0601b74%2Flogo.png?v=1605150951230';
    const options = {
        body: data.options.body,
        icon: image
    }
    self.registration.showNotification(
        data.title,
        options
    );
    // 触发通知
    if (event.data && event.data.type === 'notification') {
        self.registration.showNotification(event.data.title, {
            body: event.data.message,
            icon: '/icon.png'
        });
    }
});

self.addEventListener('push', (event) => {
    console.log('收到推送消息:', event.data.text());
    const message = JSON.parse(event.data.text())
    console.log(message)
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.message,
            icon: '/icon.png'
        })
    );
});
