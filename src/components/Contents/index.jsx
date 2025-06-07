import Item from "./Item"
import { Route, Routes, useNavigate, Navigate, redirect, BrowserRouter, useLocation, } from 'react-router-dom'
import NotFound from "./NotFound"
import React from "react"
import { Snackbar } from "@mui/material"
import UserInfo from "./UserInfo"
import TextEditor from "./TextEditor"
import Videos from "./Videos"
import NetworkError from "../Errors/NetworkError"
import Chat from "./Chat"
import Settings from "./Settings"
import AppStore from "./AppStore"
import Friends from "./FriendList"
import LongVideos from "./LongVideos"
import UploadFile from "./UploadFile"
import VideoList from "./VideoList"
import SearchResult from "./SearchResult"
import FriendIntroductionCentered from "./Introductions/FriendIntroductionCentered"
import "../../App.css"
import Header from "../Header"
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {update} from "../redux/refreshMessages"
import Box from '@mui/material/Box';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import UserInitializer from "../../util/io_utils/UserInitializer"
import LongVideoIntroduction from "./Introductions/LongVideoIntroduction"

import Trends from "./Trends"
import Downloads from "./Downloads"
import About from "./About"
import BotChat from "./BotChat"
import ResetPassword from "./ResetPassword"
import RolePermissionPage from "./RolePermissionPage"
import UserManagementPage from "./UserManagementService"
import { useDispatch } from "react-redux"
import DownloadRequestManager from "./DownloadRequestManager"
import UpdateLog from "./UpdateLog"
import MessageUtil from "../../util/io_utils/MessageUtil"
import { useNotification } from '../../Providers/NotificationProvider';
import DatabaseManipulator from "../../util/io_utils/DatabaseManipulator"
// import {update} from "../redux/refresh"


const defaultTheme = createTheme();

export default function Contents(props) {
    //state bar
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: "helloworld"
    });

    const { setLogin } = props

    const [avatar, setAvatar] = useState(null)
    const [badgeContent, setBadgeContent] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)


    const { vertical, horizontal, open, message } = state;
    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const [refresh, setRefresh] = useState(false)
    const [notifications, setNotifications] = useState([])
    //const [chatRecords, setChatRecords] = useState([])
    const [userRecords, setUserRecords] = useState([])
    const [sideBarSelector, setSideBarSelector] = useState()
    const location = useLocation()
    const { showNotification } = useNotification();

    // useEffect(()=>{
    //     if (!location.pathname.startsWith("/chat")) {
    //         setSideBarSelector(null)
    //     }

    // },[location])

    // const register = async () => {
    //     await localforage.getItem(
    //         "recent_contacts"
    //     ).then(res => {
    //         if (!res) res = []
    //         //refractor this, just add hitory user.
    //         setUserRecords(res)
    //     }
    //     ).then(() => {
    //     })
    // }

    // useLayoutEffect(() => {
    //     UserInitializer.init()
    //     register()
    // }, [])
const dispatcher = useDispatch()
useEffect(() => {
    const worker = new Worker("/webworkers/NotificationReceiver.js",{ type: 'module' });

    // 1. 一启动就设置 token（发送给 Worker）
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
        worker.postMessage({ action: "setToken", key: userId, value: token });
        console.log("Sent token and userId to worker");
    }

    // 2. 监听消息
    worker.onmessage = (event) => {
        const { action } = event.data;
        console.log("Main thread received:", event.data);

        if (action === "updateNotification") {
            console.log("Updating notification");
            dispatcher(update());
        } else if (action === "workerReady") {
            console.log("Worker is ready");
        } else if (action === "connectionFailed") {
            console.warn("WebSocket connection failed");
        }
    };

    // 3. 错误处理
    worker.onerror = (event) => {
        console.error("Worker error:", event);
    };

    // 4. 清理
    return () => {
        console.log("Cleaning up worker");
        worker.terminate();
    };
}, []);

    useEffect(() => {

        // if (! worker ) return 
        // worker.onmessage = (e) => {
        //     //setRefresh(!refresh)
        //     //update userList
        //     let flag = false
        //     for (let i = 0; i < userRecords.length; i++) {
        //         if (userRecords[i].userId === e.data.userId) {
        //             //in the list 
        //             flag = true
        //             if (sideBarSelector === e.data.userId) {
        //                 //selected, no ops
        //                 break
        //             }
        //             else {
        //                 // not selected but in the list
        //                 // todo :change the order to first
        //                 userRecords[i].new = true
        //                 setUserRecords([userRecords[i], ...userRecords.slice(0, i), ...userRecords.slice(i + 1)])
        //                 break
        //             }

        //         }
        //     }
        //     if (!flag) {
        //         //not in the list, not selcted, add to the first one 
        //         localforage.getItem("friendList").then(list => {
        //             if (!list) return
        //             let contact = { "userId": list[e.data.userId].userId, "name": list[e.data.userId].name, "avatar": list[e.data.userId].avatar, new: true }
        //             localforage.setItem("recent_contacts", [contact, ...userRecords]).then(() => {
        //             }).then(() => {
        //                 setUserRecords([contact, ...userRecords])
        //             })
        //         })
        //     }


        //     //update messageList


        //     if (sideBarSelector === e.data.userId) {
        //         setChatRecords([...chatRecords, e.data])
        //     }
        //     if (sideBarSelector !== e.data.userId) {
        //         setNotifications([e.data, ...notifications])
        //     }
        //     //update notificationList
        // }
    }, [sideBarSelector, notifications])

    const markAsRead = (type,userId) => {
        MessageUtil.markAsRead(type, userId).then((res) => {
            console.log(res)
            if (res && res.data && res.data.code === 0) {
                console.log("Marked as read successfully")
                // Update the notifications state to remove the read message
                DatabaseManipulator.changeCountOfRecentContact(type, userId, 0).then(() => {
                    DatabaseManipulator.deleteUnreadMessage(type, userId).then(() => {
                        const updatedList = notifications.filter(notification => {
                            console.log("Filtering notification:", notification, "with userId:", userId, "and type:", type);
                            return !(notification.senderId === userId && notification.type === type);
                        });
                        console.log("Updated notifications list:", updatedList);
                        setNotifications(updatedList);
                        dispatcher(update())


                    })
                })

            } else {
                showNotification("Failed to mark as read", "error")
            }
        })


    }

    useState(()=> {
        MessageUtil.getUnreadMessages().then((res)=> {
           if (res && res.data && res.data.code === 0) {
            console.log(res.data.message)
            DatabaseManipulator.clearUnreadMessages().then(() => {
                const messages = JSON.parse(res.data.message)
                DatabaseManipulator.insertUnreadMessages(messages).then(() => {
                    DatabaseManipulator.addRecentContacts(messages).then(() => {
                        setNotifications(messages)
                        dispatcher(update())
                    })
                })
            })
           } else {
            showNotification("Failed to fetch unread messages", "error")
           }

        })
    },[])


    console.log(sideBarSelector)
    //state = {articles:[{id:1},{id:2},{id:3},], pagesize:5}
    return (
        < ThemeProvider theme={defaultTheme} >
            <Box sx={{ display: 'flex' }}>
                <Header avatar={avatar} setAvatar={setAvatar}  setLogin={setLogin}  notifications={notifications} setNotifications={setNotifications} markAsRead ={markAsRead}></Header>
                <Box width="calc(100% - 64px)" justifyContent="center" alignItems="center" marginTop="64px">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div>
                            <div>
                                <Routes>
                                    <Route path="/" element={<Item barState={state} setBarState={setState} status={props} />}></Route>
                                    {/* <Route path="/signup" element={<SignUp barState={state} setBarState={setState} status={props}/>}></Route> */}
                                    <Route path="/userinfo" element={<UserInfo barState={state} setBarState={setState} status={props}></UserInfo>}></Route>
                                    <Route path="/editor" element={<TextEditor barState={state} setBarState={setState} status={props}></TextEditor>}></Route>
                                    <Route path="/videos" element={<Videos barState={state} setBarState={setState} status={props}></Videos>}></Route>
                                    <Route path="/chat" element={<Chat barState={state} setBarState={setState} status={props} 
                                    sideBarSelector={sideBarSelector} setSideBarSelector={setSideBarSelector} notifications={notifications} 
                                    setNotifications={setNotifications} markAsRead={markAsRead}></Chat>}></Route>
                                    <Route path="/settings" element={<Settings barState={state} setBarState={setState} status={props}></Settings>}></Route>
                                    <Route path="/notfound" element={<NetworkError barState={state} setBarState={setState} status={props} ></NetworkError>}></Route>
                                    <Route path="/friends" element={<Friends barState={state} setBarState={setState} status={props}></Friends>}></Route>
                                    {/* <Route path="/contacts" element={<Contacts barState={state} setBarState={setState} status={props}></Contacts>}></Route> */}
                                    <Route path="/error" element={<NetworkError></NetworkError>}></Route>
                                    <Route path="/appstore" element={<AppStore barState={state} setBarState={setState} status={props}> </AppStore>}></Route>
                                    <Route path="/longvideos" element={<LongVideos setBarState={setState} status={props}></LongVideos>}></Route>
                                    <Route path="/upload" element={<UploadFile setBarState={setState} status={props}></UploadFile>}></Route>
                                    <Route path="/videolist" element={<VideoList setBarState={setState} status={props}></VideoList>}></Route>
                                    <Route path="/searchresult" element={<SearchResult> </SearchResult>}></Route>
                                    <Route path="/friendInfomation" element={<FriendIntroductionCentered ></FriendIntroductionCentered>}></Route>
                                    <Route path="/videoIntroduction" element={<LongVideoIntroduction></LongVideoIntroduction>}> </Route>
                                    <Route path="/trending" element={<Trends></Trends>}> </Route>
                                    <Route path="/download" element={<Downloads></Downloads>}></Route>
                                    <Route path="/about" element={<About> </About>}> </Route>
                                    <Route path="/qa" element={<BotChat></BotChat>}></Route>
                                    <Route path="/reset" element={<ResetPassword></ResetPassword>}></Route>
                                    <Route path="/role" element={<RolePermissionPage></RolePermissionPage>}></Route>
                                    <Route path="/userManage" element={<UserManagementPage></UserManagementPage>}></Route>
                                    <Route path="/role" element={<RolePermissionPage></RolePermissionPage>}></Route>
                                    <Route path="/downloadRequestsManager" element={<DownloadRequestManager></DownloadRequestManager>} ></Route>
                                    <Route path="/logs" element={<UpdateLog></UpdateLog>} ></Route>
                                    <Route path="*" element={<NotFound barState={state} setBarState={setState} status={props} />} ></Route>

                                </Routes>
                            </div>
                            <div>
                                <Snackbar
                                    anchorOrigin={{ vertical, horizontal }}
                                    open={open}
                                    onClose={handleClose}
                                    message={message}
                                    key={vertical + horizontal}
                                />
                            </div>
                        </div>
                    </LocalizationProvider>
                    {/* <Footer description='good' title='morning'></Footer> */}
                </Box>
            </Box>

        </ThemeProvider >


    )

}