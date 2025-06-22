import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import store from './components/redux/store';
import { Provider } from 'react-redux'
import axios from 'axios';
import MessageUtil from './util/io_utils/MessageUtil';
import { NotificationProvider } from './Providers/NotificationProvider';
import { SearchProvider } from './Providers/SearchProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <SearchProvider>
            <NotificationProvider>
                <App />
            </NotificationProvider>
        </SearchProvider>
    </Provider>

);



function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// {
// "subject": "mailto: <czhdawang@163.com>",
//     "publicKey": "BIj6_xFJvgWJ-pkyZ7f6wZx_c3ADpQ6-Nn15pkV-x6H4IVphCHI_SAhWFrnVFgOHMClMYcMDunL257Y5OBPdBsQ",
//         "privateKey": "uq-ULi8JmdsjWUTou6lM6tAhUU6mOfv_YyFdz4I0lJI"
// }
function register(serviceWorkerRegistration) {
    const options = {
        userVisibleOnly: true,
        applicationServerKey: "BCv57yQ_LSAqOE4H_DxF9MrqT8zJbKop3kMYB2EudL9uJCP4AvAnn4a6TVgh1Su0jx3KcrXwt7tukFE9S9yW3ns",
    };
    serviceWorkerRegistration.pushManager.subscribe(options).then(
        (pushSubscription) => {
            var endpoint = pushSubscription.endpoint;
            var key = pushSubscription.getKey('p256dh');
            var auth = pushSubscription.getKey('auth');

            MessageUtil.registerEndPoint(endpoint, key, auth)
            // The push subscription details needed by the application
            // server are now available, and can be sent to it using,
            // for example, the fetch() API.
        },
        (error) => {
            // During development it often helps to log errors to the
            // console. In a production environment it might make sense to
            // also report information about errors back to the
            // application server.
            console.error(error);
        },
    );
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(existingRegistration => {
        if (existingRegistration) {
            console.log('Service Worker already registered:', existingRegistration.scope);
        } else {
            console.log('No Service Worker found. Registering a new one...');
            navigator.serviceWorker.register('/serviceworkers/NotificationReceiver.js').then(
                registration => {
                    console.log('Service Worker registered successfully:', registration.scope);

                    navigator.serviceWorker.ready.then(readyRegistration => {
                        console.log('Service Worker is ready:', readyRegistration.scope);

                        if (Notification.permission === 'granted') {
                            console.log('Notifications permission already granted.');
                            register(readyRegistration);
                        } else if (Notification.permission === 'default') {
                            Notification.requestPermission().then(permission => {
                                if (permission === 'granted') {
                                    console.log('Notifications permission granted.');
                                    register(readyRegistration);
                                } else {
                                    console.log('Notifications permission denied.');
                                }
                            });
                        } else {
                            console.log('Notifications permission denied.');
                        }
                    });
                },
                error => {
                    console.error('Service Worker registration failed:', error);
                }
            );
        }
    }).catch(error => {
        console.error('Error checking Service Worker registration:', error);
    });
} else {
    console.error('Service workers are not supported in this browser.');
}
