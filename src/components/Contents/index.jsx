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
import FriendIntro from "./FriendList/FriendIntro"
import FriendIntroductionCentered from "./Introductions/FriendIntroductionCentered"
import "../../App.css"
import Header from "../Header"
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Footer from "../Footer"
import {update} from "../redux/refreshMessages"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import UserInitializer from "../../util/io_utils/UserInitializer"
import LongVideoIntroduction from "./Introductions/LongVideoIntroduction"
import localforage from "localforage"
import { useLayoutEffect } from "react"
import Trends from "./Trends"
import Downloads from "./Downloads"
import About from "./About"
import BotChat from "./BotChat"
import ResetPassword from "./ResetPassword"
import RolePermissionPage from "./RolePermissionPage"
import UserManagementPage from "./UserManagementService"
import { useDispatch } from "react-redux"
import ApproveMovieRequest from "./DownloadRequestManager"
import DownloadRequestManager from "./DownloadRequestManager"
import Iridescence from "../../Animations/Iridescence/Iridescence"
import UpdateLog from "./UpdateLog"

import { useNotification } from '../../Providers/NotificationProvider';

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

    const register = async () => {
        await localforage.getItem(
            "recent_contacts"
        ).then(res => {
            if (!res) res = []
            //refractor this, just add hitory user.
            setUserRecords(res)
        }
        ).then(() => {
            // setWorker(new Worker(`${process.env.PUBLIC_URL}/webworkers/NotificationReceiver.js`))
        })
    }

    useLayoutEffect(() => {
        UserInitializer.init()
        register()
    }, [])
    const dispatcher = useDispatch()
    useEffect(() => {
        const worker = new Worker("webworkers/NotificationReceiver.js");

        // 主线程接收 Worker 消息
        worker.onmessage = (event) => {
            const {action, key, value} = event.data
            console.log(event.data)
            if (action ==="setToken") {
                const token = localStorage.getItem("token")
                const userId = localStorage.getItem("userId")
                worker.postMessage({action:"setToken", key: userId, value: token})
            } else if (action === "updateNotification") {
                console.log("updating notification")
                dispatcher(update())
            } 
            console.log("Main thread received:", event.data);
            //setResult(event.data.result);
        };
        worker.onerror = (event) => {
            console.log(event)
        }

        // 向 Worker 发送消息
        //worker.postMessage({ num: 5 });

        // 清理 Worker 实例
        return () => worker.terminate();
    }, [])

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

    console.log(sideBarSelector)
    //state = {articles:[{id:1},{id:2},{id:3},], pagesize:5}
    return (
        < ThemeProvider theme={defaultTheme} >
            <Box sx={{ display: 'flex' }}>
                <Header avatar={avatar} setAvatar={setAvatar} badgeContent={notifications} setLogin={setLogin} setBadgeContent={setNotifications}></Header>
                <Box width="100%" justifyContent="center" alignItems="center" marginTop="64px">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div>
                            <div>
                                <Routes>
                                    <Route path="/" element={<Item barState={state} setBarState={setState} status={props} />}></Route>
                                    {/* <Route path="/signup" element={<SignUp barState={state} setBarState={setState} status={props}/>}></Route> */}
                                    <Route path="/userinfo" element={<UserInfo barState={state} setBarState={setState} status={props}></UserInfo>}></Route>
                                    <Route path="/editor" element={<TextEditor barState={state} setBarState={setState} status={props}></TextEditor>}></Route>
                                    <Route path="/videos" element={<Videos barState={state} setBarState={setState} status={props}></Videos>}></Route>
                                    <Route path="/chat" element={<Chat barState={state} setBarState={setState} status={props} sideBarSelector={sideBarSelector} setSideBarSelector={setSideBarSelector} ></Chat>}></Route>
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
                    <Footer description='good' title='morning'></Footer>
                </Box>
            </Box>

        </ThemeProvider >


    )

}