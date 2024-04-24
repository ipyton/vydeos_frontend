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
import { stepButtonClasses } from '@mui/material';
import IOUtil from '../../util/ioUtil';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import UserInitializer from "../../util/UserInitializer"
import LongVideoIntroduction from "./Introductions/LongVideoIntroduction"
import localforage from "localforage"
import { useLayoutEffect } from "react"
const defaultTheme = createTheme();

export default function Contents(props) {
    //state bar
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: "helloworld"
    });

    const [avatar, setAvatar] = useState(null)
    const [badgeContent, setBadgeContent] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)


    const { vertical, horizontal, open, message } = state;
    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const [refresh, setRefresh] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [chatRecords, setChatRecords] = useState([])
    const [userRecords, setUserRecords] = useState([])
    const [sideBarSelector, setSideBarSelector] = useState("")
    const [worker, setWorker] = useState(null)
    const location = useLocation()
    console.log(location)
    useEffect(()=>{
        if (!location.pathname.startsWith("/chat")) {
            setSideBarSelector(null)
        }

    },[location])

    const register = async () => {
        await localforage.getItem(
            "recent_contacts"
        ).then(res => {
            if (!res) res = []
            //refractor this, just add hitory user.
            setUserRecords(res)
        }
        ).then(() => {
            setWorker(new Worker("./webworkers/NotificationReceiver.js"))
        })
    }

    useLayoutEffect(() => {
        //
        UserInitializer.init()
        register()
    }, [])

    useEffect(()=>{
        if (! worker ) return 
        worker.onmessage = (e) => {
            //setRefresh(!refresh)
            //update userList
            let flag = false
            for (let i = 0; i < userRecords.length; i++) {
                if (userRecords[i].userId === e.data.userId) {
                    //in the list 
                    flag = true
                    if (sideBarSelector === e.data.userId) {
                        //selected, no ops
                        break
                    }
                    else {
                        // not selected but in the list
                        // todo :change the order to first
                        userRecords[i].new = true
                        setUserRecords([userRecords[i], ...userRecords.slice(0, i), ...userRecords.slice(i + 1)])
                        break
                    }

                }
            }
            if (!flag) {
                //not in the list, not selcted, add to the first one 
                localforage.getItem("friendList").then(list => {
                    if (!list) return
                    let contact = { "userId": list[e.data.userId].userId, "name": list[e.data.userId].name, "avatar": list[e.data.userId].avatar, new: true }
                    localforage.setItem("recent_contacts", [contact, ...userRecords]).then(() => {
                    }).then(() => {
                        setUserRecords([contact, ...userRecords])
                    })
                })
            }

            //update messageList


            if (sideBarSelector === e.data.userId) {
                setChatRecords([...chatRecords, e.data])
            }
            if (sideBarSelector !== e.data.userId) {
                setNotifications([e.data, ...notifications])
            }
            //update notificationList
            console.log("updated")
        }
    },[worker, sideBarSelector, chatRecords, notifications])

    console.log("sidebar")
    console.log(sideBarSelector)

    //state = {articles:[{id:1},{id:2},{id:3},], pagesize:5}
    return (
        < ThemeProvider theme={defaultTheme} >

                <Box sx={{ display: 'flex' }}>
                    <Header avatar={avatar} setAvatar={setAvatar} badgeContent={notifications} setBadgeContent={setNotifications}></Header>
                    <Box width="100%" justifyContent="center" alignItems="center" sx={{ marginTop: window.innerHeight * 0.01 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div>
                                <div>
                                    <Routes>
                                        <Route path="/" element={<Item barState={state} setBarState={setState} status={props} />}></Route>
                                        {/* <Route path="/signup" element={<SignUp barState={state} setBarState={setState} status={props}/>}></Route> */}
                                        <Route path="/userinfo"  element={<UserInfo barState={state} setBarState={setState} status={props}></UserInfo>}></Route>
                                        <Route path="/editor"  element={<TextEditor barState={state} setBarState={setState} status={props}></TextEditor>}></Route>
                                        <Route path="/videos"  element={<Videos barState={state} setBarState={setState} status={props}></Videos>}></Route>
                                        <Route path="/chat" element={<Chat barState={state} setBarState={setState} status={props} sideBarSelector={sideBarSelector} setSideBarSelector={setSideBarSelector} chatRecords={chatRecords} setChatRecords={setChatRecords} setUserRecords={setUserRecords} userRecords={userRecords}></Chat>}></Route>
                                        <Route path="/settings"  element={<Settings barState={state} setBarState={setState} status={props}></Settings>}></Route>
                                        <Route path="/notfound"  element={<NetworkError barState={state} setBarState={setState} status={props} ></NetworkError>}></Route>
                                        <Route path="/friends"  element={<Friends barState={state} setBarState={setState} status={props}></Friends>}></Route>
                                        {/* <Route path="/contacts" element={<Contacts barState={state} setBarState={setState} status={props}></Contacts>}></Route> */}
                                        <Route path="/error"  element={<NetworkError></NetworkError>}></Route>
                                        <Route path="/appstore"  element={<AppStore barState={state} setBarState={setState} status={props}> </AppStore>}></Route>
                                        <Route path="/longvideos"  element={<LongVideos setBarState={setState} status={props}></LongVideos>}></Route>
                                        <Route path="/upload"  element={<UploadFile setBarState={setState} status={props}></UploadFile>}></Route>
                                        <Route path="/videolist"  element={<VideoList setBarState={setState} status={props}></VideoList>}></Route>
                                        <Route path="/searchresult"  element={<SearchResult> </SearchResult>}></Route>
                                        <Route path="/friendInfomation"  element={<FriendIntroductionCentered ></FriendIntroductionCentered>}></Route>
                                        <Route path="/videoIntroduction"  element={<LongVideoIntroduction></LongVideoIntroduction>}> </Route>
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